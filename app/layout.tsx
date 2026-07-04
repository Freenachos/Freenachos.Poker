import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://freenachos.poker'),
  title: {
    default: 'Freenachos Poker | Elite Private Coaching & Data-Driven Strategies',
    template: '%s | Freenachos Poker',
  },
  description: 'Master high-stakes poker with Patrick "Freenachos" Gerritsen. Private 1-on-1 coaching, data-driven exploits backed by 200M+ hands, and proven strategies that have generated $5.5M+ in student profits.',
  keywords: ['poker coaching', 'online poker', 'poker strategy', 'GTO poker', 'exploitative poker', 'high stakes poker', 'poker mentorship', 'NachosPoker', 'Freenachos', 'cash game poker'],
  authors: [{ name: 'Patrick Gerritsen', url: 'https://freenachos.poker' }],
  creator: 'Patrick Gerritsen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freenachos.poker',
    siteName: 'Freenachos Poker',
    title: 'Freenachos Poker | Elite Private Coaching & Data-Driven Strategies',
    description: 'Master high-stakes poker with Patrick "Freenachos" Gerritsen. Private coaching and data-driven exploits that have generated $5.5M+ in student profits.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Freenachos Poker - Elite Coaching' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freenachos Poker | Elite Private Coaching',
    description: 'Master high-stakes poker with data-driven strategies backed by 200M+ hands.',
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
