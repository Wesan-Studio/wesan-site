import Link from 'next/link';
import type { ReactNode } from 'react';
import { DitherStill } from './dither';
import type { Scene } from './dither-shader';

const DIVISION_SCENE: Record<string, Scene> = { SOFTWARE: 'orbit', STUDIO: 'swell', INDUSTRIES: 'ridges' };

export function sceneForDivision(division: string): Scene {
  return DIVISION_SCENE[division.toUpperCase()] ?? 'horizon';
}

interface DetailHeroProps {
  back: { href: string; label: string };
  scene: Scene;
  seed?: number;
  title: string;
  meta?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}

export function DetailHero({ back, scene, seed = 3, title, meta, lede, children }: DetailHeroProps) {
  const sentence = title.length > 40;
  return (
    <section className="hero hero-detail">
      <DitherStill scene={scene} seed={seed} cell={3} gain={0.55} />
      <div className="hero-inner">
        <div>
          <Link href={back.href} className="back-link">{back.label}</Link>
          {meta && <div className="detail-meta">{meta}</div>}
          <h1 className={sentence ? 'h-1 h-sentence' : 'h-display'} style={{ whiteSpace: 'pre-line' }}>{title}</h1>
          {lede && <p className="hero-lead mt-6">{lede}</p>}
          {children && <div className="gap-12 mt-8" style={{ flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
