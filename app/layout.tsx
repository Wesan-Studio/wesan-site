import type { Metadata } from 'next';
import { Inter, Inter_Tight, Newsreader, JetBrains_Mono } from 'next/font/google';
import { Nav, Footer } from './_components/shared';
import { DraftingFrame } from './_components/lib';
import { CommandPalette } from './_components/cmdk';
import { ContentProvider } from '@/lib/content-provider';
import { getContent } from '@/lib/content';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const interTight = Inter_Tight({ variable: '--font-inter-tight', subsets: ['latin'] });
const newsreader = Newsreader({ variable: '--font-newsreader', subsets: ['latin'], style: ['normal', 'italic'] });
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();

  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ContentProvider style={{height: '100vh'}} value={content}>
          <DraftingFrame />
          <CommandPalette />
          <Nav />
          <main style={{ animation: 'fadeIn 0.4s ease forwards' }}>{children}</main>
          <Footer />
        </ContentProvider>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
      </body>
    </html>
  );
}
