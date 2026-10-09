import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DetailHero, sceneForDivision } from '../../_components/detail-hero';
import { getContent, getNewsItem, getNewsItems, staticContent } from '@/lib/content';

export function generateStaticParams() {
  return staticContent.collections.newsroom.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const it = await getNewsItem(slug);
  if (!it) return { title: 'Release not found · Wesan newsroom' };
  return {
    title: `${it.what} · ${it.who} · Wesan newsroom`,
    description: it.lede,
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const it = await getNewsItem(slug);
  if (!it) notFound();

  const items = await getNewsItems();
  const labels = (await getContent()).pages.newsroomDetail;
  const idx = items.findIndex((x) => x.slug === it.slug);
  const prev = idx < items.length - 1 ? items[idx + 1] : null;
  const next = idx > 0 ? items[idx - 1] : null;

  return (
    <>
      <DetailHero
        back={{ href: '/newsroom', label: labels.backLabel }}
        scene={sceneForDivision(it.who)}
        seed={idx + 2}
        title={it.what}
        lede={it.lede}
        meta={
          <>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{it.date}</span>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em' }}>{it.who} · {labels.releaseLabel}</span>
            {it.featured && <span className="tag status-on">{labels.featuredLabel}</span>}
          </>
        }
      />

      {/* Body */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <article className="container-narrow" style={{ fontSize: '17px', lineHeight: 1.75 }}>
          {it.body.map((block, i) => {
            if (block.kind === 'h') {
              return (
                <h2 key={i} className="h-2" style={{ marginTop: '48px', marginBottom: '20px' }}>
                  {block.content as string}
                </h2>
              );
            }
            if (block.kind === 'p') {
              return (
                <p key={i} style={{ color: 'var(--ink-2)', marginBottom: '20px' }}>
                  {block.content as string}
                </p>
              );
            }
            if (block.kind === 'quote') {
              return (
                <blockquote
                  key={i}
                  className="serif"
                  style={{
                    fontSize: '22px',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    color: 'var(--ink)',
                    margin: '32px 0',
                    padding: '0 0 0 24px',
                    borderLeft: '3px solid var(--accent)',
                  }}
                >
                  &ldquo;{block.content as string}&rdquo;
                </blockquote>
              );
            }
            if (block.kind === 'list') {
              return (
                <ul key={i} style={{ paddingLeft: '20px', marginBottom: '20px', color: 'var(--ink-2)' }}>
                  {(block.content as string[]).map((line, j) => (
                    <li key={j} style={{ marginBottom: '8px', lineHeight: 1.7 }}>{line}</li>
                  ))}
                </ul>
              );
            }
            return null;
          })}

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0 32px' }} />

          {it.links && it.links.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div className="eyebrow mb-4">{labels.relatedLabel}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {it.links.map((l) => (
                  <li key={l.href} style={{ marginBottom: '8px' }}>
                    {l.href.startsWith('http') ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="link mono" style={{ fontSize: '14px' }}>{l.label} ↗</a>
                    ) : (
                      <Link href={l.href} className="link mono" style={{ fontSize: '14px' }}>{l.label} →</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {it.contact && (
            <p className="mono" style={{ fontSize: '12px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
              {labels.pressLabel} · <a href={`mailto:${it.contact}`} className="link">{it.contact}</a>
            </p>
          )}
        </article>
      </section>

      {/* Prev / Next nav */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container-narrow">
          <div className="row row-2" style={{ gap: '24px' }}>
            {prev ? (
              <Link href={`/newsroom/${prev.slug}`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                <div className="eyebrow mb-2">{labels.olderLabel} · {prev.date}</div>
                <h3 className="serif" style={{ fontSize: '18px', lineHeight: 1.35 }}>{prev.what}</h3>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/newsroom/${next.slug}`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none', textAlign: 'right' }}>
                <div className="eyebrow mb-2">{labels.newerLabel} · {next.date} →</div>
                <h3 className="serif" style={{ fontSize: '18px', lineHeight: 1.35 }}>{next.what}</h3>
              </Link>
            ) : <div />}
          </div>
          <div className="mt-8" style={{ textAlign: 'center' }}>
            <Link href="/newsroom" className="btn">{labels.backToList}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
