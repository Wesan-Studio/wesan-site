import Image from 'next/image';
import Link from 'next/link';
import { getContent, getProducts, type HomeContent, type ProductPage } from '@/lib/content';

function HomeHero({ hero }: { hero: HomeContent['hero'] }) {
  return (
    <section className="home-hero site-container">
      <div className="home-hero-copy">
        <h1>{hero.title}</h1><p>{hero.lead}</p>
        <div className="home-actions">{hero.ctas.map((cta) => <Link key={cta.href} className={`site-button${cta.variant === 'solid' ? ' primary' : ''}`} href={cta.href}>{cta.label}<span aria-hidden="true">↗</span></Link>)}</div>
      </div>
      <div className="home-hero-art"><Image src="/images/wesan-horizon.webp" alt="Architectural study of silver structures opening onto a distant horizon" fill priority sizes="(max-width: 760px) 100vw, 55vw" /></div>
    </section>
  );
}

function FeaturedProduct({ product, image, intro }: { product: ProductPage; image: string; intro: string }) {
  return (
    <article className={`featured-product feature-${product.slug}`}>
      <div className="product-story">
        <span className="product-name">{product.name}</span><h2>{product.title}</h2><p>{intro}</p>
        <Link href={`/software/${product.slug}`} className="text-link">Explore {product.name}<span aria-hidden="true">↗</span></Link>
        <span className="availability">In development</span>
      </div>
      <div className="product-story-image"><Image src={image} alt={product.slug === 'meltir' ? 'A quiet desk with a laptop and notebook in natural daylight' : 'A cafe product photograph with espresso and a croissant'} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
    </article>
  );
}

function ProductDirectory({ products }: { products: ProductPage[] }) {
  return (
    <section className="product-directory site-container">
      <h2>More of what we build.</h2><p>Distinct products, with a shared approach to useful software.</p>
      <div className="product-rows">{products.map((p) => <Link key={p.slug} href={`/software/${p.slug}`}><span className="directory-name">{p.name}</span><span className="directory-title">{p.title.replace(/\n/g, ' ')}</span><span aria-hidden="true">↗</span></Link>)}</div>
      <Link className="text-link" href="/studio">Discover our games<span aria-hidden="true">↗</span></Link>
    </section>
  );
}

function CompanyDirection() {
  return (
    <section className="company-direction site-container">
      <h2>One studio.<br />A wider horizon.</h2>
      <div><p>Wesan brings together AI workspaces, tools for businesses and mobile games. We start with a useful result, build the software behind it, and improve it through real use.</p><p>Our ambition reaches further. We are building the engineering foundation for a company that can take on larger work over time.</p><Link href="/about" className="text-link">Meet Wesan<span aria-hidden="true">↗</span></Link></div>
    </section>
  );
}

export default async function HomePage() {
  const [content, products] = await Promise.all([getContent(), getProducts()]);
  const meltir = products.find((p) => p.slug === 'meltir');
  const levios = products.find((p) => p.slug === 'levios-ai');
  return (
    <>
      <HomeHero hero={content.pages.home.hero} />
      <div className="featured-products site-container">
        {meltir && <FeaturedProduct product={meltir} image="/images/meltir-workspace.webp" intro="Bring your calendar, mail, meeting notes and next steps into one AI workspace. Designed to help you prepare, follow through and keep context." />}
        {levios && <FeaturedProduct product={levios} image="/images/levios-cafe.webp" intro="Turn a business photo and a short message into brand-aware social content. Choose the visual, refine the caption and prepare your next post." />}
      </div>
      <ProductDirectory products={products.filter((p) => !['meltir', 'levios-ai'].includes(p.slug))} />
      <CompanyDirection />
    </>
  );
}
