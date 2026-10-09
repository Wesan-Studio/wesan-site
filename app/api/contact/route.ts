import { NextRequest, NextResponse } from 'next/server';
import { MailNotConfigured, sendMail } from '@/lib/mail';

/* Contact form endpoint. Checks run cheapest first so abusive traffic is turned away
   before the body is read. The only mail it can send goes to our own fixed addresses. */

const TOPICS = {
  general: { label: 'General', to: 'hello@wesan.co' },
  investors: { label: 'Investors', to: 'partner@wesan.co' },
  press: { label: 'Press', to: 'press@wesan.co' },
  security: { label: 'Security', to: 'security@wesan.co' },
} as const;
type Topic = keyof typeof TOPICS;

const MAX_BYTES = 16_000;
const MIN_FILL_MS = 3_000;
const MAX_LINKS = 3;
const MINUTE = 60_000;
const LIMITS = {
  burst: { max: 5, windowMs: 10 * MINUTE },
  daily: { max: 20, windowMs: 24 * 60 * MINUTE },
  global: { max: 60, windowMs: 60 * MINUTE }, // protects the Resend quota and the inbox
};

// One self-hosted instance serves the site, so in-memory sliding windows are enough.
const windows = new Map<string, number[]>();

function overLimit(key: string, { max, windowMs }: { max: number; windowMs: number }, now = Date.now()) {
  if (windows.size > 10_000) {
    for (const [k, ts] of windows) if (now - ts[ts.length - 1] > 24 * 60 * MINUTE) windows.delete(k);
  }
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  windows.set(key, recent);
  return recent.length > max;
}

function allowedOrigins() {
  const list = (process.env.ALLOWED_ORIGINS ?? 'https://wesan.co,https://www.wesan.co').split(',').map((o) => o.trim());
  return process.env.NODE_ENV === 'production' ? list : [...list, 'http://localhost:3210', 'http://127.0.0.1:3210', 'http://localhost:3000'];
}

function originOk(req: NextRequest) {
  const source = req.headers.get('origin') ?? req.headers.get('referer');
  if (!source) return false;
  try {
    return allowedOrigins().includes(new URL(source).origin);
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest) {
  // Cloudflare sets cf-connecting-ip; x-forwarded-for alone can be spoofed by the client.
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

type Body = Record<string, unknown>;

async function readBody(req: NextRequest, isJson: boolean): Promise<Body | null> {
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return null;
  try {
    const parsed = isJson ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function clean(v: unknown, max: number) {
  // Drop control characters except newline and tab, then bound the length.
  return typeof v === 'string' ? v.replace(/[^\P{C}\n\t]/gu, '').trim().slice(0, max) : '';
}

interface Message { topic: Topic; name: string; email: string; message: string }

function parse(body: Body): Message | string {
  const topic = (typeof body.topic === 'string' && body.topic in TOPICS ? body.topic : 'general') as Topic;
  const name = clean(body.name, 120).replace(/\s+/g, ' ');
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  if (!name) return 'Please add your name.';
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email)) return 'Please add a valid email address.';
  if (message.length < 10) return 'Please write a little more about what you need.';
  if ((message.match(/https?:\/\/|www\./gi) ?? []).length > MAX_LINKS) return 'Please keep links to three or fewer.';
  return { topic, name, email, message };
}

/** `t` is set in the browser when the form opens; it is missing only if the page script never ran. */
function formAge(body: Body, now = Date.now()) {
  const started = Number(body.t);
  return Number.isFinite(started) && started > 0 ? now - started : null;
}

/** Cloudflare Turnstile, enforced only when a secret is configured. */
async function humanVerified(body: Body, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  const token = clean(body['cf-turnstile-response'], 2048);
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5_000),
    });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}

function reply(isJson: boolean, status: number, payload: { ok?: true; error?: string }) {
  if (isJson) return NextResponse.json(payload, { status });
  // A plain form post (JavaScript not loaded yet) gets a readable page instead of JSON.
  const text = payload.ok ? 'Thank you. Your message reached Wesan; we reply within a week.' : payload.error;
  return new NextResponse(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

export async function POST(req: NextRequest) {
  const type = req.headers.get('content-type') ?? '';
  const isJson = type.includes('application/json');
  if (!originOk(req)) return reply(isJson, 403, { error: 'Forbidden.' });
  if (!isJson && !type.includes('application/x-www-form-urlencoded')) return reply(isJson, 415, { error: 'Unsupported request.' });

  const length = Number(req.headers.get('content-length'));
  if (!length) return reply(isJson, 411, { error: 'Invalid request.' });
  if (length > MAX_BYTES) return reply(isJson, 413, { error: 'Your message is too long.' });

  const ip = clientIp(req);
  if (overLimit(`burst:${ip}`, LIMITS.burst) || overLimit(`daily:${ip}`, LIMITS.daily)) {
    return reply(isJson, 429, { error: 'Too many messages. Please try again later.' });
  }

  const body = await readBody(req, isJson);
  if (!body) return reply(isJson, 400, { error: 'Invalid request.' });
  const age = formAge(body);
  if (age === null || age > 24 * 60 * MINUTE) return reply(isJson, 400, { error: 'Please reload the page and try again.' });
  // Honeypot or an instant submit: people take a few seconds, bots do not. Answer as if it worked and send nothing.
  if (clean(body.website, 200) || age < MIN_FILL_MS) return reply(isJson, 200, { ok: true });
  if (!(await humanVerified(body, ip))) return reply(isJson, 403, { error: 'Please complete the verification and try again.' });

  const parsed = parse(body);
  if (typeof parsed === 'string') return reply(isJson, 422, { error: parsed });
  if (overLimit('global', LIMITS.global)) return reply(isJson, 503, { error: 'We are receiving a lot of messages. Please try again in an hour.' });

  const topic = TOPICS[parsed.topic];
  try {
    await sendMail({
      to: topic.to,
      replyTo: parsed.email,
      subject: `[Wesan · ${topic.label}] ${parsed.name}`,
      text: `${parsed.message}\n\n---\nFrom: ${parsed.name} <${parsed.email}>\nTopic: ${topic.label}\nSent from the wesan.co contact form.`,
      idempotencyKey: crypto.randomUUID(),
    });
    return reply(isJson, 200, { ok: true });
  } catch (err) {
    console.error('[contact] delivery failed:', err instanceof Error ? err.message : err);
    return reply(isJson, err instanceof MailNotConfigured ? 503 : 502, { error: 'We could not send your message. Please try again later.' });
  }
}
