import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DetailHero, sentence } from '../../_components/detail-hero';
import { renderBlock } from '../../_components/blocks';
import { getProduct, staticContent } from '@/lib/content';

export function generateStaticParams() {
  return staticContent.collections.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Product not found' };
  return { title: `${p.name} · ${p.title}`, description: p.body.find((b) => b.kind === 'p')?.text?.replace(/<[^>]+>/g, '') };
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
