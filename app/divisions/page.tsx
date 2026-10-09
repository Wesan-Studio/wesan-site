import Image from 'next/image';
import Link from 'next/link';
import { SectionHead, SpotlightCard } from '../_components/lib';
import { getContent } from '@/lib/content';

interface DivRow {
  spine: string;
  title: string;
  statusTag: { label: string; variant: string };
  desc: string;
  products: string[];
  meta: string[];
  dashedProducts?: boolean;
  image?: { src: string; alt: string; dim?: boolean };
  stage?: { label: string; tagline: string };
  cta: { href: string; label: string; variant: 'solid' | 'ghost-dashed' };
  alt: boolean;
  mediaSide: 'left' | 'right';
}

interface DivisionsContent {
  head: { num: string; label: string; title: string; sub: string };
  rows: DivRow[];
  closing: { eyebrow: string; body: string };
}

function statusClass(variant: string) {
  switch (variant) {
    case 'status-on': return 'tag status-on';
    case 'accent': return 'tag accent';
    case 'dashed': return 'tag dashed';
    default: return 'tag';
  }
}

function MediaCell({ row }: { row: DivRow }) {
  if (row.image) {
    return (
      <div className={`media frame frame-cross${row.image.dim ? ' dim' : ''}`} style={row.image.dim ? { borderRight: '1px dashed var(--rule)' } : undefined}>
        <Image unoptimized width={1200} height={800}
          className={row.image.alt?.toLowerCase().includes('saturn') ? 'wmsketch' : 'wmsketch'}
          src={row.image.src}
          alt={row.image.alt}
          style={row.image.dim ? { maxWidth: '60%', maxHeight: '80%' } : { maxWidth: '70%', maxHeight: '70%' }}
        />
      </div>
    );
  }
  if (row.stage) {
    return (
      <div className="media frame frame-cross">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="mono mb-2" style={{ fontSize: '10px', letterSpacing: '0.14em', color: 'var(--ink-3)' }}>{row.stage.label}</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontStyle: 'italic', color: 'var(--ink-2)' }}>{row.stage.tagline}</div>
        </div>
      </div>
    );
  }
  return null;
}

export default async function DivisionsPage() {
  const c = ((await getContent()).pages.divisions as unknown) as DivisionsContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        {c.rows.map((row) => (
          <SpotlightCard key={row.spine} as="article" className={`div-row${row.alt ? ' alt' : ''}`}>
            <div className="spine">{row.spine}</div>
            {row.mediaSide === 'left' && <MediaCell row={row} />}
            <div className="body" style={row.mediaSide === 'left' ? { borderLeft: '1px solid var(--rule)', borderRight: 'none' } : undefined}>
              <div className="gap-12 mb-4" style={{ alignItems: 'baseline' }}>
                <h2 className="h-2">{row.title}</h2>
                <span className={statusClass(row.statusTag.variant)}>{row.statusTag.label}</span>
              </div>
              <p style={{ fontSize: '16px', color: 'var(--ink-2)', marginBottom: '20px', maxWidth: '46ch' }}>{row.desc}</p>
              <div className="gap-wrap mb-6">
                {row.products.map((p, i) => (
                  <span
                    key={i}
                    className={`tag${row.dashedProducts ? ' dashed' : ''}`}
                    style={row.dashedProducts
                      ? { opacity: 0.75 }
                      : { fontFamily: 'var(--font-display)', fontSize: '13px', textTransform: 'none', letterSpacing: '0' }
                    }
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </div>
              <div className="gap-8" style={{ flexWrap: 'wrap' }}>
                {row.meta.map((m, i) => (
                  <span key={i} className={`tag${row.dashedProducts && i === row.meta.length - 1 ? ' dashed' : ''}`}>{m}</span>
                ))}
              </div>
            </div>
            {row.mediaSide === 'right' && <MediaCell row={row} />}
            <div className="cta">
              {row.cta.variant === 'ghost-dashed' ? (
                <Link href={row.cta.href} className="btn ghost" style={{ borderStyle: 'dashed' }}>
                  {row.cta.label} <span className="arr">→</span>
                </Link>
              ) : (
                <Link href={row.cta.href} className="btn solid">
                  {row.cta.label} <span className="arr">→</span>
                </Link>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>

      <section className="section">
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow">{c.closing.eyebrow}</span>
          <p className="serif mt-4" style={{ fontSize: '24px', fontStyle: 'italic', color: 'var(--ink-2)' }}>
            {c.closing.body}
          </p>
        </div>
      </section>
    </>
  );
}
