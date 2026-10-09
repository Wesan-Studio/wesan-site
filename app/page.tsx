import Link from 'next/link';
import type { Scene } from './_components/dither-shader';
import { DitherField, DitherStill } from './_components/dither';
import { sceneForDivision } from './_components/detail-hero';
import { getContent, getNewsBySlugs } from '@/lib/content';

interface WorkItem { name: string; line: string; href: string; img?: string; external?: boolean }

const SCENES: Scene[] = ['orbit', 'horizon', 'ridges', 'swell'];

async function getWork(): Promise<WorkItem[]> {
  const pages = (await getContent()).pages as unknown as {
    software: { products: { name: string; tagline: string; slug?: string; img?: string }[] };
    studio: { projects: { name: string; desc: string; href: string; img?: string }[] };
  };
  const software = pages.software.products.map((p) => ({
    name: p.name, line: p.tagline, img: p.img, href: `/software/${p.slug ?? p.name.toLowerCase()}`,
  }));
  const games = pages.studio.projects.map((g) => ({
    name: g.name, line: g.desc.split(':')[0], img: g.img, href: g.href, external: true,
  }));
  return [...software, ...games];
}

function WorkTile({ item, index }: { item: WorkItem; index: number }) {
  const body = (
    <>
      <div className="work-media">
        <DitherStill scene={SCENES[index % SCENES.length]} seed={index + 3} gain={item.img ? 0.3 : 0.75} />
        {item.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.img} alt="" width={96} height={96} className="work-icon" />
        )}
      </div>
      <div className="work-caption">
        <div>
          <h3 className="work-name">{item.name}</h3>
          <p className="work-line">{item.line}</p>
        </div>
        <span className="work-arr" aria-hidden="true">{item.external ? '↗' : '→'}</span>
      </div>
    </>
  );
  return item.external
    ? <a href={item.href} target="_blank" rel="noreferrer" className="work-tile">{body}</a>
    : <Link href={item.href} className="work-tile">{body}</Link>;
}

export default async function HomePage() {
  const c = (await getContent()).pages.home;
  const featured = await getNewsBySlugs(c.newsroomSlugs);
  const work = await getWork();
  const horizon = c.telemetry[c.telemetry.length - 1];
  const [lead, ...rest] = featured;

  return (
    <>
      <section className="hero">
        <DitherField scene="horizon" seed={1} cell={3} />
        <div className="hero-inner">
          <div>
            <p className="hero-est">
              {c.hero.tags[0]?.label} <span aria-hidden="true">→</span> {horizon.value}{horizon.suffix} {horizon.label}
            </p>
            <h1 className="h-display caps mb-6" style={{ maxWidth: '16ch', whiteSpace: 'pre-line' }}>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="statement">{c.manifesto.body}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="between mb-8">
            <h2 className="h-1">What we build</h2>
            <Link href="/software" className="text-link">All software →</Link>
          </div>
          <div className="work-grid">
            {work.map((item, i) => <WorkTile key={item.name} item={item} index={i} />)}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="h-1 mb-8">{c.divisionsHead.title}</h2>
          <div className="division-links">
            {c.bento.filter((b) => b.href !== '/mission').map((b) => (
              <Link key={b.href} href={b.href} className="division-link">
                <span className="division-name">{b.title} <span aria-hidden="true">→</span></span>
                <span className="division-desc">{b.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {lead && (
        <section className="section chapter">
          <div className="container">
            <div className="between mb-8">
              <h2 className="h-1">{c.newsroomHead.title}</h2>
              <Link href={c.newsroomHead.viewAllHref!} className="text-link">{c.newsroomHead.viewAllLabel} →</Link>
            </div>
            <div className="news-grid">
              <Link href={`/newsroom/${lead.slug}`} className="news-card news-lead">
                <div className="photo news-media"><DitherStill scene={sceneForDivision(lead.who)} seed={2} gain={0.75} /></div>
                <p className="news-meta">{lead.date}</p>
                <h3 className="news-title">{lead.what}</h3>
              </Link>
              <div className="news-side">
                {rest.map((it, i) => (
                  <Link key={it.slug} href={`/newsroom/${it.slug}`} className="news-card">
                    <div className="photo news-media"><DitherStill scene={sceneForDivision(it.who)} seed={i + 5} gain={0.75} /></div>
                    <p className="news-meta">{it.date}</p>
                    <h3 className="news-title small">{it.what}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <p className="founder-quote">&ldquo;{c.founderLetter.quote}&rdquo;</p>
          <Link href={c.founderLetter.ctaHref} className="btn mt-8">{c.founderLetter.ctaLabel} <span className="arr">→</span></Link>
        </div>
      </section>
    </>
  );
}
