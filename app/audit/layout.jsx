import { AUDIT } from '@/lib/offer';

export const metadata = {
  title: `Database Audit: ${AUDIT.priceFormatted}, credited toward the program`,
  description:
    'A fixed-scope, fixed-price audit of your poker database against GTO baselines and winning-population benchmarks from 200M+ hands. Full written scorecard plus a 60-minute walkthrough call.',
  alternates: {
    canonical: 'https://freenachos.poker/audit',
  },
  openGraph: {
    title: `Database Audit: ${AUDIT.priceFormatted}, credited toward the program`,
    description:
      'Your database vs GTO and winning-population benchmarks: a written scorecard, a costed leak ledger, and a 60-minute walkthrough call.',
    url: 'https://freenachos.poker/audit',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function AuditLayout({ children }) {
  return children;
}
