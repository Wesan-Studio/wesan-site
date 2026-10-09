import type { CSSProperties, ReactNode } from 'react';

type IconName = keyof typeof ICONS | keyof typeof BRANDS;

interface IconProps {
  name: IconName;
  size?: number;
  sw?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 16, sw = 1.5, style }: IconProps) {
  if (name in BRANDS) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0, ...style }}>
        {BRANDS[name as keyof typeof BRANDS]}
      </svg>
    );
  }
  const p = ICONS[name as keyof typeof ICONS];
  if (!p) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
    >
      {p}
    </svg>
  );
}

const ICONS = {
  arr_r: (<><path d="M3 8h10M9 4l4 4-4 4" /></>) as ReactNode,
  arr_l: (<><path d="M13 8H3M7 4 3 8l4 4" /></>) as ReactNode,
  arr_up: (<><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" /></>) as ReactNode,
  arr_dr: (<><path d="M5 11L11 5M5 5h6v6" /></>) as ReactNode,
  chev_r: (<><path d="M6 3l4 5-4 5" /></>) as ReactNode,
  chev_d: (<><path d="M3 6l5 4 5-4" /></>) as ReactNode,
  chev_u: (<><path d="M3 10l5-4 5 4" /></>) as ReactNode,
  plus: (<><path d="M8 3v10M3 8h10" /></>) as ReactNode,
  close: (<><path d="M4 4l8 8M12 4l-8 8" /></>) as ReactNode,
  check: (<><path d="M3 8.5l3 3 7-7" /></>) as ReactNode,
  search: (<><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5l3 3" /></>) as ReactNode,
  ext: (<><path d="M6 3H3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V10" /><path d="M9 2.5h4v4M13 2.5L7 8.5" /></>) as ReactNode,
} as const;

/* Brand marks are filled logos (Simple Icons, CC0); mail is drawn to sit with them. */
const BRANDS = {
  github: (<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />) as ReactNode,
  twitter: (<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />) as ReactNode,
  linkedin: (<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />) as ReactNode,
  mail: (<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.4l8 5.2 8-5.2V6H4zm16 2.8-7.46 4.85a1 1 0 0 1-1.08 0L4 8.8V18h16V8.8z" />) as ReactNode,
} as const;
