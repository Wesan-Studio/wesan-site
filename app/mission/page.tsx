import Image from 'next/image';
import Link from 'next/link';
import { TracingBeam } from '../_components/lib';
import { getContent, type MissionBlock } from '@/lib/content';

function renderBlock(b: MissionBlock, i: number) {
  switch (b.kind) {
    case 'p':
      return (
        <p
          key={i}
          className={b.lead ? 'serif mb-6' : undefined}
          style={b.lead ? { fontSize: '24px', lineHeight: 1.5 } : { color: 'var(--ink-2)', marginBottom: '24px' }}
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case 'h2':
      return <h2 key={i} className="h-2 mt-12 mb-6">{b.text}</h2>;
    case 'figure':
      return (
        <figure
          key={i}
          style={{ margin: '56px 0 48px', padding: '40px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
        >
          <Image unoptimized width={1200} height={800} className="wmsketch" src={b.src} alt={b.alt} style={{ width: '100%', maxWidth: '720px', height: 'auto', margin: '0 auto' }} />
          <figcaption className="mono mt-6" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>
            {b.caption}<br />
            <span style={{ color: 'var(--ink-4)' }}>{b.credit}</span>
          </figcaption>
        </figure>
      );
    case 'hr':
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '48px 0' }} />;
    case 'quote':
      return (
        <p key={i} className="serif" style={{ fontSize: '22px', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--ink-2)' }}>
          &ldquo;{b.text}&rdquo;
        </p>
      );
    case 'sign':
      return (
        <p key={i} className="mono mt-4" style={{ fontSize: '12px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
          {b.text}
        </p>
      );
  }
}

export default async function MissionPage() {
  const c = (await getContent()).pages.mission;

  return (
    <>
      <section className="section" style={{ paddingTop: '96px', paddingBottom: '32px' }}>
        <div className="container-narrow">
          <div className="gap-12 mb-8">
            {c.tags.map((t) => (
              <span key={t.label} className={`tag${t.variant === 'accent' ? ' accent' : ''}`}>{t.label}</span>
            ))}
          </div>
          <h1 className="h-display" style={{ whiteSpace: 'pre-line' }}>{c.title}</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="container-narrow">
          <TracingBeam>
            <div style={{ fontSize: '17px', lineHeight: 1.75 }}>
              {c.body.map((b, i) => renderBlock(b, i))}
            </div>
          </TracingBeam>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', padding: '40px 32px' }}>
        <div className="container-narrow gap-16" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="eyebrow">{c.continue.label}</span>
          {c.continue.links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="mono">{l.label}</Link>
          ))}
        </div>
      </section>
    </>
  );
}
