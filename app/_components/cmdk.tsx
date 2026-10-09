'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icons';

interface SearchEntry {
  k: string;
  l: string;
  t: string[];
  section: string;
}

const SEARCH_INDEX: SearchEntry[] = [
  { k: 'software/meltir', l: 'Meltir', t: ['workspace', 'mail', 'calendar', 'meetings'], section: 'Products' },
  { k: 'software/levios-ai', l: 'Levios AI', t: ['social', 'photos', 'captions', 'business'], section: 'Products' },
  { k: '', l: 'Home', t: ['cathedral', 'front door'], section: 'COMPANY' },
  { k: 'about', l: 'About', t: ['founder', 'team', 'story', 'governance', 'yıldız'], section: 'COMPANY' },
  { k: 'mission', l: 'Mission', t: ['century', 'why', 'commitments', 'patient capital'], section: 'COMPANY' },
  { k: 'now', l: 'Now', t: ['this month', 'monthly', 'founder note'], section: 'COMPANY' },
  { k: 'divisions', l: 'Divisions · index', t: ['three rooms', 'overview'], section: 'DIVISIONS' },
  { k: 'software', l: 'Software', t: ['friday', 'dante', 'notch', 'apps', 'developer'], section: 'DIVISIONS' },
  { k: 'studio', l: 'Studio', t: ['games', 'empire inc', 'block forge', 'live'], section: 'DIVISIONS' },
  { k: 'industries', l: 'Industries', t: ['aerospace', 'defense', 'heavy', 'planned'], section: 'DIVISIONS' },
  { k: 'newsroom', l: 'Newsroom', t: ['press', 'releases', 'announcements'], section: 'REPORTING' },
  { k: 'reports', l: 'Field reports', t: ['annual', 'april', 'transparency'], section: 'REPORTING' },
  { k: 'investors', l: 'Investors', t: ['capital', 'funding', 'no investors', 'cap table'], section: 'REPORTING' },
  { k: 'careers', l: 'Careers', t: ['jobs', 'hiring', 'roles', 'work at wesan'], section: 'PEOPLE' },
  { k: 'contact', l: 'Contact', t: ['email', 'press', 'partner', 'hello'], section: 'PEOPLE' },
  { k: 'calendar', l: 'Calendar', t: ['events', 'talks', 'demos', 'showings'], section: 'PEOPLE' },
  { k: 'press', l: 'Press kit', t: ['logo', 'wordmark', 'brand', 'boilerplate', 'media'], section: 'PAPERWORK' },
  { k: 'trust', l: 'Trust & security', t: ['soc 2', 'security', 'subprocessors', 'compliance'], section: 'PAPERWORK' },
  { k: 'legal', l: 'Legal', t: ['privacy', 'terms', 'cookies', 'trademarks', 'dpa'], section: 'PAPERWORK' },
  { k: 'sitemap', l: 'Sitemap', t: ['index', 'all pages', 'tree'], section: 'PAPERWORK' },
];

function score(item: SearchEntry, q: string) {
  if (!q) return 0;
  const ql = q.toLowerCase();
  const ll = item.l.toLowerCase();
  if (ll === ql) return 1000;
  if (ll.startsWith(ql)) return 500;
  if (ll.includes(ql)) return 200;
  for (const t of item.t) {
    if (t.toLowerCase().includes(ql)) return 100;
  }
  if (item.section.toLowerCase().includes(ql)) return 50;
  return 0;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mac = navigator.platform.toUpperCase().includes('MAC');
      const meta = mac ? e.metaKey : e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        setSel(0);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return SEARCH_INDEX;
    return SEARCH_INDEX
      .map((it) => ({ ...it, s: score(it, q.trim()) }))
      .filter((it) => it.s > 0)
      .sort((a, b) => b.s - a.s);
  }, [q]);

  const go = (k: string) => {
    setOpen(false);
    setQ('');
    router.push(k === '' ? '/' : `/${k}`);
  };

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[sel]) go(results[sel].k);
    }
  };

  if (!open) return null;

  return (
    <div className="cmdk-scrim" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Icon name="search" size={14} style={{ color: 'var(--ink-3)' }} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search pages, names, topics…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onInputKey}
          />
          <span className="cmdk-esc">ESC</span>
        </div>
        <div className="cmdk-list">
          {results.length === 0 && (
            <div className="cmdk-empty">
              <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>NO MATCH</div>
              <p className="serif mt-2" style={{ color: 'var(--ink-2)' }}>The page you&apos;re looking for might not exist yet.</p>
            </div>
          )}
          {results.map((it, i) => (
            <button
              key={it.k}
              className={'cmdk-item ' + (i === sel ? 'is-selected' : '')}
              onMouseEnter={() => setSel(i)}
              onClick={() => go(it.k)}
            >
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="cmdk-item-name">{it.l}</div>
                <div className="cmdk-item-meta">/{it.k} · {it.section}</div>
              </div>
              <span className="cmdk-arr">↵</span>
            </button>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> Move</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>esc</kbd> Close</span>
          <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>
            {results.length} of {SEARCH_INDEX.length}
          </span>
        </div>
      </div>
    </div>
  );
}
