'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useContent } from '@/lib/content-provider';

export function Wordmark({ size = 18, withCrumb = null }: { size?: number; withCrumb?: string | null }) {
  const brand = useContent().common.brand;
  const mark = size + 10;
  return (
    <Link href="/" className="nav-mark">
      <Image src="/logo.png" alt={brand} width={mark} height={mark} className="nav-logo" priority />
      <span className="word">{brand}</span>
      {withCrumb && <span className="crumb">/ {withCrumb}</span>}
    </Link>
  );
}

export function Nav() {
  const nav = useContent().nav;
  const pathname = usePathname() || '/';
  const activeKey = pathname.startsWith('/software') ? '/software' : pathname.startsWith('/studio') ? '/studio' : pathname;
  const crumb =
    pathname === '/software' ? 'SOFTWARE' :
    pathname === '/studio' ? 'STUDIO' :
    pathname === '/industries' ? 'INDUSTRIES' :
    null;
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

  const openCmdK = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  };

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Wordmark withCrumb={crumb} />
          <div className="nav-links">
            {nav.links.map((l) => (
              <Link key={l.href} href={l.href} className={activeKey === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            ))}
          </div>
          <span className="nav-grow" />
          <button className="nav-cmdk" onClick={openCmdK} aria-label="Open search">
            <Icon name="search" size={11} />
            <span>{nav.search}</span>
            <kbd>⌘K</kbd>
          </button>
          <Link href="/contact" className="nav-cta nav-cta-desktop">{nav.contact}</Link>
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
          <nav className="nav-drawer-inner" onClick={(e) => e.stopPropagation()}>
            {nav.links.map((l) => (
              <Link key={l.href} href={l.href} className={activeKey === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className={activeKey === '/contact' ? 'active' : ''}>{nav.contact}</Link>
            <hr className="ghr" style={{ margin: '12px 0' }} />
            <button onClick={() => { setMobileOpen(false); openCmdK(); }} className="nav-drawer-search">
              <Icon name="search" size={12} />
              <span>{nav.search}</span>
              <kbd>⌘K</kbd>
            </button>
          </nav>
        </div>
      )}
    </>
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
          <p style={{ color: 'var(--ink-3)', fontSize: '13.5px', maxWidth: '300px', marginBottom: '20px' }}>
            {f.blurb}
          </p>
          <div className="gap-8" style={{ color: 'var(--ink-3)' }}>
            <a href="https://github.com/wesan-labs" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" /></a>
            <a href="https://x.com/wesanco" target="_blank" rel="noopener noreferrer" aria-label="X"><Icon name="twitter" /></a>
            <a href="mailto:hello@wesan.co" aria-label="Email"><Icon name="mail" /></a>
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
        <span>{c.common.footerCopyright}</span>
        <span>{c.common.footerEst}</span>
        <span>{c.common.footerStatus}</span>
      </div>
    </footer>
  );
}
