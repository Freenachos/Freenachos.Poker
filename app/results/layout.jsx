export const metadata = {
  title: 'Case Studies',
  description:
    'Documented student case studies: what the audit found, what was installed, and how the stats moved.',
  // Noindex until at least two case studies carry complete before/after data
  // (P4 ship gate). Flip robots + add to sitemap when Patrick signs off.
  robots: { index: false },
  alternates: {
    canonical: 'https://freenachos.poker/results',
  },
};

export default function ResultsLayout({ children }) {
  return children;
}
