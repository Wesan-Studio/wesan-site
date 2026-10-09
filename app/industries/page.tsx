import type { ReactNode } from 'react';
import { Photo, Telemetry, SectionHead } from '../_components/lib';
import { getContent, type Tone } from '@/lib/content';

interface IndustriesContent {
  hero: { tags: { label: string; variant: string }[]; fig: string; title: string; photo: { tone: Tone; ratio: string; caption: string; label: string } };
  telemetry: [string, string][];
  manifesto: string;
  sectorsHead: { num: string; label: string; title: string };
  sectors: { code: string; name: string; desc: string; start: string }[];
  roadmapHead: { num: string; label: string; title: string };
  roadmap: [string, string][];
  footerStamp: { eyebrow: string; line: string };
}

export default async function IndustriesPage() {
  const c = ((await getContent()).pages.industries as unknown) as IndustriesContent;

  return (
    <>
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '88px 32px 48px' }}>
        <h1 className="h-display" style={{ maxWidth: '22ch' }}>{c.hero.title}</h1>
      </section>
      <div className="page-figure">
        <Photo tone={c.hero.photo.tone} ratio="3/1" gain={0.7} />
      </div>

      <Telemetry items={c.telemetry.map(([k, v]) => [k, v] as [ReactNode, ReactNode])} />

      <section className="section">
        <div className="container">
          <p className="serif" style={{ fontSize: '32px', lineHeight: 1.4, letterSpacing: '-0.012em', maxWidth: '36ch' }}>{c.manifesto}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.sectorsHead.num} label={c.sectorsHead.label} title={c.sectorsHead.title} />
          <div className="row row-3 mt-8">
            {c.sectors.map((s) => (
              <article key={s.code} className="card" style={{ borderStyle: 'dashed' }}>
                <div className="mono mb-4" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{s.code}</div>
                <h3 className="h-3" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 500, marginBottom: '14px' }}>{s.name}</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '20px' }}>{s.desc}</p>
                <span className="tag dashed">{s.start}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.roadmapHead.num} label={c.roadmapHead.label} title={c.roadmapHead.title} />
          <ol style={{ listStyle: 'none', padding: 0, marginTop: '40px' }}>
            {c.roadmap.map(([when, what], i, a) => (
              <li
                key={i}
                className="about-tl-grid"
                style={{
                  display: 'grid', gridTemplateColumns: '180px 1fr', gap: '32px',
                  padding: '24px 0', borderTop: '1px solid var(--rule)',
                  ...(i === a.length - 1 ? { borderBottom: '1px solid var(--rule)' } : {}),
                }}
              >
                <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em' }}>{when}</span>
                <span className="serif" style={{ fontSize: '20px', lineHeight: 1.4 }}>{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center', background: 'var(--paper-2)' }}>
        <span className="eyebrow">{c.footerStamp.eyebrow}</span>
        <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginTop: '8px' }}>{c.footerStamp.line}</p>
      </section>
    </>
  );
}
