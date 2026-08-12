'use client';

import { ArrowRight } from 'lucide-react';
import { track } from '@vercel/analytics';

/**
 * Final CTA (P1.8) — the closing push, takes the slot the old inline booking
 * section used to occupy. #book anchor kept so old /#book links land on the
 * closing CTA instead of a dead anchor.
 */
const FinalCTA = () => (
  <div
    id="book"
    className="reveal"
    style={{
      marginBottom: '140px',
      textAlign: 'center',
      scrollMarginTop: '90px'
    }}
  >
    <h2 style={{
      fontSize: 'clamp(38px, 5vw, 56px)',
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: '20px',
      lineHeight: 1.12,
      letterSpacing: '-0.025em',
      fontFamily: 'Manrope, Inter, sans-serif',
      maxWidth: '820px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      Your database already knows where your <span style={{
        color: '#A78A43',
        textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
      }}>win rate is leaking.</span>
    </h2>
    <p style={{
      color: 'rgba(240, 240, 240, 0.55)',
      fontSize: '17px',
      lineHeight: 1.8,
      maxWidth: '580px',
      margin: '0 auto 40px'
    }}>
      I&apos;ll show you, in priority order, measured against 200 million hands, not guesses. Then we fix them, and at the end we measure again.
    </p>

    <a
      href="/apply"
      onClick={() => track('cta_click', { placement: 'final' })}
      className="btn-hover cta-primary"
      style={{
        background: '#A78A43',
        color: '#0a0a0a',
        padding: '20px 44px',
        borderRadius: '14px',
        fontWeight: '700',
        fontSize: '16px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 6px 30px rgba(167, 138, 67, 0.45)',
        letterSpacing: '0.01em'
      }}
    >
      Apply for the Program <ArrowRight size={20} />
    </a>

    {/* Sub-links */}
    <div style={{
      marginTop: '24px',
      display: 'flex',
      justifyContent: 'center',
      gap: '28px',
      flexWrap: 'wrap',
      fontSize: '14px'
    }}>
      <a
        href="/winrate"
        onClick={() => track('cta_click', { placement: 'final_winrate' })}
        style={{
          color: 'rgba(240, 240, 240, 0.55)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(167, 138, 67, 0.3)',
          paddingBottom: '2px'
        }}
      >
        Run the free Win Rate Dashboard
      </a>
      {/* TODO(patrick): point this at the exact Greed Tax slug under /newsletters/[slug] */}
      <a
        href="/newsletters"
        onClick={() => track('cta_click', { placement: 'final_greed_tax' })}
        style={{
          color: 'rgba(240, 240, 240, 0.55)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(167, 138, 67, 0.3)',
          paddingBottom: '2px'
        }}
      >
        Read The Greed Tax
      </a>
    </div>
  </div>
);

export default FinalCTA;
