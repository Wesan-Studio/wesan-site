'use client';

import { useState, type FormEvent } from 'react';

type Topic = 'general' | 'investors' | 'press' | 'security';
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

const TOPIC_LABELS: Record<Topic, string> = {
  general: 'General',
  investors: 'Investors and partners',
  press: 'Press',
  security: 'Security',
};

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

export function ContactForm({ topic = 'general', showTopic = true }: { topic?: Topic; showTopic?: boolean }) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: 'sending' });
    const next = await submit(form);
    setState(next);
    if (next.kind === 'sent') form.reset();
  };

  if (state.kind === 'sent') {
    return (
      <div className="contact-form glass" role="status">
        <h3 className="card-title">Thank you. Your message is on its way.</h3>
        <p className="contact-note">We reply to every message, usually within a week. A confirmation is in your inbox.</p>
        <button type="button" className="btn mt-6" onClick={() => setState({ kind: 'idle' })}>Send another</button>
      </div>
    );
  }

  return (
    // method="post" keeps personal data out of the URL if the form submits before JavaScript loads.
    <form className="contact-form glass" method="post" action="/api/contact" onSubmit={onSubmit}>
      <div className="contact-row">
        <label className="field"><span>Name</span><input name="name" required maxLength={120} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
      </div>
      {showTopic ? (
        <label className="field">
          <span>Topic</span>
          <select name="topic" defaultValue={topic}>
            {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => <option key={t} value={t}>{TOPIC_LABELS[t]}</option>)}
          </select>
        </label>
      ) : (
        <input type="hidden" name="topic" value={topic} />
      )}
      <label className="field"><span>Message</span><textarea name="message" required minLength={10} maxLength={5000} rows={5} /></label>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="contact-actions">
        <button type="submit" className="btn solid" disabled={state.kind === 'sending'}>
          {state.kind === 'sending' ? 'Sending…' : <>Send message <span className="arr">→</span></>}
        </button>
        <p className="contact-status" role="status" aria-live="polite">{state.kind === 'error' ? state.message : ''}</p>
      </div>
    </form>
  );
}
