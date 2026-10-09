import Link from 'next/link';
import { Photo, SectionHead } from '../_components/lib';
import { sentence } from '../_components/detail-hero';
import { getContent, type Tone } from '@/lib/content';

interface Product { slug?: string; name: string; version: string; url: string; tagline: string; meta: string; desc: string; status: string; img?: string }

interface SoftwareContent {
  hero: { tags: { label: string; variant: string }[]; fig: string; title: string; photo: { tone: Tone; ratio: string; caption: string; label: string } };
  manifesto: string;
  productsHead: { num: string; label: string; title: string };
  products: Product[];
  releaseLogHead: { num: string; label: string };
  releases: [string, string, string, string, string, string][];
  principlesHead: { num: string; label: string; title: string };
  principles: [string, string][];
  footerStamp: { eyebrow: string; line: string };
}

function ProductCard({ p }: { p: Product }) {
  const version = p.version.toLowerCase() === p.status.toLowerCase() ? '' : ` · ${p.version}`;
  return (
    <Link href={`/software/${(p.slug ?? p.name.toLowerCase())}`} className="card product-card">
      <div className="product-head">
        {p.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt="" width={40} height={40} className="product-logo" />
        )}
        <div>
          <h3 className="card-title" style={{ marginBottom: 0 }}>{p.name}</h3>
          <div className="product-sub">{p.tagline}</div>
        </div>
      </div>
      <p className="product-desc">{p.desc}</p>
      <div className="product-foot">
        <span>{sentence(p.status)}{version}</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export default async function SoftwarePage() {
  const c = ((await getContent()).pages.software as unknown) as SoftwareContent;

  return (
    <>
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '88px 32px 48px' }}>
        <h1 className="h-display" style={{ maxWidth: '20ch' }}>{c.hero.title}</h1>
      </section>
      <div className="page-figure">
        <Photo tone={c.hero.photo.tone} ratio="3/1" gain={0.7} />
      </div>


      <section className="section">
        <div className="container">
          <p className="serif" style={{ fontSize: '32px', lineHeight: 1.4, letterSpacing: '-0.012em', maxWidth: '36ch' }}>{c.manifesto}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.productsHead.num} label={c.productsHead.label} title={c.productsHead.title} />
          <div className="row row-3">
            {c.products.map((p) => <ProductCard key={p.name} p={p} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink-5)' }}>
        <div className="container">
          <h2 className="h-1 mb-8">{sentence(c.releaseLogHead.label)}</h2>
          <table className="data-table on-dark">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Release</th>
                <th>Notes</th>
                <th className="right">Status</th>
              </tr>
            </thead>
            <tbody>
              {c.releases.map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td className="muted">{row[3]}</td>
                  <td className="right" style={{ color: row[5] }}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.principlesHead.num} label={c.principlesHead.label} title={c.principlesHead.title} />
          <div className="row row-3 mt-8">
            {c.principles.map(([h, b]) => (
              <div key={h} className="card">
                <h3 className="card-title">{sentence(h)}</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center', background: 'var(--paper-2)' }}>
        <span className="eyebrow">{c.footerStamp.eyebrow}</span>
        <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginTop: '8px' }}>{c.footerStamp.line}</p>
      </section>
    </>
  );
}
