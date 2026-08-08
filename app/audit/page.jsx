"use client";

import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, FileSearch, PenLine, ScrollText, Phone } from 'lucide-react';
import { track } from '@vercel/analytics';
import { AUDIT, OFFER, PROOF } from '@/lib/offer';

/**
 * /audit — the standalone Database Audit (P3). €750 fixed scope, credited in
 * full toward the program within 30 days. Purchase is invoiced manually after
 * the fit call — no online checkout in this phase.
 */
/* TODO(patrick): decide if/when to add Stripe for audit checkout */

const GOLD = '#A78A43';
const fmtK = (n) => `${n / 1000}k`;

const WHAT_YOU_GET = [
  {
    icon: FileSearch,
    text: 'A full Stat Checker run: every meaningful stat vs both baselines, GTO and the winning population at your stakes.'
  },
  {
    icon: PenLine,
    text: 'A manual review by me: my filters and notes, not just tool output.'
  },
  {
    icon: ScrollText,
    text: "A written scorecard: stat table, ranked leak list, top-3 priorities, and an honest section on what your sample can't tell us."
  },
  {
    icon: Phone,
    text: 'A 60-minute call walking through it.'
  }
];

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
        maxWidth: '860px',
        margin: '0 auto',
        padding: '60px 24px 120px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(167, 138, 67, 0.1)',
            border: '1px solid rgba(167, 138, 67, 0.3)',
            borderRadius: '50px',
            padding: '8px 18px',
            marginBottom: '28px'
          }}>
            <span style={{ fontSize: '13px', color: GOLD, fontWeight: '600', letterSpacing: '0.03em' }}>
              {AUDIT.name} · {AUDIT.priceFormatted} · credited toward the program
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
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            A fixed-scope, fixed-price audit of your database against GTO baselines and winning-population benchmarks from {PROOF.poolHands.replace(' of pool data', '')}. You get the full report whether or not we ever work together.
          </p>
        </div>

        {/* What you get */}
        <div className="glass-card" style={{
          borderRadius: '24px',
          padding: '44px 40px',
          marginBottom: '28px'
        }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: GOLD,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '28px'
          }}>
            What you get
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {WHAT_YOU_GET.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid rgba(168, 139, 70, 0.35)',
                    background: 'rgba(168, 139, 70, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={GOLD} strokeWidth={1.75} />
                  </div>
                  <span style={{
                    color: 'rgba(240, 240, 240, 0.78)',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    paddingTop: '6px'
                  }}>
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* The terms */}
        <div className="glass-card" style={{
          borderRadius: '24px',
          padding: '44px 40px',
          marginBottom: '28px'
        }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: '700',
            color: GOLD,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '20px'
          }}>
            The terms
          </h2>
          <p style={{
            color: 'rgba(240, 240, 240, 0.75)',
            fontSize: '15.5px',
            lineHeight: 1.9,
            margin: 0
          }}>
            {AUDIT.priceFormatted}. Minimum {fmtK(AUDIT.dbMinHands)}-hand database (HM3, PT4, or Hand2Note export; spec sheet after purchase). Written scorecard within {AUDIT.deliveryDays} days of receiving your database; call within 10. Credited in full toward {OFFER.name} if you enroll within {AUDIT.creditDays} days. Capped at 4 audits per month.
          </p>
        </div>

        {/* Guarantee */}
        <div style={{
          borderRadius: '24px',
          padding: '36px 40px',
          marginBottom: '56px',
          background: 'rgba(167, 138, 67, 0.06)',
          border: '1px solid rgba(167, 138, 67, 0.3)',
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

        {/* CTA */}
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
