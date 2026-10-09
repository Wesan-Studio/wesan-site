import type { ReactNode } from 'react';
import { SectionHead } from '../_components/lib';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Contact',
  description: 'How to reach Wesan in London: general, press, partners and security.',
};

function ContactCard({ label, addr, hint }: { label: string; addr: string; hint: string }) {
  return (
    <article className="card">
      <div className="eyebrow mb-4">{label}</div>
      <p className="serif" style={{ fontSize: '24px', marginBottom: '6px' }}>{addr}</p>
      <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{hint}</p>
    </article>
  );
}

function OfficeCard({ label, lines, telemetry }: { label: string; lines: string[]; telemetry: [string, string][] }) {
  return (
    <article className="card">
      <div className="eyebrow mb-4">{label}</div>
      <address className="mono" style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.8, fontStyle: 'normal' }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </address>
      <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '20px 0' }} />
      <div className="row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {telemetry.map(([k, v], i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</div>
            <div className="mono" style={{ fontSize: '13px', color: 'var(--ink)', marginTop: '2px' }}>{v}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default async function ContactPage() {
  const c = (await getContent()).pages.contact;
  const titleNode: ReactNode = c.head.title?.split('\n').map((line, i, a) => (
    <span key={i}>{line}{i < a.length - 1 && <br />}</span>
  ));

  return (
    <>
      <section className="section" style={{ paddingTop: '96px', paddingBottom: '48px' }}>
        <div className="container">
          <div className="row row-2" style={{ gap: '64px', alignItems: 'flex-start' }}>
            <div>
              <SectionHead num={c.head.num!} label={c.head.label!} title={titleNode} sub={c.head.sub} />
            </div>
            <div className="row" style={{ gap: '20px' }}>
              {c.channels.map((ch) => (
                <ContactCard key={ch.addr} label={ch.label} addr={ch.addr} hint={ch.hint} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.officesHead.num!} label={c.officesHead.label!} title={c.officesHead.title!} />
          <div className="row row-2 mt-8">
            {c.offices.map((o) => (
              <OfficeCard key={o.label} label={o.label} lines={o.lines} telemetry={o.telemetry} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', textAlign: 'center', padding: '40px 32px' }}>
        <p className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {c.stamp}
        </p>
      </section>
    </>
  );
}
