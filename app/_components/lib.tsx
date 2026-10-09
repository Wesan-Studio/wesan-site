'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { DitherStill } from './dither';
import { TONE_SCENE } from './dither-shader';

interface PhotoProps {
  tone?: 'architecture' | 'workstation' | 'stage' | 'industrial' | 'dawn' | 'geology' | 'systems';
  ratio?: string;
  /** Accepted from content but not drawn: pictures carry no figure labels. */
  caption?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  gain?: number;
}

export function Photo({ tone = 'architecture', ratio = '16/9', children, style, className = '', gain = 0.8 }: PhotoProps) {
  const [scene, seed] = TONE_SCENE[tone];
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <DitherStill scene={scene} seed={seed} gain={gain} />
      {children}
    </div>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  as?: ElementType;
  href?: string;
}

export function SpotlightCard({ children, className = '', style, onClick, as: Comp = 'div', href }: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  const sharedClass = `spot-card ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={sharedClass}
        style={style}
        onMouseMove={onMove}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  const Tag = Comp as 'div';
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={sharedClass} style={style} onMouseMove={onMove} onClick={onClick}>
      {children}
    </Tag>
  );
}

interface CounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function Counter({ to, duration = 1400, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVal(to));
      return () => cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(eased * to);
              if (t < 1) requestAnimationFrame(tick);
              else setVal(to);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);

  const display = decimals === 0 ? Math.round(val).toString() : val.toFixed(decimals);
  return (
    <span ref={ref} className="counter">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.section-label').forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.section-label').forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.section-label').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) {
        el.classList.add('is-revealed');
      } else {
        io.observe(el);
      }
    });
    return () => io.disconnect();
  });
}

interface SectionHeadProps {
  /** Kept for content compatibility; the numbered label row is no longer shown. */
  num?: ReactNode;
  label?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHead({ title, sub, align = 'left' }: SectionHeadProps) {
  return (
    <header style={{ marginBottom: '32px' }}>
      <div style={{ textAlign: align, maxWidth: align === 'center' ? 720 : 'none', margin: align === 'center' ? '0 auto' : '0' }}>
        <h2 className="h-1" style={{ marginBottom: sub ? '18px' : '0' }}>{title}</h2>
        {sub && <p className="lead" style={{ margin: align === 'center' ? '0 auto' : '0' }}>{sub}</p>}
      </div>
    </header>
  );
}
