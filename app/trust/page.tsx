import { SectionHead } from '../_components/lib';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Trust & security',
  description: 'What is true today about how Wesan handles data and security, and what comes next.',
};

interface TrustContent {
  head: { num: string; label: string; title: string; sub: string };
  tags: { label: string; variant: string }[];
  todayHead: { num: string; label: string; title: string };
  today: [string, string][];
  gapsHead: { num: string; label: string; title: string };
  gaps: [string, string, string][];
  subprocessorsHead: { num: string; label: string; title: string };
  subprocessors: [string, string, string, string][];
  subprocessorsFooter: string;
  vulnBlock: { eyebrow: string; title: string; body: string; safe: string };
}

export default async function TrustPage() {
  const c = ((await getContent()).pages.trust as unknown) as TrustContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
          <div className="gap-8 mt-8">
            {c.tags.map((t) => (
              <span key={t.label} className={`tag${t.variant === 'accent' ? ' accent' : ''}`}>{t.label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <SectionHead num={c.todayHead.num} label={c.todayHead.label} title={c.todayHead.title} />
          <div className="row row-2 mt-8">
            {c.today.map(([h, b]) => (
              <article key={h} className="card">
                <div className="eyebrow mb-4">{h}</div>
                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink-2)' }}>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.gapsHead.num} label={c.gapsHead.label} title={c.gapsHead.title} />
          <div className="row row-3 mt-8">
            {c.gaps.map(([h, b, status]) => (
              <article key={h} className="card">
                <div className="between mb-4">
                  <span className="eyebrow">{h}</span>
                  <span className="tag dashed" style={{ fontSize: '9.5px' }}>{status}</span>
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-2)' }}>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.subprocessorsHead.num} label={c.subprocessorsHead.label} title={c.subprocessorsHead.title} />
          {c.subprocessors.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: 'var(--ink-3)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid var(--rule-strong)' }}>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Provider</th>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Purpose</th>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Data classes</th>
                <th style={{ textAlign: 'left', padding: '14px 0', fontWeight: 400 }}>Region</th>
              </tr>
            </thead>
            <tbody>
              {c.subprocessors.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={{ padding: '16px 0', color: 'var(--ink)' }}>{row[0]}</td>
                  <td style={{ padding: '16px 0', color: 'var(--ink-2)' }}>{row[1]}</td>
                  <td style={{ padding: '16px 0', color: 'var(--ink-2)' }}>{row[2]}</td>
                  <td style={{ padding: '16px 0', color: 'var(--ink-3)' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <p className="lead mt-6">{c.subprocessorsFooter}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)', textAlign: 'center' }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.vulnBlock.eyebrow}</span>
          <h2 className="h-1 mt-4 mb-6" style={{ color: 'var(--ink)' }}>{c.vulnBlock.title}</h2>
          <p
            style={{ fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '32px' }}
            dangerouslySetInnerHTML={{ __html: c.vulnBlock.body }}
          />
          <p className="mono" style={{ fontSize: '11.5px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{c.vulnBlock.safe}</p>
        </div>
      </section>
    </>
  );
}
