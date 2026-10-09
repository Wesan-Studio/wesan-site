'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useContent } from '@/lib/content-provider';
import type { NavLink } from '@/lib/content';

export function Wordmark({ size = 18 }: { size?: number }) {
  const brand = useContent().common.brand;
  const mark = size + 10;
  return (
    <Link href="/" className="nav-mark">
      <Image src="/logo.png" alt={brand} width={mark} height={mark} className="nav-logo" priority />
      <span className="word">{brand}</span>
    </Link>
  );
}

function isActive(l: NavLink, pathname: string) {
  return l.href === pathname || !!l.children?.some((c) => c.href === pathname);
}

export function Nav() {
  const nav = useContent().nav;
  const pathname = usePathname() || '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Wordmark />
          <nav className="nav-groups" aria-label="Main">
            {nav.links.map((l) => (
              <div key={l.label} className={`nav-group${isActive(l, pathname) ? ' active' : ''}`}>
                <Link href={l.href} className="nav-top" aria-current={isActive(l, pathname) ? 'page' : undefined}>{l.label}</Link>
              </div>
            ))}
          </nav>
          <button
            className="nav-burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`burger-bar ${mobileOpen ? 'is-x1' : ''}`} />
            <span className={`burger-bar ${mobileOpen ? 'is-x2' : ''}`} />
            <span className={`burger-bar ${mobileOpen ? 'is-x3' : ''}`} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="nav-drawer" onClick={() => setMobileOpen(false)}>
          <nav className="nav-drawer-inner" onClick={(e) => e.stopPropagation()} aria-label="Main">
            {nav.links.map((l) => (
              <div key={l.label} className="drawer-group">
                <div className="drawer-label">{l.label}</div>
                {(l.children ?? [l]).map((c) => (
                  <Link key={c.label} href={c.href} className={c.href === pathname ? 'active' : ''}>{c.label}</Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

type ThemeChoice = 'auto' | 'light' | 'dark';

function readTheme(): ThemeChoice {
  const t = document.documentElement.dataset.theme;
  return t === 'light' || t === 'dark' ? t : 'auto';
}

function applyTheme(next: ThemeChoice) {
  const root = document.documentElement;
  if (next === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', next);
  try {
    if (next === 'auto') localStorage.removeItem('theme');
    else localStorage.setItem('theme', next);
  } catch {}
}

function ThemeSwitch() {
  const [choice, setChoice] = useState<ThemeChoice>('auto');
  useEffect(() => {
    const frame = requestAnimationFrame(() => setChoice(readTheme()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const pick = (next: ThemeChoice) => {
    applyTheme(next);
    setChoice(next);
  };

  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      {(['auto', 'light', 'dark'] as const).map((t) => (
        <button key={t} type="button" aria-pressed={choice === t} onClick={() => pick(t)}>{t}</button>
      ))}
    </div>
  );
}

export function Footer() {
  const c = useContent();
  const f = c.footer;

  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>
          <Link href="/" className="foot-mark">
            <Image src="/logo.png" alt={c.common.brand} width={28} height={28} className="foot-logo" />
            <span className="word">{c.common.brand}</span>
          </Link>
          <p style={{ color: 'var(--ink-3)', fontSize: '14px', maxWidth: '300px', marginBottom: '20px' }}>
            {f.blurb}
          </p>
          <div className="foot-social">
            <a href="https://github.com/wesanjs" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" size={16} /></a>
            <a href="https://www.linkedin.com/company/wesancompany" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={15} /></a>
            <a href="mailto:hello@wesan.co" aria-label="Email"><Icon name="mail" size={16} /></a>
          </div>
        </div>
        {f.columns.map((col) => (
          <div key={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map((l) => (
              <Link key={l.label + l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="foot-strip">
        <span>{c.common.footerCopyright} · {c.common.location}</span>
        <ThemeSwitch />
      </div>
    </footer>
  );
}
