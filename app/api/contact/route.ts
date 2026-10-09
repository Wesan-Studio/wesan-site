import { NextRequest, NextResponse } from 'next/server';
import { MailNotConfigured, sendMail } from '@/lib/mail';

/* Recipients are chosen here, never by the client, so the form cannot relay mail to arbitrary addresses. */
const TOPICS = {
  general: { label: 'General', to: 'hello@wesan.co' },
  investors: { label: 'Investors', to: 'partner@wesan.co' },
  press: { label: 'Press', to: 'press@wesan.co' },
  security: { label: 'Security', to: 'security@wesan.co' },
} as const;
type Topic = keyof typeof TOPICS;

const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
// One self-hosted instance serves the site, so an in-memory window is enough.
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now = Date.now()) {
  if (hits.size > 5000) {
    for (const [k, ts] of hits) if (now - ts[ts.length - 1] > LIMIT.windowMs) hits.delete(k);
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT.max;
}

interface Message { topic: Topic; name: string; email: string; message: string }

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '';
}

function parse(body: Record<string, unknown>): Message | string {
  const topic = (typeof body.topic === 'string' && body.topic in TOPICS ? body.topic : 'general') as Topic;
  const name = clean(body.name, 120).replace(/\n/g, ' ');
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  if (!name) return 'Please add your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Please add a valid email address.';
  if (message.length < 10) return 'Please write a little more about what you need.';
  return { topic, name, email, message };
}

async function deliver(m: Message, id: string) {
  const t = TOPICS[m.topic];
  await sendMail({
    to: t.to,
    replyTo: m.email,
    subject: `[Wesan · ${t.label}] ${m.name}`,
    text: `${m.message}\n\n---\nFrom: ${m.name} <${m.email}>\nTopic: ${t.label}\nSent from the wesan.co contact form.`,
    idempotencyKey: `${id}-team`,
  });
  // The confirmation carries no visitor-supplied text, so it cannot be used to deliver someone else's content.
  await sendMail({
    to: m.email,
    subject: 'We have your message',
    text: `Thank you for writing to Wesan. Your message reached us and we reply to every one, usually within a week.\n\nWesan · London\nwesan.co`,
    idempotencyKey: `${id}-ack`,
  }).catch(() => undefined);
}

async function readBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    if (req.headers.get('content-type')?.includes('application/json')) return await req.json();
    return Object.fromEntries(await req.formData());
  } catch {
    return null;
  }
}

// Fetch callers get JSON; a plain form post (JavaScript not loaded yet) gets a readable page.
function reply(req: NextRequest, status: number, payload: { ok?: true; error?: string }) {
  if (req.headers.get('content-type')?.includes('application/json')) return NextResponse.json(payload, { status });
  const text = payload.ok ? 'Thank you. Your message reached Wesan; we reply within a week.' : payload.error;
  return new NextResponse(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

export async function POST(req: NextRequest) {
  // Cloudflare sets cf-connecting-ip; x-forwarded-for alone can be spoofed by the client.
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return reply(req, 429, { error: 'Too many messages. Please try again in a few minutes.' });

  const body = await readBody(req);
  if (!body) return reply(req, 400, { error: 'Invalid request.' });
  // Honeypot: people never see this field; bots fill it. Pretend success.
  if (clean(body.website, 200)) return reply(req, 200, { ok: true });

  const parsed = parse(body);
  if (typeof parsed === 'string') return reply(req, 422, { error: parsed });

  try {
    await deliver(parsed, crypto.randomUUID());
    return reply(req, 200, { ok: true });
  } catch (err) {
    console.error('[contact] delivery failed', err);
    const status = err instanceof MailNotConfigured ? 503 : 502;
    return reply(req, status, { error: 'We could not send your message. Please email hello@wesan.co directly.' });
  }
}
