"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Check } from 'lucide-react';
import { track } from '@vercel/analytics';
import { AUDIT, OFFER, PROOF } from '@/lib/offer';

/**
 * /audit — the standalone Database Audit (P3), restructured 2026-08-12:
 * deal + spec tiles up top, a four-step how-it-works flow beside the real
 * Stat Checker view, the credit mechanic promoted to its own band, then
 * guarantee and close. Purchase is invoiced manually after the fit call.
 */
/* TODO(patrick): decide if/when to add Stripe for audit checkout */

const GOLD = '#A78A43';
const fmtK = (n) => `${n / 1000}k`;

const SPECS = [
  { value: AUDIT.priceFormatted, label: 'fixed price, credited' },
  { value: `${fmtK(AUDIT.dbMinHands)}+`, label: 'hands minimum' },
  { value: `${AUDIT.deliveryDays} days`, label: 'to written scorecard' },
  { value: '4 / month', label: 'audit slots' }
];

const STEPS = [
  {
    n: 1,
    title: 'Send your database',
    text: `A ${fmtK(AUDIT.dbMinHands)}-hand minimum export from HM3, PT4, or Hand2Note. You get the spec sheet right after purchase.`
  },
  {
    n: 2,
    title: 'I run it, then I read it',
    text: 'The full Stat Checker pass against both baselines: GTO, and the winning population at your stakes. Then the manual layer: my filters and my notes, not just tool output.'
  },
  {
    n: 3,
    title: `Written scorecard within ${AUDIT.deliveryDays} days`,
    text: "Stat table, ranked leak list, top-3 priorities, and an honest section on what your sample can't tell us."
  },
  {
    n: 4,
    title: 'The walkthrough call',
    text: 'A 60-minute call within 10 days of receiving your database: which leaks, in which order, and what that means for your game.'
  }
];

const numberBadge = (n) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'rgba(167, 138, 67, 0.15)',
    border: '1px solid rgba(167, 138, 67, 0.4)',
    color: GOLD,
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0
  }}>
    {n}
  </span>
);

