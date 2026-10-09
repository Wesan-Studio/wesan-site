import Link from 'next/link';
import { SectionHead } from '../_components/lib';
import { getAllResearchMeta } from '@/lib/research';

export const metadata = {
  title: 'Research',
  description: 'Internal research notes on brand positioning, product competition, and market timing.',
};

export default async function ResearchIndex() {
  const items = await getAllResearchMeta();

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead
            num="-"
            label="RESEARCH · INTERNAL NOTES"
            title="What we read before we wrote the rest of this site."
            sub="Three reports - one on Wesan's brand positioning, one on Friday's competitive landscape, one on Dante's. Not marketing. Working notes, kept honest, dated, with sources at the end."
          />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid var(--rule)' }}>
            {items.map((it) => (
              <Link
                key={it.slug}
                href={`/research/${it.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: '32px',
                  alignItems: 'baseline',
                  padding: '28px 32px',
                  borderBottom: '1px solid var(--rule)',
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                className="about-tl-grid"
              >
                <span className="mono" style={{ fontSize: '11.5px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{it.date}</span>
                <div>
                  <h3 className="serif" style={{ fontSize: '24px', lineHeight: 1.35, marginBottom: '8px' }}>{it.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.55, margin: 0 }}>{it.topic}</p>
                </div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>READ →</span>
              </Link>
            ))}
          </div>
          <p className="mono mt-12" style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center', letterSpacing: '0.1em' }}>
            INTERNAL RESEARCH · UPDATED WHEN THE REALITY CHANGES
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', textAlign: 'center', padding: '40px 32px' }}>
        <p className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          These reports inform what is and isn&apos;t said on the rest of this site.
        </p>
      </section>
    </>
  );
}
