/* Content loader - static en.json fallback; Helm CMS overrides when published. */

import { cache } from 'react';
import en from '../content/en.json';
import { fetchHelmContent } from './helm';
import { deepMerge } from './merge';

export type Lang = 'en';

export type Tone = 'architecture' | 'workstation' | 'stage' | 'industrial' | 'dawn' | 'geology' | 'systems';

export interface Tag {
  label: string;
  variant?: 'default' | 'accent' | 'dashed' | 'solid';
}

export interface CTA {
  href: string;
  label: string;
  variant?: 'default' | 'solid' | 'ghost';
}

export interface NavLink {
  href: string;
  label: string;
  /** Sub-links shown under a top-level nav item. */
  children?: NavLink[];
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface PhotoBlock {
  tone: Tone;
  ratio: string;
  caption?: string;
  label?: string;
  overlay?: string;
}

export interface SectionHeadCopy {
  num?: string;
  label?: string;
  title?: string | null;
  sub?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export interface TelemetryItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface BentoCard {
  href: string;
  size: 'b-1' | 'b-2' | 'b-3' | 'b-4';
  tone: Tone;
  arr: string;
  label: string;
  title: string;
  titleSize?: number;
  desc: string;
  tags?: string[];
  /** Real product app-icon paths. When present, the card renders a dark
   *  product-showcase tile (real icons + blurred backdrop) instead of a stock photo tone. */
  icons?: string[];
}

export type MissionBlock =
  | { kind: 'p'; lead?: boolean; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'figure'; src: string; alt: string; caption: string; credit: string }
  | { kind: 'hr' }
  | { kind: 'quote'; text: string }
  | { kind: 'sign'; text: string };

export type NewsBodyBlock =
  | { kind: 'p'; content: string }
  | { kind: 'h'; content: string }
  | { kind: 'quote'; content: string }
  | { kind: 'list'; content: string[] };

export interface Role {
  slug: string;
  div: 'SFT' | 'STU';
  team: string;
  product: string;
  name: string;
  desc: string;
  where: string;
  type: string;
  lede: string;
  responsibilities: string[];
  firstSixMonths: string[];
  requirements: string[];
  niceToHave: string[];
  comp: string;
  reportingTo: string;
  teamMeta: string;
}

export type Division = 'WESAN' | 'SOFTWARE' | 'STUDIO' | 'INDUSTRIES';

export interface NewsItem {
  slug: string;
  date: string;
  who: Division;
  what: string;
  lede: string;
  featured?: boolean;
  body: NewsBodyBlock[];
  links?: { label: string; href: string }[];
  contact?: string;
}

/** Long-form product detail page (mission-style prose). Reuses MissionBlock for the body. */
export interface ProductPage {
  slug: string;
  name: string;
  status: string;
  meta: string;
  url: string;
  tags: Tag[];
  title: string;
  body: MissionBlock[];
  continue: { label: string; links: NavLink[] };
}

export interface ContentBundle {
  _meta: { lang: Lang; version: string; updated: string };
  common: {
    brand: string;
    tagline: string;
    founded: string;
    location: string;
    year: string;
    footerCopyright: string;
    footerEst: string;
    footerStatus: string;
  };
  nav: {
    links: NavLink[];
    search: string;
    searchPlaceholder: string;
    contact: string;
  };
  footer: {
    blurb: string;
    columns: FooterColumn[];
  };
  pages: {
    home: HomeContent;
    mission: MissionContent;
    now: NowContent;
    careers: CareersIndexContent;
    contact: ContactContent;
    newsroomIndex: NewsroomIndexContent;
    newsroomDetail: NewsroomDetailLabels;
  } & Record<string, unknown>;
  collections: {
    careers: Role[];
    newsroom: NewsItem[];
    products: ProductPage[];
  };
}

// --- Page-specific content shapes ---

export interface HomeContent {
  hero: {
    tags: Tag[];
    fig: string;
    title: string;
    lead: string;
    ctas: CTA[];
  };
  heroPhoto: PhotoBlock;
  telemetry: TelemetryItem[];
  marquee: { label: string; items: string[] };
  manifesto: { num: string; label: string; body: string };
  divisionsHead: SectionHeadCopy;
  bento: BentoCard[];
  newsroomHead: SectionHeadCopy;
  newsroomSlugs: string[];
  founderLetter: {
    label: string;
    quote: string;
    ctaHref: string;
    ctaLabel: string;
  };
}

export interface MissionContent {
  tags: Tag[];
  title: string;
  body: MissionBlock[];
  continue: {
    label: string;
    links: NavLink[];
  };
}

export interface NowContent {
  head: SectionHeadCopy;
  tags: Tag[];
  lead: string;
  thisMonth: {
    heading: string;
    items: { n: string; text: string }[];
  };
  divisions: {
    heading: string;
    cards: { label: string; body: string }[];
  };
  onMyMind: {
    heading: string;
    body: string;
  };
  sign: string;
  convention: string;
}

export interface CareersIndexContent {
  head: SectionHeadCopy;
  industriesNote: string;
  whatYouGet: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  detail: {
    telemetryLabels: [string, string, string, string];
    responsibilitiesHead: SectionHeadCopy;
    firstSixHead: SectionHeadCopy;
    requirementsLabel: string;
    niceLabel: string;
    compHead: SectionHeadCopy;
    applyHead: SectionHeadCopy;
    applyBody: string;
    applyChecklist: string[];
    applyFooter: string;
    otherHead: SectionHeadCopy;
  };
}

export interface ContactContent {
  head: SectionHeadCopy;
  channels: { label: string; addr: string; hint: string }[];
  officesHead: SectionHeadCopy;
  offices: {
    label: string;
    lines: string[];
    telemetry: [string, string][];
  }[];
  stamp: string;
}

export interface NewsroomIndexContent {
  head: SectionHeadCopy;
  filters: string[];
  yearLabel: string;
  featuredLabel: string;
  releaseLabel: string;
  readCta: string;
  pressLabel: string;
  endLabel: string;
}

export interface NewsroomDetailLabels {
  backLabel: string;
  releaseLabel: string;
  featuredLabel: string;
  relatedLabel: string;
  pressLabel: string;
  olderLabel: string;
  newerLabel: string;
  backToList: string;
}

// --- Loader ---

const staticBundle = en as unknown as ContentBundle;

/** Build-time / SSG slug lists - always from committed JSON. */
export const staticContent = staticBundle;

export const getContent = cache(async (lang: Lang = 'en'): Promise<ContentBundle> => {
  const remote = await fetchHelmContent(lang);
  if (!remote) return staticBundle;
  return deepMerge(staticBundle, remote);
});

// --- Helpers ---

export async function getRole(slug: string, lang: Lang = 'en'): Promise<Role | undefined> {
  const content = await getContent(lang);
  return content.collections.careers.find((r) => r.slug === slug);
}

export async function getRoles(lang: Lang = 'en'): Promise<Role[]> {
  return (await getContent(lang)).collections.careers;
}

export async function getNewsItem(slug: string, lang: Lang = 'en'): Promise<NewsItem | undefined> {
  const content = await getContent(lang);
  return content.collections.newsroom.find((i) => i.slug === slug);
}

export async function getNewsItems(lang: Lang = 'en'): Promise<NewsItem[]> {
  return (await getContent(lang)).collections.newsroom;
}

export async function getNewsBySlugs(slugs: string[], lang: Lang = 'en'): Promise<NewsItem[]> {
  const all = await getNewsItems(lang);
  return slugs.map((s) => all.find((i) => i.slug === s)).filter((x): x is NewsItem => !!x);
}

export async function getProduct(slug: string, lang: Lang = 'en'): Promise<ProductPage | undefined> {
  const content = await getContent(lang);
  return content.collections.products?.find((p) => p.slug === slug);
}

export async function getProducts(lang: Lang = 'en'): Promise<ProductPage[]> {
  return (await getContent(lang)).collections.products ?? [];
}
