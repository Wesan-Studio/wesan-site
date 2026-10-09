'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* One quiet motion layer for the whole site: the home hero settles in, and content below
   the fold rises into place once as it scrolls into view. Nothing runs for reduced motion. */

const REVEAL = [
  'main h2.h-1', '.statement', '.founder-quote', '.work-tile', '.division-link', '.news-card',
  '.product-card', '.card', '.div-split', '.detail-figure', '.contact-form',
].join(', ');

const EASE = 'power3.out';

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from('.hero-inner > div > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08, ease: EASE });
        // Only elements still below the fold get hidden, so nothing visible ever blinks out.
        const below = gsap.utils.toArray<HTMLElement>(REVEAL).filter((el) => el.getBoundingClientRect().top > innerHeight);
        gsap.set(below, { opacity: 0, y: 24 });
        ScrollTrigger.batch(below, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: EASE, overwrite: true }),
        });
      });
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
