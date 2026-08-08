'use client';

import { ArrowRight, Users } from 'lucide-react';
import { track } from '@vercel/analytics';
import { PROOF, FIT } from '@/lib/offer';

/**
 * Cinematic hero — layout, coach image, and badge structure kept from the
 * original homepage; copy replaced per the funnel rebuild (P1.3).
 * Copy is locked by the build plan; numeric claims mirror PROOF in lib/offer.js.
 */
const Hero = ({ sectionRef }) => (
  <section
    ref={sectionRef}
    className="hero-section-fade"
    style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: 'transparent',
      zIndex: 10
    }}
  >
    {/* === HALO LIGHTING: Key Light Behind Coach (z-5) === */}
    <div style={{
      position: 'absolute',
      bottom: '-15%',
      right: '-5%',
      width: '800px',
      height: '800px',
      background: 'radial-gradient(circle, rgba(167, 138, 67, 0.3) 0%, rgba(167, 138, 67, 0.12) 40%, transparent 70%)',
      filter: 'blur(120px)',
      zIndex: 5,
      pointerEvents: 'none'
    }} />

    {/* === COACH IMAGE: Anchored Bottom-Right (z-20) === */}
    <div
      className="hero-image-mask"
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '88vh',
        maxHeight: '920px',
        zIndex: 20,
        animation: 'imageReveal 1.2s ease-out 0.5s both',
        pointerEvents: 'none'
      }}
    >
      <img
        src="/proof/coach-hero.png"
        alt="Patrick 'Freenachos' Gerritsen - Data-Driven Poker Coach"
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom right'
        }}
      />
    </div>

    {/* === CINEMATIC VIGNETTE: Readability Overlay (z-15) === */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        background: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 35%, rgba(10, 10, 10, 0.3) 55%, transparent 75%)',
        pointerEvents: 'none'
      }}
    />

    {/* === CONTENT WRAPPER: Constrained Width (z-30) === */}
    <div
      style={{
        position: 'relative',
        zIndex: 30,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Max-Width Container - Prevents Ultra-Wide Stretch */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px',
          paddingTop: '140px',
          paddingBottom: '80px'
        }}
      >
        <div
          style={{
            maxWidth: '620px',
            animation: 'heroFadeIn 1s ease-out 0.2s both'
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(167, 138, 67, 0.1)',
              border: '1px solid rgba(167, 138, 67, 0.3)',
              borderRadius: '50px',
              padding: '10px 20px',
              marginBottom: '32px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Users size={16} color="#A78A43" />
            <span style={{
              fontSize: '13px',
              color: '#A78A43',
              fontWeight: '600',
              letterSpacing: '0.03em'
            }}>
              {PROOF.students}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(38px, 4.6vw, 56px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '28px',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            I don&apos;t guess what the pool does.<br />
            <span style={{
              color: '#A78A43',
              textShadow: '0 0 80px rgba(167, 138, 67, 0.4)'
            }}>I&apos;ve counted it.</span>
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: '17px',
            color: '#B0B0B8',
            maxWidth: '540px',
            lineHeight: 1.8,
            marginBottom: '20px',
            fontWeight: '400'
          }}>
            Over 200 million hands of pool data. 6.2bb/100 lifetime at 1KNL+ over 700k+ hands of my own. A 6-month program that audits your database against winning-population benchmarks, fixes the leaks in priority order, and re-audits at the end to verify your stats actually moved.
          </p>

          {/* Trust line */}
          <div style={{
            fontSize: '13px',
            color: 'rgba(240, 240, 240, 0.55)',
            letterSpacing: '0.01em',
            marginBottom: '8px'
          }}>
            {PROOF.rioStatus} · Students include Davide, 100NL to 1KNL in under a year
          </div>

          {/* Qualifier line */}
          <div style={{
            fontSize: '13px',
            color: 'rgba(240, 240, 240, 0.45)',
            letterSpacing: '0.01em',
            marginBottom: '36px'
          }}>
            For bankrolled online cash regs, {FIT.stakesRange}. By application.
          </div>

          {/* Primary CTA */}
          <a
            href="/apply"
            onClick={() => track('cta_click', { placement: 'hero' })}
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
              boxShadow: '0 4px 30px rgba(167, 138, 67, 0.4)',
              letterSpacing: '0.01em'
            }}
          >
            Apply for the Program <ArrowRight size={20} />
          </a>

          {/* Secondary ghost CTA */}
          <div style={{ marginTop: '18px' }}>
            <a
              href="/winrate"
              onClick={() => track('cta_click', { placement: 'hero_secondary' })}
              style={{
                color: 'rgba(240, 240, 240, 0.6)',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(167, 138, 67, 0.35)',
                paddingBottom: '2px',
                transition: 'color 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#A78A43'; e.currentTarget.style.borderColor = '#A78A43'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(240, 240, 240, 0.6)'; e.currentTarget.style.borderColor = 'rgba(167, 138, 67, 0.35)'; }}
            >
              Not ready? Run your sample through the free Win Rate Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Responsive Styles for Hero */}
    <style>{`
      @media (max-width: 1400px) {
        .hero-image-mask {
          right: -5% !important;
        }
      }
      @media (max-width: 1200px) {
        .hero-image-mask {
          right: -10% !important;
          height: 75vh !important;
          max-height: 800px !important;
        }
      }
      @media (max-width: 968px) {
        .hero-image-mask {
          display: none !important;
        }
      }
    `}</style>

    {/* === FLOOR FOG: Soft Bottom Transition (z-25) === */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '25vh',
        background: 'linear-gradient(to top, #0A0E1A 0%, rgba(10, 14, 26, 0.6) 50%, transparent 100%)',
        zIndex: 25,
        pointerEvents: 'none'
      }}
    />
  </section>
);

export default Hero;
