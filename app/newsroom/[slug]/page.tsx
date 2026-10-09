import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DetailHero, sceneForDivision, sentence } from '../../_components/detail-hero';
import { getContent, getNewsItem, getNewsItems, staticContent } from '@/lib/content';

export function generateStaticParams() {
  return staticContent.collections.newsroom.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const it = await getNewsItem(slug);
  if (!it) return { title: 'Release not found' };
  return {
    title: it.what,
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
        back={{ href: '/newsroom', label: '← Newsroom' }}
        meta={[it.date, sentence(it.who)]}
        title={it.what}
        lede={it.lede}
        figure={{ scene: sceneForDivision(it.who), seed: idx + 2 }}
      />

      <article className="read">
        <div className="read-col">
          {it.body.map((block, i) => renderBlock(block, i))}

          {it.links && it.links.length > 0 && (
            <>
              <h3>{sentence(labels.relatedLabel)}</h3>
              <ul className="link-list">
                {it.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith('/') ? (
                      <Link href={l.href}>{l.label}<span className="m">→</span></Link>
                    ) : (
                      <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l.label}<span className="m">↗</span></a>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {it.contact && (
            <p className="small mt-6">{sentence(labels.pressLabel)}: <a href={`mailto:${it.contact}`}>{it.contact}</a></p>
          )}

          <nav className="pager mt-12" aria-label="More releases">
            {prev ? (
              <Link href={`/newsroom/${prev.slug}`}>
                <div className="k">← Older · {prev.date}</div>
                <div className="t">{prev.what}</div>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/newsroom/${next.slug}`} className="next">
                <div className="k">Newer · {next.date} →</div>
                <div className="t">{next.what}</div>
              </Link>
            ) : <span />}
          </nav>
        </div>
      </article>
    </>
  );
}

function renderBlock(block: { kind: string; content: string | string[] }, i: number) {
  switch (block.kind) {
    case 'h':
      return <h2 key={i}>{block.content as string}</h2>;
    case 'p':
      return <p key={i}>{block.content as string}</p>;
    case 'quote':
      return <blockquote key={i}>&ldquo;{block.content as string}&rdquo;</blockquote>;
    case 'list':
      return <ul key={i}>{(block.content as string[]).map((line, j) => <li key={j}>{line}</li>)}</ul>;
    default:
      return null;
  }
}
