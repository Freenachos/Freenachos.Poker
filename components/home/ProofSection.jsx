'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { track } from '@vercel/analytics';
import { PROOF } from '@/lib/offer';
import CountUp from '@/components/motion/CountUp';

// P0.3: '$5.5M+' is the approved shorthand of PROOF.studentProfits for tight
// layouts (headline, stat tiles). The exact figure + attribution render below.
const PROFITS_SHORT = '$5.5M+';

/**
 * Coach / authority section — layout kept from the original homepage.
 * Proof numbers route through PROOF (lib/offer.js); graph caption cites the
 * tracked sample instead of the vague "Verified results" line.
 */
const ProofSection = ({ sectionRef }) => {
  const [showGraphModal, setShowGraphModal] = useState(false);

  return (
    <div
      ref={sectionRef}
      className="coach-authority-section"
      style={{
        paddingTop: '160px',
        paddingBottom: '160px',
        marginBottom: '0',
        position: 'relative'
      }}
    >
      {/* Centered Headline */}
      <h2
        data-reveal
        style={{
          textWrap: 'balance',
          fontSize: 'clamp(36px, 4.5vw, 56px)',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '88px',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          fontFamily: 'Manrope, Inter, sans-serif',
          textAlign: 'center'
        }}
      >
        The Coach Behind <span style={{
          color: '#a88b46',
          textShadow: '0 0 60px rgba(168, 139, 70, 0.4)',
          position: 'relative',
          display: 'inline-block'
        }}>
          {/* Subtle radial glow anchor */}
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180%',
            height: '300%',
            background: 'radial-gradient(ellipse at center, rgba(168, 139, 70, 0.15) 0%, rgba(168, 139, 70, 0.05) 40%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: -1
          }} />
          <CountUp value={PROFITS_SHORT} duration={1800} />
        </span> in Student Profits
      </h2>

      {/* Two-Column Authority Split */}
      <div
        className="authority-split-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '96px',
          alignItems: 'center',
          maxWidth: '1160px',
          margin: '0 auto'
        }}
      >
        {/* LEFT COLUMN - Copy */}
        <div data-reveal style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: '24px'
        }}>
          <div style={{
            color: 'rgba(240, 240, 240, 0.72)',
            fontSize: '16.5px',
            lineHeight: 1.8,
            fontWeight: '400',
            maxWidth: '500px'
          }}>
            <p style={{ marginBottom: '28px', fontSize: '20px', lineHeight: 1.55, color: 'rgba(240, 240, 240, 0.94)', fontWeight: '500' }}>
              I didn&apos;t start out winning. I went through long breakeven stretches and downswings, even while studying and putting in serious volume. The problem wasn&apos;t a lack of effort. It was that I lacked a system that worked against real opponents.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Everything changed when I stopped memorizing solver outputs and started using <span style={{ color: '#a88b46', fontWeight: '500' }}>GTO as a diagnostic tool</span>. By comparing equilibrium to actual population behavior, I learned how to identify recurring imbalances and build strategies that exploit them in a repeatable way.
            </p>
            <p>
              I teach you to translate data into profit. The goal is not theoretical perfection. It is a <span style={{ color: '#a88b46', fontWeight: '500' }}>consistent, repeatable system</span> that wins over large samples.
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="/apply"
            onClick={() => track('cta_click', { placement: 'about' })}
            className="authority-cta-btn cta-arrow"
            style={{
              marginTop: '48px',
              background: 'transparent',
              color: '#a88b46',
              padding: '16px 32px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1.5px solid #a88b46',
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
              width: 'fit-content'
            }}
          >
            Apply for the Program <ArrowRight size={16} />
          </a>
        </div>

        {/* RIGHT COLUMN - Visual Proof */}
        <div data-reveal style={{
          '--i': 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Graph Display */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '480px'
          }}>
            {/* Subtle Ambient Glow */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '110%',
              height: '110%',
              background: 'radial-gradient(ellipse at center, rgba(168, 139, 70, 0.12) 0%, transparent 60%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Graph Frame - Clickable */}
            <div
              onClick={() => setShowGraphModal(true)}
              className="graph-frame-clickable"
              style={{
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(168, 139, 70, 0.2)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}>
              <img
                src="/proof/results-graph.png"
                alt={`Freenachos results graph - ${PROOF.winrate}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              {/* Hover overlay */}
              <div className="graph-hover-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(168, 139, 70, 0.08)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{
                  color: '#a88b46',
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>Click to expand</span>
              </div>
            </div>

            {/* Caption */}
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(240, 240, 240, 0.6)',
              fontStyle: 'italic',
              marginTop: '16px',
              letterSpacing: '0.02em'
            }}>
              Tracked: {PROOF.winrate}
            </div>
          </div>

          {/* Separator Line */}
          <div style={{
            width: '100%',
            maxWidth: '480px',
            height: '1px',
            background: 'rgba(168, 139, 70, 0.15)',
            margin: '36px 0 32px'
          }} />

          {/* Stats Row - 4 in a single row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '480px',
            gap: '16px'
          }}>
            {[
              { value: PROFITS_SHORT, label: 'Student Profits' },
              { value: '200+', label: 'Students' },
              { value: '6.2bb', label: 'Win Rate' },
              { value: '10M+', label: 'Hands Played' }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'left',
                  flex: 1
                }}
              >
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1
                }}>
                  <CountUp value={stat.value} delay={idx * 120} />
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#a88b46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  lineHeight: 1.3
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Exact-figure attribution (P0.3: proof sections carry the exact number) */}
          <div style={{
            width: '100%',
            maxWidth: '480px',
            marginTop: '24px',
            fontSize: '12.5px',
            color: 'rgba(240, 240, 240, 0.55)',
            lineHeight: 1.6
          }}>
            {PROOF.studentProfits}: {PROOF.studentProfitsAttribution}. {PROOF.handsPlayed} of my own; benchmarks drawn from {PROOF.poolHands}.
          </div>
        </div>
      </div>

      {/* Graph Modal */}
      {showGraphModal && (
        <div
          onClick={() => setShowGraphModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            animation: 'modalFadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              background: 'rgba(18, 18, 18, 0.6)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(168, 139, 70, 0.25)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.6), 0 0 80px rgba(168, 139, 70, 0.1)',
              animation: 'modalScaleIn 0.3s ease'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGraphModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                background: 'rgba(168, 139, 70, 0.1)',
                border: '1px solid rgba(168, 139, 70, 0.3)',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              className="modal-close-btn"
            >
              <X size={20} color="#a88b46" />
            </button>

            {/* Graph Image */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <img
                src="/proof/results-graph.png"
                alt={`Freenachos results graph - ${PROOF.winrate}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>

            {/* Modal Caption */}
            <div style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(240, 240, 240, 0.5)',
              marginTop: '16px',
              fontStyle: 'italic'
            }}>
              Tracked: {PROOF.winrate}
            </div>
          </div>
        </div>
      )}

      {/* Authority Split Responsive Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .authority-cta-btn:hover {
          background: rgba(168, 139, 70, 0.08) !important;
          border-color: #a88b46 !important;
          box-shadow: 0 8px 24px rgba(168, 139, 70, 0.15);
        }

        .graph-frame-clickable:hover {
          border-color: rgba(168, 139, 70, 0.4) !important;
          box-shadow: 0 28px 72px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 139, 70, 0.1) !important;
        }

        .graph-frame-clickable:hover .graph-hover-overlay {
          opacity: 1 !important;
        }

        .modal-close-btn:hover {
          background: rgba(168, 139, 70, 0.2) !important;
          border-color: rgba(168, 139, 70, 0.5) !important;
          transform: scale(1.05);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalScaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 960px) {
          .authority-split-grid {
            grid-template-columns: 1fr !important;
            gap: 64px !important;
          }
          .authority-split-grid > div:first-child {
            padding-right: 0 !important;
            text-align: center;
          }
          .authority-split-grid > div:first-child a {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 768px) {
          .coach-authority-section {
            padding-top: 110px !important;
            padding-bottom: 110px !important;
          }
        }

        @media (max-width: 520px) {
          .authority-split-grid > div:last-child > div:nth-child(3) {
            flex-wrap: wrap !important;
            gap: 24px !important;
          }
          .authority-split-grid > div:last-child > div:nth-child(3) > div {
            flex: 0 0 calc(50% - 12px) !important;
          }
        }
      ` }} />
    </div>
  );
};

export default ProofSection;
