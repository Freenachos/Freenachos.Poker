export const metadata = {
  title: "Poker Coaching | Private 1-on-1 & Coaching For Profits",
  description: "Two paths to crushing poker: Private 1-on-1 mentorship with Patrick 'Freenachos' Gerritsen or join the NachosPoker CFP backed by 200M+ hands of data. $5.5M+ in student profits generated.",
  openGraph: {
    title: "Poker Coaching | Private 1-on-1 & Coaching For Profits",
    description: "Two paths to crushing poker: Private mentorship or join the CFP backed by 200M+ hands of data.",
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
