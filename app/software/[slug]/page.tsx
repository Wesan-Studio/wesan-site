import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DetailHero, sentence } from '../../_components/detail-hero';
import { getProduct, staticContent, type MissionBlock } from '@/lib/content';

export function generateStaticParams() {
  return staticContent.collections.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Product not found · Wesan Software' };
  return { title: `${p.name} · Wesan Software` };
}

function renderBlock(b: MissionBlock, i: number) {
  switch (b.kind) {
    case 'p':
      return <p key={i} className={b.lead ? 'lead-p' : undefined} dangerouslySetInnerHTML={{ __html: b.text }} />;
    case 'h2':
      return <h2 key={i}>{b.text}</h2>;
    case 'figure':
      return (
        <figure key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wmsketch" src={b.src} alt={b.alt} style={{ width: '100%', maxWidth: '720px', height: 'auto', margin: '0 auto' }} />
          <figcaption>{b.caption} · {b.credit}</figcaption>
        </figure>
      );
    case 'hr':
      return <hr key={i} />;
    case 'quote':
      return <blockquote key={i}>&ldquo;{b.text}&rdquo;</blockquote>;
    case 'sign':
      return <p key={i} className="small">{b.text}</p>;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const meta = [p.meta, sentence(p.status), p.url !== '-' ? p.url : ''].filter(Boolean);

  return (
    <>
      <DetailHero back={{ href: '/software', label: '← Software' }} meta={meta} title={p.title} figure={{ scene: 'orbit', seed: p.slug.length }} />

      <article className="read">
        <div className="read-col">
          {p.body.map((b, i) => renderBlock(b, i))}
          <hr />
          <ul className="link-list">
            {p.continue.links.map((l) => (
              <li key={l.href + l.label}>
                {l.href.startsWith('/') ? (
                  <Link href={l.href}>{l.label.replace(/ →$/, '')}<span className="m">→</span></Link>
                ) : (
                  <a href={l.href}>{l.label.replace(/ →$/, '')}<span className="m">→</span></a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
