import Link from 'next/link';
import { SectionHead } from '../_components/lib';
import { DitherStill } from '../_components/dither';
import { sceneForDivision, sentence } from '../_components/detail-hero';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Divisions',
  description: 'How Wesan is organised: Software in build today, a Studio with two games live on the App Store.',
};

interface DivRow {
  spine: string;
  title: string;
  statusTag: { label: string; variant: string };
  desc: string;
  products: string[];
  meta: string[];
  cta: { href: string; label: string; variant: 'solid' | 'ghost-dashed' };
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

export default async function DivisionsPage() {
  const c = ((await getContent()).pages.divisions as unknown) as DivisionsContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <div className="container" style={{ padding: '0 32px' }}>
        {c.rows.map((row) => (
          <article key={row.spine} className={`div-split${row.mediaSide === 'left' ? ' flip' : ''}`}>
            <div>
              <div className="gap-12 mb-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <h2 className="h-1">{row.title}</h2>
                <span className={statusClass(row.statusTag.variant)}>{row.statusTag.label}</span>
              </div>
              <p className="div-desc">{row.desc}</p>
              <p className="div-products" dangerouslySetInnerHTML={{ __html: row.products.join('<span class="sep"> · </span>') }} />
              <p className="div-meta">{row.meta.join(' · ')}</p>
              <Link href={row.cta.href} className={row.cta.variant === 'solid' ? 'btn solid' : 'btn'}>
                {sentence(row.cta.label)} <span className="arr">→</span>
              </Link>
            </div>
            <div className="photo div-media">
              <DitherStill scene={sceneForDivision(row.title)} seed={row.spine.length} gain={0.75} />
            </div>
          </article>
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
