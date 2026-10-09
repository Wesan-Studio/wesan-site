'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Script from 'next/script';

type Topic = 'general' | 'investors' | 'press' | 'security';
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

const TOPIC_LABELS: Record<Topic, string> = {
  general: 'General',
  investors: 'Investors and partners',
  press: 'Press',
  security: 'Security',
};
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: { sitekey: string; theme?: string }) => string; reset: (id?: string) => void } }
}

async function submit(form: HTMLFormElement): Promise<State> {
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) return { kind: 'sent' };
    const body = await res.json().catch(() => ({}));
    return { kind: 'error', message: body.error ?? 'Something went wrong. Please try again.' };
  } catch {
    return { kind: 'error', message: 'Connection failed. Please try again.' };
  }
}

function isTopic(v: string | null): v is Topic {
  return !!v && v in TOPIC_LABELS;
}

export function ContactForm({ topic: initialTopic = 'general', showTopic = true }: { topic?: Topic; showTopic?: boolean }) {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [openedAt, setOpenedAt] = useState('');
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    // Set in the browser, not at build time: the server rejects instant or script-less submissions.
    const frame = requestAnimationFrame(() => {
      setOpenedAt(String(Date.now()));
      const fromUrl = new URLSearchParams(window.location.search).get('topic');
      if (showTopic && isTopic(fromUrl)) setTopic(fromUrl);
    });
    return () => cancelAnimationFrame(frame);
  }, [showTopic]);

  const renderWidget = () => {
    if (!TURNSTILE_KEY || !widget.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(widget.current, { sitekey: TURNSTILE_KEY, theme: 'auto' });
  };
  useEffect(renderWidget);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.kind === 'sending') return;
    setState({ kind: 'sending' });
    const next = await submit(e.currentTarget);
    setState(next);
    if (next.kind === 'error' && widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  if (state.kind === 'sent') {
    return (
      <div className="contact-form glass" role="status">
        <h3 className="card-title">Thank you. Your message is on its way.</h3>
        <p className="contact-note">We reply to every message, usually within a week.</p>
      </div>
    );
  }

  return (
    // method="post" keeps personal data out of the URL if the form submits before JavaScript loads.
    <form className="contact-form glass" method="post" action="/api/contact" onSubmit={onSubmit}>
      {TURNSTILE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onLoad={renderWidget} />}
      <div className="contact-row">
        <label className="field"><span>Name</span><input name="name" required maxLength={120} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      {showTopic ? (
        <label className="field">
          <span>Topic</span>
          <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value as Topic)}>
            {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => <option key={t} value={t}>{TOPIC_LABELS[t]}</option>)}
          </select>
        </label>
      ) : (
        <input type="hidden" name="topic" value={topic} />
      )}
      <label className="field"><span>Message</span><textarea name="message" required minLength={10} maxLength={5000} rows={5} /></label>
      <input type="hidden" name="t" value={openedAt} />
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      {TURNSTILE_KEY && <div ref={widget} />}
      <div className="contact-actions">
        <button type="submit" className="btn solid" disabled={state.kind === 'sending'}>
          {state.kind === 'sending' ? 'Sending…' : <>Send message <span className="arr">→</span></>}
        </button>
        <p className="contact-status" role="status" aria-live="polite">{state.kind === 'error' ? state.message : ''}</p>
      </div>
    </form>
  );
}