export default function AuditPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        .glass-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 138, 67, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .btn-hover {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
        }
        .btn-hover:hover:not(:disabled) { transform: translateY(-3px); }
        .btn-hover:active:not(:disabled) { transform: translateY(-1px); }
        @media (max-width: 900px) {
          .audit-flow-grid {
            grid-template-columns: 1fr !important;
          }
          .audit-flow-image {
            position: static !important;
            order: 2;
          }
          .audit-specs {
            gap: 20px !important;
          }
          .audit-specs > div {
            flex: 0 0 calc(50% - 10px) !important;
          }
        }
      ` }} />

      <NachosPokerNavBar />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '-8%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167, 138, 67, 0.07) 0%, transparent 60%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1060px',
        margin: '0 auto',
        padding: '60px 24px 120px'
      }}>
        {/* ============ HERO: the deal, then the proof of scope ============ */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(167, 138, 67, 0.14)',
            border: '1px solid rgba(167, 138, 67, 0.5)',
            borderRadius: '50px',
            padding: '10px 22px',
            marginBottom: '28px',
            boxShadow: '0 0 28px rgba(167, 138, 67, 0.18)'
          }}>
            <span style={{ fontSize: '13.5px', color: '#F0F0F0', fontWeight: '700', letterSpacing: '0.02em' }}>
              {AUDIT.name} <span style={{ color: GOLD }}>·</span> {AUDIT.priceFormatted} <span style={{ color: GOLD }}>·</span> credited toward the program
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(34px, 4.8vw, 52px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '22px',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            See exactly where your <span style={{ color: GOLD, textShadow: '0 0 60px rgba(167, 138, 67, 0.4)' }}>win rate is leaking.</span>
          </h1>
          <p style={{
            color: 'rgba(240, 240, 240, 0.65)',
            fontSize: '16.5px',
            lineHeight: 1.85,
            marginBottom: '36px'
          }}>
            A fixed-scope, fixed-price audit of your database against GTO baselines and winning-population benchmarks from {PROOF.poolHands.replace(' of pool data', '')}. You get the full report whether or not we ever work together.
          </p>
          <a
            href="/apply?intent=audit"
            onClick={() => track('cta_click', { placement: 'audit_page_top' })}
            className="btn-hover"
            style={{
              background: GOLD,
              color: '#0a0a0a',
              padding: '18px 40px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 30px rgba(167, 138, 67, 0.4)'
            }}
          >
            Request an Audit <ArrowRight size={18} />
          </a>
        </div>

        {/* Spec tiles: the terms, scannable instead of buried in prose */}
        <div
          className="audit-specs"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '56px',
            marginBottom: '96px',
            paddingBottom: '40px',
            borderBottom: '1px solid rgba(168, 139, 70, 0.15)'
          }}
        >
          {SPECS.map((spec, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '26px',
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px'
              }}>
                {spec.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: GOLD,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: '600'
              }}>
                {spec.label}
              </div>
            </div>
          ))}
        </div>

        {/* ============ HOW IT WORKS: steps beside the real tool ============ */}
        <div
          className="audit-flow-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: '64px',
            alignItems: 'start',
            marginBottom: '96px'
          }}
        >
          {/* Steps */}
          <div>
            <h2 style={{
              fontSize: '13px',
              fontWeight: '700',
              color: GOLD,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '32px'
            }}>
              How it works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {STEPS.map((step) => (
                <div key={step.n} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  {numberBadge(step.n)}
                  <div>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '700',
                      color: '#F0F0F0',
                      margin: '0 0 8px',
                      lineHeight: 1.4
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: 'rgba(240, 240, 240, 0.6)',
                      fontSize: '14.5px',
                      lineHeight: 1.8
                    }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The real tool the scorecard is built from */}
          <figure className="audit-flow-image" style={{ margin: 0, position: 'sticky', top: '110px' }}>
            <img
              src="/mechanism/diagnose.png"
              alt="The Stat Checker view the audit scorecard is built from"
              style={{
                width: '100%',
                display: 'block',
                borderRadius: '16px',
                border: '1px solid rgba(168, 139, 70, 0.2)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
              }}
            />
            <figcaption style={{
              marginTop: '14px',
              fontSize: '12.5px',
              color: 'rgba(240, 240, 240, 0.45)',
              fontStyle: 'italic',
              letterSpacing: '0.02em',
              lineHeight: 1.6
            }}>
              The Stat Checker view your scorecard is built from: your database vs GTO and vs the winning population.
            </figcaption>
          </figure>
        </div>

        {/* ============ THE CREDIT MECHANIC: the actual best part ============ */}
        <div style={{
          borderRadius: '24px',
          padding: '40px 44px',
          marginBottom: '28px',
          background: 'rgba(167, 138, 67, 0.08)',
          border: '1px solid rgba(167, 138, 67, 0.35)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: GOLD,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '14px'
          }}>
            The audit is the program&apos;s first step
          </h2>
          <p style={{
            color: 'rgba(240, 240, 240, 0.8)',
            fontSize: '16px',
            lineHeight: 1.85,
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            {OFFER.name} opens on this exact audit. Enroll within {AUDIT.creditDays} days and the {AUDIT.priceFormatted} comes off the program price in full. Walk away instead, and you still keep the complete scorecard.
          </p>
        </div>

        {/* ============ GUARANTEE ============ */}
        <div style={{
          borderRadius: '24px',
          padding: '32px 44px',
          marginBottom: '72px',
          background: 'rgba(18, 18, 18, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <Check size={20} color={GOLD} style={{ flexShrink: 0, marginTop: '4px' }} strokeWidth={2.5} />
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: GOLD,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px'
            }}>
              Guarantee
            </div>
            <p style={{
              color: 'rgba(240, 240, 240, 0.78)',
              fontSize: '15.5px',
              lineHeight: 1.85,
              margin: 0
            }}>
              If the audit doesn&apos;t surface clear, fixable leaks, it&apos;s refunded in full.
            </p>
          </div>
        </div>

        {/* ============ CLOSE ============ */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/apply?intent=audit"
            onClick={() => track('cta_click', { placement: 'audit_page' })}
            className="btn-hover"
            style={{
              background: GOLD,
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
            Request an Audit <ArrowRight size={20} />
          </a>
          <p style={{
            marginTop: '28px',
            color: 'rgba(240, 240, 240, 0.5)',
            fontSize: '14px',
            lineHeight: 1.8,
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Not sure whether to start with the audit or apply straight to the program? Apply. The fit call settles it in fifteen minutes.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
