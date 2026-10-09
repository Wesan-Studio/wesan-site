import Link from 'next/link';
import { SectionHead } from '../_components/lib';
import { Icon } from '../_components/icons';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Field reports',
  description: "Every April, each Wesan division publishes what worked, what didn't and what it spent.",
};

interface ReportsContent {
  head: { num: string; label: string; title: string; sub: string };
  missionQuoteEyebrow: string;
  missionQuote: string;
  missionAttr: string;
  structureHead: { num: string; label: string; title: string };
  structure: [string, string, string][];
  archiveHead: { num: string; label: string; title: string; sub: string };
  archive: [string, string, string, string, string, string][];
  archiveFooter: string;
  subscribeBlock: { eyebrow: string; title: string; body: string };
}

export default async function ReportsPage() {
  const c = ((await getContent()).pages.reports as unknown) as ReportsContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="card" style={{ padding: '48px 56px', background: 'var(--paper-3)' }}>
            <span className="eyebrow mb-4" style={{ display: 'block' }}>{c.missionQuoteEyebrow}</span>
            <p className="serif" style={{ fontSize: '28px', lineHeight: 1.5, letterSpacing: '-0.01em', fontStyle: 'italic', color: 'var(--ink)' }}>
              &ldquo;{c.missionQuote}&rdquo;
            </p>
            <p className="mono mt-6" style={{ fontSize: '11.5px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{c.missionAttr}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.structureHead.num} label={c.structureHead.label} title={c.structureHead.title} />
          <div className="row row-4 mt-8">
            {c.structure.map(([n, h, b]) => (
              <article key={n} className="card">
                <div className="mono mb-2" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>{n}</div>
                <h3 className="h-3 mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{h}</h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-2)' }}>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.archiveHead.num} label={c.archiveHead.label} title={c.archiveHead.title} sub={c.archiveHead.sub} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ color: 'var(--ink-3)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid var(--rule-strong)' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 400 }}>Year</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 400 }}>Division</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 400 }}>Due</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 400 }}>Pages · words</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontWeight: 400 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {c.archive.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--rule)' }}>
                  <td style={{ padding: '18px 16px', color: 'var(--ink)' }}>{row[0]}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--ink)' }}>{row[1]}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--accent)' }}>{row[2]}</td>
                  <td style={{ padding: '18px 16px', color: 'var(--ink-2)' }}>{row[3]}</td>
                  <td style={{ padding: '18px 16px', textAlign: 'right', color: row[5] }}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mono mt-8" style={{ fontSize: '11.5px', color: 'var(--ink-3)', textAlign: 'center', letterSpacing: '0.1em' }}>{c.archiveFooter}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)', textAlign: 'center' }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.subscribeBlock.eyebrow}</span>
          <h2 className="h-1 mt-4 mb-6" style={{ color: 'var(--ink)' }}>{c.subscribeBlock.title}</h2>
          <p style={{ fontSize: '16px', color: 'var(--ink-5)', lineHeight: 1.6, marginBottom: '32px' }}>{c.subscribeBlock.body}</p>
          <div className="gap-12" style={{ justifyContent: 'center' }}>
            <Link href="/newsroom" className="btn" style={{ borderColor: 'var(--paper)', color: 'var(--ink)' }}>Newsroom <span className="arr">→</span></Link>
            <a href="#" className="btn" style={{ borderColor: 'var(--paper)', color: 'var(--ink)' }}>
              <Icon name="ext" size={12} /> RSS feed
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
