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
  title: string;
  meta?: string[];
  lede?: ReactNode;
  /** Optional picture under the header; text never sits on top of it. */
  figure?: { scene: Scene; seed?: number };
  children?: ReactNode;
}

export function DetailHero({ back, title, meta, lede, figure, children }: DetailHeroProps) {
  return (
    <header className="detail">
      <div className="read-col">
        <Link href={back.href} className="back-link">{back.label}</Link>
        {meta && meta.length > 0 && (
          <p className="detail-meta">
            {meta.map((m, i) => (
              <span key={m}>{i > 0 && <span className="sep" aria-hidden="true">·</span>}{m}</span>
            ))}
          </p>
        )}
        <h1 className="detail-title">{title}</h1>
        {lede && <p className="detail-lede">{lede}</p>}
        {children && <div className="detail-actions">{children}</div>}
      </div>
      {figure && (
        <div className="detail-figure">
          <DitherStill scene={figure.scene} seed={figure.seed ?? 3} cell={2} gain={0.75} />
        </div>
      )}
    </header>
  );
}

/** Sentence-cases labels that arrive in all caps from content. */
export function sentence(label: string) {
  const s = label.toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
