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
import Image from 'next/image';

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
  return (
    <div className={`photo photo-cross ${tone} ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <Image src={tone === 'workstation' || tone === 'systems' ? '/images/meltir-workspace.webp' : '/images/wesan-horizon.webp'} alt="" fill sizes="(max-width: 760px) 100vw, 80vw" className="photo-image" />
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

export function Counter({ to, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  return <span className="counter">{prefix}{to.toFixed(decimals)}{suffix}</span>;
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
