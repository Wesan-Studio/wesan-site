/* Outbound mail through Resend's REST API. Incoming mail stays on Google Workspace;
   this module only sends. A plain fetch keeps the dependency list unchanged. */

export interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}

export class MailNotConfigured extends Error {}

const FROM = process.env.MAIL_FROM?.trim() || 'Wesan <hello@wesan.co>';

export async function sendMail(mail: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new MailNotConfigured('RESEND_API_KEY is not set');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(mail.idempotencyKey ? { 'Idempotency-Key': mail.idempotencyKey } : {}),
    },
    body: JSON.stringify({ from: FROM, to: mail.to, subject: mail.subject, text: mail.text, reply_to: mail.replyTo }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
