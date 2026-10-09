import type { Metadata } from 'next';
import Script from 'next/script';
import { Barlow, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from './_components/shared';
import { DraftingFrame } from './_components/lib';
import { CommandPalette } from './_components/cmdk';
import { ContentProvider } from '@/lib/content-provider';
import { getContent } from '@/lib/content';
import './globals.css';

const barlow = Barlow({ variable: '--font-barlow', subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-jetbrains-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wesan',
  description: 'Wesan builds Meltir, an AI workspace, and Levios AI, a social content assistant for small businesses, alongside commerce software, daily tracking and mobile games.',
  icons: {
    // Dark mark by default (light browser chrome); white mark when the OS/browser is in dark mode.
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-light.ico', sizes: '32x32', media: '(prefers-color-scheme: dark)' },
    ],
    apple: { url: '/logo.png' },
  },
};

const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  return (
    <html lang="en" className={`${barlow.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Applies a saved theme before hydration so the page never flashes the other mode. */}
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT}</Script>
        <a href="#main" className="skip-link">Skip to content</a>
        <ContentProvider value={content}>
          <DraftingFrame />
          <CommandPalette />
          <Nav />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
