// TODO(patrick): have this reviewed. Template text, not legal advice.

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Freenachos Poker coaching, tools, and newsletter.',
  alternates: { canonical: 'https://freenachos.poker/terms' },
};

const sectionStyle = { marginBottom: '36px' };
const h2Style = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#F0F0F0',
  marginBottom: '14px',
};
const pStyle = {
  fontSize: '15px',
  color: 'rgba(240, 240, 240, 0.65)',
  lineHeight: 1.8,
  marginBottom: '12px',
};

export default function TermsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      color: '#F0F0F0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <NachosPokerNavBar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 96px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Terms of <span style={{ color: '#a88b46' }}>Service</span>
        </h1>
        <p style={{ ...pStyle, marginBottom: '40px', color: 'rgba(240, 240, 240, 0.45)' }}>
          Last updated: July 2026
        </p>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Services</h2>
          <p style={pStyle}>
            Freenachos Poker provides poker coaching programs, free analytical tools, articles,
            and a newsletter. Coaching engagements are governed by the specific program terms
            agreed at purchase (session counts, duration, and scheduling rules).
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Coaching programs</h2>
          <p style={pStyle}>
            One-on-one sessions must be scheduled within the duration of the purchased package.
            Unused sessions are not reimbursed and do not carry over on renewal unless agreed
            otherwise. The 6-month program includes a one-time pause option of up to two months.
          </p>
          {/* TODO(patrick): confirm full refund/cancellation policy */}
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>No guarantee of results</h2>
          <p style={pStyle}>
            Poker involves variance and skill development depends on individual effort. Testimonials
            and win rates shown on this site reflect specific students&apos; documented results and are
            not a promise of similar outcomes.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Intellectual property</h2>
          <p style={pStyle}>
            All course materials, videos, tools, and written content are the intellectual property
            of Freenachos Poker and may not be redistributed or resold without permission.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            {/* TODO(patrick): create patrick@freenachos.poker forwarding to your inbox before deploy */}
            Questions about these terms: patrick@freenachos.poker
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
