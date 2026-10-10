'use client';

import { DitherStill } from '../_components/dither';
import { NEWS_SCENES } from '../_components/dither-shader';
import { useState } from 'react';
import Link from 'next/link';
import { SectionHead } from '../_components/lib';
import type { Division, NewsItem, NewsroomIndexContent } from '@/lib/content';

export function NewsroomClient({
  c,
  items,
}: {
  c: NewsroomIndexContent;
  items: NewsItem[];
}) {
  const [filter, setFilter] = useState<'ALL' | Division>('ALL');
  const filtered = filter === 'ALL' ? items : items.filter((i) => i.who === filter);
  const featured = filtered.find((x) => x.featured);
  const rest = filtered.filter((x) => !x.featured);

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num!} label={c.head.label!} title={c.head.title!} sub={c.head.sub} />
          <div className="between mt-8">
            <div className="gap-8">
              {c.filters.map((k) => (
                <button
                  key={k}
                  className={filter === k ? 'tag solid' : 'tag'}
                  onClick={() => setFilter(k as 'ALL' | Division)}
                  style={{ cursor: 'pointer' }}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{c.yearLabel}</div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="section" style={{ paddingTop: '0' }}>
          <div className="container">
            <article className="row row-2" style={{ gap: '48px', alignItems: 'center', paddingBottom: '40px', borderBottom: '1px solid var(--rule)' }}>
              <div className="photo" style={{ aspectRatio: '16/10', borderRadius: '12px' }}>
                <DitherStill scene={NEWS_SCENES[Math.max(0, items.findIndex((x) => x.slug === featured.slug)) % NEWS_SCENES.length]} seed={Math.max(0, items.findIndex((x) => x.slug === featured.slug)) + 2} gain={0.8} />
              </div>
              <div>
                <div className="gap-12 mb-4" style={{ alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{featured.date}</span>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em' }}>{featured.who} · {c.releaseLabel}</span>
                  <span className="tag status-on">{c.featuredLabel}</span>
                </div>
                <h2 className="h-1" style={{ marginBottom: '20px' }}>{featured.what}</h2>
                <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: '24px' }}>{featured.lede}</p>
                <Link href={`/newsroom/${featured.slug}`} className="btn solid">
                  {c.readCta} <span className="arr">→</span>
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          {rest.map((it) => (
            <Link key={it.slug} href={`/newsroom/${it.slug}`} className="press-row" style={{ color: 'inherit', textDecoration: 'none' }}>
              <span className="when">{it.date}</span>
              <span className="who">{it.who}</span>
              <p className="what">{it.what}</p>
              <span className="arr">{c.pressLabel}</span>
            </Link>
          ))}
          <div className="mt-12 mono" style={{ fontSize: '11px', color: 'var(--ink-3)', textAlign: 'center', letterSpacing: '0.1em' }}>{c.endLabel}</div>
        </div>
      </section>
    </>
  );
}
