'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DitherStill } from './dither';
import { TONE_SCENE } from './dither-shader';

interface PhotoProps {
  tone?: 'architecture' | 'workstation' | 'stage' | 'industrial' | 'dawn' | 'geology' | 'systems';
  ratio?: string;
  caption?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}


export function Photo({ tone = 'architecture', ratio = '16/9', caption, label, children, style, className = '' }: PhotoProps) {
  const [scene, seed] = TONE_SCENE[tone];
  return (
    <div className={`photo photo-cross ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <DitherStill scene={scene} seed={seed} />
      <div className="corners" />
      {label && <span className="cap-tr">{label}</span>}
      {caption && <span className="cap">{caption}</span>}
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

export function Marquee({ items, label }: { items: ReactNode[]; label?: string }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <div className="mono" style={{ fontSize: '10.5px', color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>
          {label}
        </div>
      )}
      <div className="marquee">
        <div className="marquee-track">
          {doubled.map((it, i) => (
            <span key={i} className="marquee-item">
              {it}
              <span className="sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TracingBeam({ children, padTop = 80, padBottom = 120 }: { children: ReactNode; padTop?: number; padBottom?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [beam, setBeam] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - padTop - padBottom;
      const center = window.innerHeight / 2;
      const offsetTop = -rect.top;
      const progress = (offsetTop - padTop + center) / total;
      const clamped = Math.max(0, Math.min(1, progress));
      setBeam(Math.round(clamped * el.offsetHeight));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [padTop, padBottom]);

  return (
    <div ref={wrap} className="tbeam" style={{ ['--beam' as string]: `${beam}px` } as CSSProperties}>
      <div className="tbeam-rail" />
      <div className="tbeam-fill" />
      <div className="tbeam-head" />
      {children}
    </div>
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

const pageMap: Record<string, string> = {
  '/': '01',
  '/about': '02',
  '/divisions': '03',
  '/software': '04',
  '/studio': '05',
  '/industries': '06',
  '/mission': '07',
  '/newsroom': '08',
  '/careers': '09',
  '/contact': '10',
  '/press': '11',
  '/legal': '12',
  '/investors': '13',
  '/reports': '14',
  '/trust': '15',
  '/now': '16',
  '/sitemap': '17',
  '/calendar': '18',
};

function fmtTime() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
  }).format(new Date());
}

export function DraftingFrame() {
  const pathname = usePathname() || '/';
  const [scrollPct, setScrollPct] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTime(fmtTime()));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      setScrollPct(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const tid = setInterval(() => setTime(fmtTime()), 30000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(tid);
      cancelAnimationFrame(frame);
    };
  }, []);

  const pageLabel = (pathname === '/' ? 'HOME' : pathname.slice(1).toUpperCase()).replace(/-/g, ' · ');
  const pageNum = pageMap[pathname] || '01';
  const totalPages = '20';

  return (
    <>
      <div className="ruler left" aria-hidden="true" />
      <div className="ruler right" aria-hidden="true" />
      <div className="tb tb-tl">
        <strong>WESAN</strong>
        <span className="sep" />
        <span>EST. MMXXVI</span>
      </div>
      <div className="tb tb-tr">
        <span>SHEET</span>
        <strong>
          {pageNum} / {totalPages}
        </strong>
        <span className="sep" />
        <span>{pageLabel}</span>
      </div>
      <div className="tb tb-bl">
        <span>LONDON</span>
        <span className="sep" />
        <span>{time || '-'}</span>
      </div>
      <div className="tb tb-br">
        <span>SCALE 1:1</span>
        <span className="sep" />
        <span>SCROLL</span>
        <strong>{String(scrollPct).padStart(2, '0')}%</strong>
      </div>
    </>
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
  num: ReactNode;
  label: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHead({ num, label, title, sub, align = 'left' }: SectionHeadProps) {
  return (
    <header>
      <div className="section-label">
        <span className="num">{num}</span>
        <span>{label}</span>
        <span className="rule" />
      </div>
      <div style={{ textAlign: align, maxWidth: align === 'center' ? 720 : 'none', margin: align === 'center' ? '0 auto' : '0' }}>
        <h2 className="h-1" style={{ marginBottom: sub ? '18px' : '0' }}>{title}</h2>
        {sub && <p className="lead" style={{ margin: align === 'center' ? '0 auto' : '0' }}>{sub}</p>}
      </div>
    </header>
  );
}

export function Telemetry({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <div className="telemetry">
      {items.map(([k, v], i) => (
        <div key={i}>
          <strong>{v}</strong> · {k}
        </div>
      ))}
    </div>
  );
}

export { useMemo };
