import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://freenachos.poker'),
  title: {
    default: 'Freenachos Poker | Data-Driven Poker Coaching: 200M+ Hands of Pool Data',
    template: '%s | Freenachos Poker',
  },
  description: 'A 6-month, application-based program for 200NL–1KNL online cash regs: your database audited against winning-population benchmarks from 200M+ hands, leaks fixed in priority order, results re-measured. By Patrick "Freenachos" Gerritsen.',
  keywords: ['poker coaching', 'online poker', 'poker strategy', 'GTO poker', 'exploitative poker', 'high stakes poker', 'poker mentorship', 'NachosPoker', 'Freenachos', 'cash game poker'],
  authors: [{ name: 'Patrick Gerritsen', url: 'https://freenachos.poker' }],
  creator: 'Patrick Gerritsen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freenachos.poker',
    siteName: 'Freenachos Poker',
    title: 'Freenachos Poker | Data-Driven Poker Coaching: 200M+ Hands of Pool Data',
    description: 'A 6-month, application-based program for 200NL–1KNL online cash regs: your database audited against winning-population benchmarks from 200M+ hands, leaks fixed in priority order, results re-measured.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Freenachos Poker - Data-Driven Coaching' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freenachos Poker | Data-Driven Poker Coaching',
    description: 'Your database audited against winning-population benchmarks from 200M+ hands, leaks fixed in priority order, results re-measured.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://freenachos.poker',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
