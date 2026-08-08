export const metadata = {
  title: "Which Path? Course, Program, or CFP",
  description:
    "Three ways to work with Patrick 'Freenachos' Gerritsen: the Dominate with Data course for self-study, the 6-Month Program for bankrolled 200NL–1KNL regs, or the Nachos CFP for backing.",
  openGraph: {
    title: "Which Path? Course, Program, or CFP",
    description:
      "Self-study, private mentorship, or backing — the honest comparison of the three ways to work with Freenachos.",
    url: "https://freenachos.poker/coaching",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://freenachos.poker/coaching",
  },
};

export default function CoachingLayout({ children }) {
  return children;
}
