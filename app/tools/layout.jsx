export const metadata = {
  title: "Free Poker Tools | Variance Calculator & More",
  description: "Free poker tools: Variance Calculator, Bad Beat Jackpot Dashboard, Win Rate Analyzer, Seat Selection EV, and Profits Tracker. Data-driven tools for serious poker players.",
  openGraph: {
    title: "Free Poker Tools | Variance Calculator & More",
    description: "Free tools for serious poker players: variance simulator, BBJ dashboard, win rate analyzer, and more.",
    url: "https://freenachos.poker/tools",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://freenachos.poker/tools",
  },
};

export default function ToolsLayout({ children }) {
  return children;
}
