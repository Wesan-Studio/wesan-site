'use client';

import { useState } from 'react';
import { SectionHead } from '../_components/lib';
import { ContactForm } from '../_components/contact-form';

export interface InvestorsContent {
  head: { num: string; label: string; title: string; sub: string };
  structure: [string, string][];
  capTableEyebrow: string;
  capTable: [string, string, string, string][];
  capTableFooter: string;
  principlesHead: { num: string; label: string; title: string };
  principles: [string, string][];
  faqHead: { num: string; label: string; title: string };
  faq: [string, string][];
}

function FAQ({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {items.map(([q, a], i) => (
        <article key={i} className="card mb-2" style={{ padding: '0', cursor: 'pointer' }} onClick={() => setOpen(open === i ? -1 : i)}>
          <div className="between" style={{ padding: '20px 24px' }}>
            <span className="serif" style={{ fontSize: '20px' }}>{q}</span>
            <span className="mono" style={{ fontSize: '14px', color: 'var(--ink-3)' }}>{open === i ? '−' : '+'}</span>
          </div>
          {open === i && (
            <div style={{ padding: '0 24px 24px', fontSize: '15px', lineHeight: 1.65, color: 'var(--ink-2)' }}>{a}</div>
          )}
        </article>
      ))}
    </div>
  );
}

export function InvestorsClient({ c }: { c: InvestorsContent }) {
  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="row row-3">
            {c.structure.map(([h, b]) => (
              <article key={h} className="card">
                <div className="eyebrow mb-4">{h}</div>
                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink-2)' }}>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.capTableEyebrow}</span>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13.5px', marginTop: '32px' }}>
            <thead>
              <tr style={{ color: 'var(--ink-3)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Holder</th>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Class</th>
                <th style={{ textAlign: 'right', padding: '14px 0', fontWeight: 400 }}>Share</th>
                <th style={{ textAlign: 'right', padding: '14px 0', fontWeight: 400 }}>Voting</th>
              </tr>
            </thead>
            <tbody>
              {c.capTable.map((row, i, a) => (
                <tr key={i} style={{ borderBottom: i < a.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                  <td style={{ padding: '16px 0', color: 'var(--ink)' }}>{row[0]}</td>
                  <td style={{ padding: '16px 0', color: 'var(--ink-3)' }}>{row[1]}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: 'var(--ink)' }}>{row[2]}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', color: 'var(--ink)' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mono mt-6" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{c.capTableFooter}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.principlesHead.num} label={c.principlesHead.label} title={c.principlesHead.title} />
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {c.principles.map(([n, b], i, a) => (
              <li key={i} style={{
                display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px',
                padding: '20px 0', borderTop: '1px solid var(--rule)',
                ...(i === a.length - 1 ? { borderBottom: '1px solid var(--rule)' } : {}),
              }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em' }}>{n}</span>
                <p style={{ fontSize: '16px', lineHeight: 1.55, color: 'var(--ink)' }}>{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container-narrow">
          <SectionHead num={c.faqHead.num} label={c.faqHead.label} title={c.faqHead.title} />
          <FAQ items={c.faq} />
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <h2 className="h-1 mb-4">Start a conversation</h2>
          <p className="lead mb-8">A few lines about who you are and what you back. It reaches the founder directly.</p>
          <ContactForm topic="investors" showTopic={false} />
        </div>
      </section>
    </>
  );
}
