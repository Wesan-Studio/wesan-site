import { SectionHead } from '../_components/lib';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Now',
  description: 'What the founder of Wesan is working on this month.',
};

export default async function NowPage() {
  const c = (await getContent()).pages.now;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container-narrow">
          <SectionHead num={c.head.num!} label={c.head.label!} title={c.head.title!} />
          <div className="gap-12 mb-8">
            {c.tags.map((t) => (
              <span key={t.label} className={`tag${t.variant === 'accent' ? ' accent' : ''}`}>{t.label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <article className="container-narrow" style={{ fontSize: '17px', lineHeight: 1.75 }}>
          <p className="serif mb-6" style={{ fontSize: '24px', lineHeight: 1.5 }}>{c.lead}</p>

          <h3 className="h-3 mt-12 mb-4">
            {c.thisMonth.heading}
          </h3>
          <ul style={{ color: 'var(--ink-2)', listStyle: 'none', padding: 0 }}>
            {c.thisMonth.items.map((it) => (
              <li key={it.n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '14px', marginBottom: '14px' }}>
                <span className="mono" style={{ color: 'var(--accent)', fontSize: '12px', paddingTop: '5px' }}>{it.n}</span>
                <span>{it.text}</span>
              </li>
            ))}
          </ul>

          <h3 className="h-3 mt-12 mb-4">
            {c.divisions.heading}
          </h3>
          <div className="row row-3" style={{ gap: '20px' }}>
            {c.divisions.cards.map((d) => (
              <div key={d.label} className="card" style={{ padding: '20px' }}>
                <div className="eyebrow mb-2">{d.label}</div>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', lineHeight: 1.6 }}>{d.body}</p>
              </div>
            ))}
          </div>

          <h3 className="h-3 mt-12 mb-4">
            {c.onMyMind.heading}
          </h3>
          <p style={{ color: 'var(--ink-2)' }}>{c.onMyMind.body}</p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />

          <p style={{ fontSize: '14px', color: 'var(--ink-3)' }}>
            <span className="mono">{c.sign}</span><br />
            <span dangerouslySetInnerHTML={{ __html: c.convention }} />
          </p>
        </article>
      </section>
    </>
  );
}
