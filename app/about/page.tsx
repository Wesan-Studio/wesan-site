import Link from 'next/link';
import { sentence } from '../_components/detail-hero';
import { Photo, Counter, SectionHead } from '../_components/lib';
import { Icon } from '../_components/icons';
import { getContent } from '@/lib/content';

interface AboutContent {
  head: { num: string; label: string; title: string; sub: string };
  founder: {
    eyebrow: string;
    name: string;
    photo: { tone: 'workstation'; ratio: string; label: string; caption: string };
    lead: string;
    paragraphs: string[];
    social: { icon: 'github' | 'linkedin' | 'mail'; label: string; href: string }[];
  };
  story: { head: { num: string; label: string; title: string }; timeline: [string, string][] };
  governance: { head: { num: string; label: string; title: string }; cards: [string, string][] };
  numbers: { eyebrow: string; items: { label: string; value: number }[] };
}

export default async function AboutPage() {
  const c = ((await getContent()).pages.about as unknown) as AboutContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container">
          <div className="row row-2" style={{ gap: '64px', alignItems: 'flex-start' }}>
            <Photo tone={c.founder.photo.tone} ratio={c.founder.photo.ratio} style={{ borderRadius: '12px' }} />
            <div>
              <span className="eyebrow mb-4" style={{ display: 'block' }}>{c.founder.eyebrow}</span>
              <h2 className="h-1 mb-6">{c.founder.name}</h2>
              <p className="serif mb-6" style={{ fontSize: '22px', lineHeight: 1.45, color: 'var(--ink-2)' }}>{c.founder.lead}</p>
              {c.founder.paragraphs.map((p, i) => (
                <p
                  key={i}
                  style={{ fontSize: '15.5px', lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: i === c.founder.paragraphs.length - 1 ? '24px' : '16px' }}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
              <div className="gap-8">
                {c.founder.social.map((s) => {
                  const isInternal = s.href.startsWith('/');
                  const inner = (<><Icon name={s.icon} size={13} /> {s.label}</>);
                  return isInternal
                    ? <Link key={s.label} href={s.href} className="btn ghost">{inner}</Link>
                    : <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="btn ghost">{inner}</a>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.story.head.num} label={c.story.head.label} title={c.story.head.title} />
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {c.story.timeline.map(([when, what], i, a) => (
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

      <section className="section">
        <div className="container">
          <SectionHead num={c.governance.head.num} label={c.governance.head.label} title={c.governance.head.title} />
          <div className="row row-3 mt-8">
            {c.governance.cards.map(([h, b]) => (
              <div key={h} className="card">
                <h3 className="card-title">{sentence(h)}</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.numbers.eyebrow}</span>
          <div className="row row-4 mt-8">
            {c.numbers.items.map((n) => (
              <div key={n.label}>
                <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>{n.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: '8px' }}>
                  <Counter to={n.value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
