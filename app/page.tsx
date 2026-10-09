import Link from 'next/link';
import { Photo, Counter, Marquee, SectionHead, SpotlightCard } from './_components/lib';
import { TONE_SCENE } from './_components/dither-shader';
import { DitherField, DitherStill } from './_components/dither';
import { getContent, getNewsBySlugs } from '@/lib/content';

export default async function HomePage() {
  const c = (await getContent()).pages.home;
  const featured = await getNewsBySlugs(c.newsroomSlugs);

  return (
    <>
      <section className="hero">
        <DitherField scene="horizon" seed={1} cell={3} />
        <div className="hero-inner">
          <div>
            <div className="gap-8 mb-6" style={{ flexWrap: 'wrap' }}>
              {c.hero.tags.map((t) => (
                <span key={t.label} className={`tag glass${t.variant === 'accent' ? ' accent' : ''}`}>{t.label}</span>
              ))}
            </div>
            <h1 className="h-display mb-6" style={{ maxWidth: '16ch', whiteSpace: 'pre-line' }}>
              {c.hero.title}
            </h1>
            <p className="hero-lead mb-8">{c.hero.lead}</p>
            <div className="gap-12" style={{ flexWrap: 'wrap' }}>
              {c.hero.ctas.map((cta) => (
                <Link key={cta.href} href={cta.href} className={`btn${cta.variant === 'solid' ? ' solid' : ''}`}>
                  {cta.label}{cta.variant === 'solid' ? <> <span className="arr">→</span></> : null}
                </Link>
              ))}
            </div>
          </div>
          <div className="hero-telemetry glass" aria-label="Wesan at a glance">
            {c.telemetry.map((t) => (
              <div key={t.label}>
                <div className="v"><Counter to={t.value} suffix={t.suffix} /></div>
                <div className="k">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee label={c.marquee.label} items={c.marquee.items} />

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.manifesto.num} label={c.manifesto.label} title={null} />
          <p className="serif" style={{ fontSize: '34px', lineHeight: 1.3, letterSpacing: '-0.015em', maxWidth: '32ch' }}>
            {c.manifesto.body}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            num={c.divisionsHead.num}
            label={c.divisionsHead.label}
            title={c.divisionsHead.title}
            sub={c.divisionsHead.sub}
          />
          <div className="bento mt-8">
            {c.bento.map((card) => {
              const real = !!(card.icons && card.icons.length > 0);
              return (
              <SpotlightCard key={card.href} href={card.href} className={`${card.size} photo`}>
                <DitherStill scene={TONE_SCENE[card.tone][0]} seed={TONE_SCENE[card.tone][1] + 10} gain={0.6} />
                <div className="corners" />
                {real && (
                  <div className="bento-icons">
                    {card.icons!.map((ic) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={ic} src={ic} alt="" width={56} height={56} />
                    ))}
                  </div>
                )}
                <span className="bento-arr">{card.arr}</span>
                <span className="bento-label">{card.label}</span>
                <h3 className="bento-title" style={card.titleSize ? { fontSize: `${card.titleSize}px` } : undefined}>{card.title}</h3>
                <p className="bento-desc" style={card.size === 'b-4' ? { maxWidth: '60ch' } : undefined}>{card.desc}</p>
                {card.tags && card.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {card.tags.map((t) => (
                      <span key={t} className="tag glass">{t}</span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <div className="between mb-8">
            <SectionHead num={c.newsroomHead.num} label={c.newsroomHead.label} title={c.newsroomHead.title} />
            <Link href={c.newsroomHead.viewAllHref!} className="btn ghost">{c.newsroomHead.viewAllLabel} <span className="arr">→</span></Link>
          </div>
          <div className="row row-3">
            {featured.map((it) => {
              const tone = it.who === 'STUDIO' ? 'stage' : it.who === 'INDUSTRIES' ? 'industrial' : it.who === 'WESAN' ? 'architecture' : 'workstation';
              return (
                <SpotlightCard key={it.slug} href={`/newsroom/${it.slug}`} className="media-link">
                  <Photo tone={tone} ratio="16/10" style={{ marginBottom: '16px' }} caption={`· ${it.who}`} label={it.date.split('.').slice(1).join('.')} />
                  <div className="gap-12 mb-2" style={{ alignItems: 'baseline' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{it.date}</span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em' }}>{it.who}</span>
                  </div>
                  <h3 className="serif" style={{ fontSize: '22px', lineHeight: 1.25 }}>{it.what}</h3>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow">{c.founderLetter.label}</span>
          <p className="serif mt-6 mb-8" style={{ fontSize: '30px', fontStyle: 'italic', lineHeight: 1.45, letterSpacing: '-0.01em' }}>
            &ldquo;{c.founderLetter.quote}&rdquo;
          </p>
          <Link href={c.founderLetter.ctaHref} className="btn">{c.founderLetter.ctaLabel} <span className="arr">→</span></Link>
        </div>
      </section>
    </>
  );
}
