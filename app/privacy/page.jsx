// TODO(patrick): have this reviewed — template text, not legal advice

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Freenachos Poker collects, uses, and protects your data.',
  alternates: { canonical: 'https://freenachos.poker/privacy' },
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

export default function PrivacyPage() {
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
          Privacy <span style={{ color: '#a88b46' }}>Policy</span>
        </h1>
        <p style={{ ...pStyle, marginBottom: '40px', color: 'rgba(240, 240, 240, 0.45)' }}>
          Last updated: July 2026
        </p>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Who we are</h2>
          <p style={pStyle}>
            Freenachos Poker (freenachos.poker) is operated by Patrick Gerritsen and provides
            poker coaching services, free tools, and a strategy newsletter.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>What we collect</h2>
          <p style={pStyle}>
            <strong>Email address</strong> — when you subscribe to the newsletter. Used only to
            send you the newsletter and related strategy content.
          </p>
          <p style={pStyle}>
            <strong>Usage analytics</strong> — anonymous page-view and interaction data via
            Vercel Analytics, used to improve the site. No cross-site tracking cookies are set.
          </p>
          <p style={pStyle}>
            <strong>Booking details</strong> — if you book an intro call, scheduling data is
            processed by Calendly under their own privacy policy.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Who processes your data</h2>
          <p style={pStyle}>
            We use the following processors: Beehiiv (newsletter delivery), Supabase (subscriber
            storage), Vercel (hosting and analytics), and Calendly (call scheduling). Each
            processes data under its own terms and applicable data-processing agreements.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Your rights</h2>
          <p style={pStyle}>
            You can unsubscribe from the newsletter at any time via the link in every email.
            Under the GDPR you may request access to, correction of, or deletion of your personal
            data at any time by contacting us.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            {/* TODO(patrick): confirm preferred public contact email (currently personal gmail) */}
            For any privacy-related questions or requests, contact: patrickgerritsen90@gmail.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
