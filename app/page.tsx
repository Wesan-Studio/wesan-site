import Link from 'next/link';
import { NEWS_SCENES, PRODUCT_SCENE } from './_components/dither-shader';
import { DitherField, DitherStill } from './_components/dither';
import { getContent, getNewsBySlugs, getNewsItems } from '@/lib/content';

interface WorkItem { key: string; name: string; line: string; desc?: string; href: string; external?: boolean; focus?: boolean }

async function getWork(): Promise<WorkItem[]> {
  const pages = (await getContent()).pages as unknown as {
    software: { products: { name: string; tagline: string; desc: string; slug?: string; focus?: boolean }[] };
    studio: { projects: { name: string; desc: string; href: string }[] };
  };
  const software = pages.software.products.map((p) => ({
    key: p.slug ?? p.name.toLowerCase(), name: p.name, line: p.tagline, desc: p.desc, focus: p.focus, href: `/software/${p.slug ?? p.name.toLowerCase()}`,
  }));
  const games = pages.studio.projects.map((g) => ({
    key: g.name.toLowerCase(), name: g.name, line: g.desc.split(':')[0], href: g.href, external: true,
  }));
  return [...software, ...games];
}

function WorkTile({ item, large = false }: { item: WorkItem; large?: boolean }) {
  const body = (
    <>
      <div className="work-media">
        <DitherStill scene={PRODUCT_SCENE[item.key] ?? 'orbit'} seed={item.key.length} gain={0.8} />
      </div>
      <div className="work-caption">
        <div>
          <h3 className="work-name">{item.name}</h3>
          <p className="work-line">{item.line}</p>
          {large && item.desc && <p className="work-desc">{item.desc}</p>}
        </div>
        <span className="work-arr" aria-hidden="true">{item.external ? '↗' : '→'}</span>
      </div>
    </>
  );
  return item.external
    ? <a href={item.href} target="_blank" rel="noreferrer" className={`work-tile${large ? ' large' : ''}`}>{body}</a>
    : <Link href={item.href} className={`work-tile${large ? ' large' : ''}`}>{body}</Link>;
}

export default async function HomePage() {
  const c = (await getContent()).pages.home;
  const featured = await getNewsBySlugs(c.newsroomSlugs);
  // Same scene as the release's own page, so a story keeps its picture everywhere.
  const order = (await getNewsItems()).map((n) => n.slug);
  const newsPos = (slug: string) => Math.max(0, order.indexOf(slug));
  const newsScene = (slug: string) => NEWS_SCENES[newsPos(slug) % NEWS_SCENES.length];
  const work = await getWork();
  const focus = work.filter((w) => w.focus);
  const rest = work.filter((w) => !w.focus);
  const horizon = c.telemetry[c.telemetry.length - 1];
  const [lead, ...moreNews] = featured;

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
          <div className="work-focus">
            {focus.map((item) => <WorkTile key={item.name} item={item} large />)}
          </div>
          <h3 className="work-subhead">Also in development</h3>
          <div className="work-grid">
            {rest.map((item) => <WorkTile key={item.name} item={item} />)}
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
                <div className="photo news-media"><DitherStill scene={newsScene(lead.slug)} seed={newsPos(lead.slug) + 2} gain={0.8} /></div>
                <p className="news-meta">{lead.date}</p>
                <h3 className="news-title">{lead.what}</h3>
              </Link>
              <div className="news-side">
                {moreNews.map((it) => (
                  <Link key={it.slug} href={`/newsroom/${it.slug}`} className="news-card">
                    <div className="photo news-media"><DitherStill scene={newsScene(it.slug)} seed={newsPos(it.slug) + 2} gain={0.8} /></div>
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
