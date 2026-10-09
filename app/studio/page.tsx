import Link from 'next/link';
import { sentence } from '../_components/detail-hero';
import { Photo, SectionHead } from '../_components/lib';
import { getContent, type Tone } from '@/lib/content';

export const metadata = {
  title: 'Studio',
  description: 'Wesan Studio makes games. Empire Inc. and Block Forge are live on the App Store.',
};

interface StudioContent {
  hero: { tags: { label: string; variant: string }[]; fig: string; title: string; photo: { tone: Tone; ratio: string; caption: string; label: string } };
  manifesto: string;
  projectsHead: { num: string; label: string; title: string };
  projects: { code: string; name: string; desc: string; meta: string[]; href: string; status?: string; img?: string; external?: boolean }[];
  principlesHead: { num: string; label: string; title: string };
  principles: [string, string][];
  footerStamp: { eyebrow: string; line: string };
}

export default async function StudioPage() {
  const c = ((await getContent()).pages.studio as unknown) as StudioContent;

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
          <SectionHead num={c.projectsHead.num} label={c.projectsHead.label} title={c.projectsHead.title} />
          <div className="row row-2">
            {c.projects.map((p) => {
              const live = p.status === 'LIVE';
              const cardStyle = { background: 'var(--paper-3)', cursor: 'pointer', display: 'block', color: 'inherit', textDecoration: 'none' } as const;
              const body = (
                <>
                  {p.img ? (
                    <div style={{ aspectRatio: '16/10', marginBottom: '24px', position: 'relative', overflow: 'hidden', border: '1px solid var(--rule)', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div aria-hidden style={{ position: 'absolute', inset: '-20%', backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(34px) saturate(1.2)', opacity: 0.5 }} />
                      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgb(var(--dither-ground) / 0.15), rgb(var(--dither-ground) / 0.6))' }} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={`${p.name} app icon`} width={132} height={132} style={{ position: 'relative', borderRadius: '28px', boxShadow: '0 14px 44px rgba(0,0,0,0.5)', border: '1px solid var(--rule)' }} />
                      <span className="mono" style={{ position: 'absolute', left: '14px', bottom: '12px', fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--ink-2)', textTransform: 'uppercase', zIndex: 3 }}>{p.name}</span>
                      {live && <span className="mono" style={{ position: 'absolute', right: '14px', top: '12px', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--ok)', textTransform: 'uppercase', zIndex: 3 }}>● {p.status}</span>}
                    </div>
                  ) : (
                    <div className="frame frame-cross" style={{ aspectRatio: '16/10', marginBottom: '24px' }}>
                      <span className="mono" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>[ {p.code} · STILL ]</span>
                    </div>
                  )}
                  <div className="gap-12 mb-4" style={{ alignItems: 'baseline' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{p.code}</span>
                    <span className={`tag ${live ? 'status-on' : 'accent'}`}>{p.status ?? 'FORMING'}</span>
                    <span className="mono" style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{live ? 'PLAY →' : 'OPEN →'}</span>
                  </div>
                  <h3 className="h-3" style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 500, marginBottom: '14px' }}>{p.name}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '20px' }}>{p.desc}</p>
                  <div className="gap-wrap">
                    {p.meta.map((m) => <span key={m} className="tag">{m}</span>)}
                  </div>
                </>
              );
              return p.external ? (
                <a key={p.code} href={p.href} target="_blank" rel="noopener noreferrer" className="card" style={cardStyle}>{body}</a>
              ) : (
                <Link key={p.code} href={p.href} className="card" style={cardStyle}>{body}</Link>
              );
            })}
          </div>
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
