import { SectionHead, SpotlightCard } from '../_components/lib';
import { getContent } from '@/lib/content';

interface SitemapItem { k: string; l: string; d: string }
interface SitemapContent {
  head: { num: string; label: string; title: string; sub: string };
  groups: { label: string; items: SitemapItem[] }[];
  treeEyebrow: string;
  tree: string;
}

export default async function SitemapPage() {
  const c = ((await getContent()).pages.sitemap as unknown) as SitemapContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {c.groups.map((g) => (
            <div key={g.label} style={{ marginBottom: '56px' }}>
              <div className="section-label" style={{ marginBottom: '20px' }}>
                <span className="num">{g.label.split(' · ')[0]}</span>
                <span>{g.label.split(' · ')[1]}</span>
                <span className="rule" />
              </div>
              <div className="row row-4">
                {g.items.map((it) => (
                  <SpotlightCard
                    key={it.k || 'home'}
                    href={it.k === '' ? '/' : `/${it.k}`}
                    className="card"
                    style={{ display: 'block', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="mono mb-2" style={{ fontSize: '10.5px', color: 'var(--accent)', letterSpacing: '0.12em' }}>/ {it.k}</div>
                    <h3 className="h-3 mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500 }}>{it.l}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{it.d}</p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.treeEyebrow}</span>
          <pre className="mono mt-6" style={{ fontSize: '13px', lineHeight: 1.9, color: 'var(--ink-5)', whiteSpace: 'pre-wrap' }}>{c.tree}</pre>
        </div>
      </section>
    </>
  );
}
