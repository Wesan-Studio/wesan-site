import Image from 'next/image';
import Link from 'next/link';
import { getProducts, type ProductPage } from '@/lib/content';

function ProductListing({ product }: { product: ProductPage }) {
  const intro = product.body.find((b) => b.kind === 'p');
  const image = product.slug === 'meltir' ? '/images/meltir-workspace.webp' : product.slug === 'levios-ai' ? '/images/levios-cafe.webp' : undefined;
  return (
    <article className={`software-product${image ? ' with-image' : ''}`}>
      {image && <Link href={`/software/${product.slug}`} className="software-product-image"><Image src={image} alt={product.slug === 'meltir' ? 'A calm working desk in daylight' : 'An espresso and croissant prepared for a cafe social post'} fill sizes="(max-width: 760px) 100vw, 50vw" /></Link>}
      <div><span className="availability">{product.status}</span><h2><Link href={`/software/${product.slug}`}>{product.name}</Link></h2><p className="software-product-title">{product.title.replace(/\n/g, ' ')}</p>{intro?.kind === 'p' && <p>{intro.text.replace(/<[^>]*>/g, '')}</p>}<Link className="text-link" href={`/software/${product.slug}`}>Explore {product.name}<span aria-hidden="true">↗</span></Link></div>
    </article>
  );
}

export default async function SoftwarePage() {
  const products = await getProducts();
  return (
    <div className="site-container software-catalog">
      <header className="catalog-header"><h1>Software that<br />moves work forward.</h1><p>AI workspaces, business tools and everyday applications. Each product solves a different part of the day.</p></header>
      <div className="software-products">{products.map((product) => <ProductListing key={product.slug} product={product} />)}</div>
    </div>
  );
}
