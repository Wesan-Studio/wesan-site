import type { ReactNode } from 'react';
import Link from 'next/link';
import { Photo, Telemetry, SectionHead } from '../_components/lib';
import { getContent, type Tone } from '@/lib/content';

interface Product { slug?: string; name: string; version: string; url: string; tagline: string; meta: string; desc: string; status: string; img?: string }

interface SoftwareContent {
  hero: { tags: { label: string; variant: string }[]; fig: string; title: string; photo: { tone: Tone; ratio: string; caption: string; label: string } };
  telemetry: [string, string][];
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
  return (
    <Link href={`/software/${(p.slug ?? p.name.toLowerCase())}`} className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '420px', color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
      <div className="photo-cross" style={{ aspectRatio: '4/3', marginBottom: '20px', background: 'var(--paper-2)', border: '1px solid var(--rule)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="corners" />
        {p.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.img} alt={`${p.name} logo`} style={{ width: '44%', maxWidth: '120px', height: 'auto', objectFit: 'contain', position: 'relative', zIndex: 3, opacity: 0.95 }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '92px', fontWeight: 500, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em', position: 'relative', zIndex: 3 }}>{p.name.charAt(0)}</span>
        )}
        <span className="mono" style={{ position: 'absolute', left: '14px', bottom: '12px', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase', zIndex: 3 }}>{p.name}</span>
      </div>
      <div className="gap-8 mb-2" style={{ alignItems: 'baseline' }}>
        <h3 className="h-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '24px' }}>{p.name}</h3>
        <span className="tag">{p.version}</span>
        <span className="tag status-on" style={{ marginLeft: 'auto' }}>{p.status}</span>
      </div>
      <div className="mono mb-4" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.tagline} · {p.meta}</div>
      <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: '20px', flex: 1 }}>{p.desc}</p>
      <div className="between">
        <span className="mono" style={{ fontSize: '11.5px', color: 'var(--accent)' }}>{p.url}</span>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>→</span>
      </div>
    </Link>
  );
}

export default async function SoftwarePage() {
  const c = ((await getContent()).pages.software as unknown) as SoftwareContent;

  return (
    <>
      <section style={{ background: 'var(--paper-2)', color: 'var(--ink)', position: 'relative' }}>
        <div className="hero-dark" style={{ maxWidth: '1320px', margin: '0 auto', padding: '64px 32px' }}>
          <div className="gap-12 mb-8" style={{ alignItems: 'center' }}>
            {c.hero.tags.map((t) => (
              <span key={t.label} className={`tag${t.variant === 'accent' ? ' accent' : ''}`} style={{ background: 'transparent' }}>{t.label}</span>
            ))}
            <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.1em', marginLeft: 'auto' }}>{c.hero.fig}</span>
          </div>
          <h1 className="h-display" style={{ maxWidth: '20ch', color: 'var(--ink)' }}>{c.hero.title}</h1>
        </div>
        <Photo {...c.hero.photo} style={{ borderLeft: 'none', borderRight: 'none' }} />
      </section>

      <Telemetry items={c.telemetry.map(([k, v]) => [k, v] as [ReactNode, ReactNode])} />

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
          <div className="section-label" style={{ color: 'var(--ink-3)' }}>
            <span className="num" style={{ color: 'var(--ink)', borderColor: 'var(--paper)' }}>{c.releaseLogHead.num}</span>
            <span>{c.releaseLogHead.label}</span>
            <span className="rule" style={{ background: 'var(--rule)' }} />
          </div>
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
                <div className="eyebrow mb-4">{h}</div>
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
