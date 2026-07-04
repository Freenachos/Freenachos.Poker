'use client';

import Link from 'next/link';

/**
 * Site footer - shared across pages.
 * Dark/gold language matching the homepage design system.
 */
const Footer = () => (
  <footer style={{
    borderTop: '1px solid rgba(167, 138, 67, 0.15)',
    marginTop: '24px',
    padding: '64px 24px 32px',
    position: 'relative',
    zIndex: 10
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div
        className="footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '48px'
        }}
      >
        {/* Brand */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px'
          }}>
            <img src="/logo.png" alt="Freenachos Poker" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <span style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#FFFFFF' }}>Freenachos</span>
              <span style={{ color: '#a88b46' }}>.Poker</span>
            </span>
          </div>
          <p style={{
            fontSize: '13px',
            color: 'rgba(240, 240, 240, 0.5)',
            lineHeight: 1.7,
            maxWidth: '280px'
          }}>
            Data-driven poker coaching by Patrick &quot;Freenachos&quot; Gerritsen.
          </p>
        </div>

        {/* Site */}
        <div>
          <div className="footer-heading">Site</div>
          <Link href="/#pricing" className="footer-link">Mentorship</Link>
          <Link href="/coaching" className="footer-link">Coaching</Link>
          <Link href="/tools" className="footer-link">Tools</Link>
          <Link href="/newsletters" className="footer-link">Articles</Link>
          <Link href="/newsletter" className="footer-link">Newsletter</Link>
        </div>

        {/* Elsewhere */}
        <div>
          <div className="footer-heading">Elsewhere</div>
          <a href="https://www.youtube.com/@nachospoker" target="_blank" rel="noopener noreferrer" className="footer-link">YouTube</a>
          <a href="https://www.nachospoker.com" target="_blank" rel="noopener noreferrer" className="footer-link">NachosPoker CFP</a>
        </div>

        {/* Legal & Contact */}
        <div>
          <div className="footer-heading">Legal</div>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/terms" className="footer-link">Terms of Service</Link>
          {/* TODO(patrick): replace with real contact email */}
          <a href="mailto:TODO@freenachos.poker" className="footer-link">Contact</a>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(167, 138, 67, 0.1)',
        paddingTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'rgba(240, 240, 240, 0.4)'
      }}>
        © {new Date().getFullYear()} Freenachos Poker. All rights reserved.
      </div>
    </div>

    <style>{`
      .footer-heading {
        font-size: 12px;
        font-weight: 700;
        color: #a88b46;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 16px;
      }
      .footer-link {
        display: block;
        font-size: 14px;
        color: rgba(240, 240, 240, 0.6);
        text-decoration: none;
        margin-bottom: 12px;
        transition: color 0.2s ease;
      }
      .footer-link:hover {
        color: #a88b46;
      }
      @media (max-width: 860px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 36px !important;
        }
      }
      @media (max-width: 480px) {
        .footer-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
