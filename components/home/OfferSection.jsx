'use client';

import { ArrowRight, Check } from 'lucide-react';
import { track } from '@vercel/analytics';
import { OFFER, AUDIT, EXTENSION } from '@/lib/offer';
import RoadmapTable from './RoadmapTable';

const euro = (n) => `€${n.toLocaleString('en-US')}`;

// Split the program name so the last word carries the gold accent.
const NAME_WORDS = OFFER.name.split(' ');
const NAME_LEAD = NAME_WORDS.slice(0, -1).join(' ');
const NAME_LAST = NAME_WORDS[NAME_WORDS.length - 1];

/**
 * The single-offer section (P1.6) — replaces the old 3-tier pricing grid.
 * Primary anchor is #program; #pricing is kept as an alias because external
 * links and the old navbar pointed at /#pricing.
 */
const DELIVERABLES = [
  'A full database audit with a prioritized leak list',
  `${OFFER.calls} 1-on-1 sessions, biweekly: one call, one branch of the game tree`,
  'A tailored PDF after every call: summary, action points, study suggestions',
  'Monthly stat recalibration against your fresh sample',
  'Weekly group coaching during the program + 90 days after, plus the alumni Discord',
  'A final re-audit with documented before/after stat movement'
];

const OfferSection = () => (
  <div
    id="program"
    style={{
      paddingTop: '60px',
      paddingBottom: '100px',
      marginBottom: '160px',
      scrollMarginTop: '90px',
      position: 'relative'
    }}
  >
    {/* Alias anchor: old external links point at /#pricing */}
    <span id="pricing" style={{
      position: 'absolute',
      top: '-90px',
      left: 0,
      width: '1px',
      height: '1px'
    }} aria-hidden="true" />

    {/* Centered Header */}
    <div data-reveal style={{ textAlign: 'center', marginBottom: '72px' }}>
      <h2 style={{
        fontSize: 'clamp(38px, 5vw, 56px)',
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: '20px',
        lineHeight: 1.08,
        letterSpacing: '-0.025em',
        fontFamily: 'Manrope, Inter, sans-serif'
      }}>
        {NAME_LEAD} <span style={{
          color: '#a88b46',
          textShadow: '0 0 60px rgba(168, 139, 70, 0.4)'
        }}>{NAME_LAST}</span>
      </h2>
      <p style={{
        color: 'rgba(240, 240, 240, 0.68)',
        fontSize: '18px',
        lineHeight: 1.7,
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        One program. One price. No tiers.
      </p>
    </div>

    {/* Deliverables */}
    <div
      className="offer-deliverables"
      style={{
        maxWidth: '860px',
        margin: '0 auto 112px'
      }}
    >
      <div
        className="offer-deliverables-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 64px'
        }}
      >
        {DELIVERABLES.map((item, idx) => (
          <div key={idx} data-reveal style={{
            '--i': Math.floor(idx / 2),
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '22px 0',
            borderTop: '1px solid rgba(167, 138, 67, 0.16)'
          }}>
            <Check size={17} color="#a88b46" style={{ flexShrink: 0, marginTop: '4px' }} strokeWidth={2.5} />
            <span style={{
              color: 'rgba(240, 240, 240, 0.88)',
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Roadmap */}
    <h3 data-reveal style={{
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 'clamp(22px, 2.4vw, 28px)',
      fontWeight: '700',
      letterSpacing: '-0.015em',
      fontFamily: 'Manrope, Inter, sans-serif',
      margin: '0 0 36px',
      textWrap: 'balance'
    }}>
      Every call has a job. This is the plan you&apos;re buying:
    </h3>
    <RoadmapTable />

    {/* Price block: the figure, then one fact per line */}
    <div data-reveal style={{
      textAlign: 'center',
      maxWidth: '560px',
      margin: '120px auto 0'
    }}>
      <div className="tnum" style={{
        fontSize: 'clamp(56px, 7vw, 76px)',
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        marginBottom: '20px',
        fontFamily: 'Manrope, Inter, sans-serif'
      }}>
        {OFFER.priceFormatted}
      </div>
      <p style={{
        color: 'rgba(240, 240, 240, 0.72)',
        fontSize: '17px',
        lineHeight: 1.6,
        marginBottom: '8px'
      }}>
        {OFFER.priceFormatted} for the six months, or {OFFER.plan.installments} payments of {euro(OFFER.plan.amount)}.
      </p>
      <p style={{
        color: 'rgba(240, 240, 240, 0.94)',
        fontSize: '17px',
        fontWeight: '600',
        lineHeight: 1.6,
        marginBottom: '40px'
      }}>
        Paying in full adds {OFFER.pifBonus}. I don&apos;t discount, I add.
      </p>

      {/* CTA */}
      <a
        href="/apply"
        onClick={() => track('cta_click', { placement: 'offer' })}
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

      {/* Audit path + continuation: the two secondary facts, grouped under the action */}
      <p style={{
        color: 'rgba(240, 240, 240, 0.62)',
        fontSize: '14.5px',
        lineHeight: 1.75,
        margin: '56px auto 12px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(167, 138, 67, 0.16)',
        maxWidth: '500px'
      }}>
        The {AUDIT.priceFormatted} {AUDIT.name} is available standalone first and is credited in full if you continue within {AUDIT.creditDays} days.
      </p>
      <div style={{ marginBottom: '28px' }}>
        <a
          href="/audit"
          onClick={() => track('cta_click', { placement: 'offer_audit' })}
          style={{
            color: 'rgba(240, 240, 240, 0.6)',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(167, 138, 67, 0.35)',
            paddingBottom: '2px'
          }}
        >
          Or start with the {AUDIT.priceFormatted} {AUDIT.name} →
        </a>
      </div>
      <p style={{
        color: 'rgba(240, 240, 240, 0.55)',
        fontSize: '13.5px',
        lineHeight: 1.75,
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        After the first six months, staying on is {EXTENSION.priceFormatted} per six months. We set each block&apos;s plan at your exit review.
      </p>
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      @media (max-width: 768px) {
        .offer-deliverables {
          margin-bottom: 80px !important;
        }
        .offer-deliverables-grid {
          grid-template-columns: 1fr !important;
        }
      }
    ` }} />
  </div>
);

export default OfferSection;
