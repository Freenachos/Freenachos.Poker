'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { OFFER, AUDIT, FIT, EXTENSION } from '@/lib/offer';

/**
 * Homepage FAQ (P1.7). Items are plain strings so the FAQPage JSON-LD is
 * regenerated from exactly what renders. FAQ #2 carries the site's single
 * permitted meta-denial ("That's not scarcity marketing; it's a calendar") —
 * never add another anywhere on the site.
 */
export const faqItems = [
  {
    question: 'Why not just buy GTO Wizard and a course?',
    answer: `You probably should. I sell a course myself, and a serious reg's software stack is worth every euro of the ~$2–4k/year it costs. But a solver tells you the equilibrium answer, and a course tells you the general answer. Neither one looks at your database and tells you which three deviations matter most against your pool. That's a measurement problem, and it needs your data plus population benchmarks. That's the entire program.`
  },
  {
    question: 'Why is there an application?',
    answer: `Because the method only works on players with a real sample and real volume, and I take a small number of new students per quarter: a biweekly 1-on-1 cadence doesn't scale, and I still play. That's not scarcity marketing; it's a calendar. I read every application, and the fit call starts from your answers. If you're not a fit, I'll say so and point you at the course or the CFP instead.`
  },
  {
    question: `${OFFER.priceFormatted} is a lot. How do I evaluate that?`,
    answer: `Do the math you'd do on any spot. The audit gives you a ranked leak list before you commit to anything beyond ${AUDIT.priceFormatted}: where you deviate from the winning pool, and how often those spots come up. Priority order you can verify in your own database, not a forecast. Run your own ROI math against your stakes and volume; if it doesn't clear, don't apply. For comparison: a CFP takes ~50% of your winnings for 12–15 months. I run one, I know exactly what that split is worth, and for a bankrolled winner it's a multiple of this fee. Top independent coaches charge $250–$990/hour for calls with no database work between them.`
  },
  {
    question: 'What happens after the six months?',
    answer: `You leave with the re-audit, the full recorded vault, and the alumni Discord. If you want to keep going, renewals are ${EXTENSION.priceFormatted} per six months; we set each block's plan at your exit review. No obligation either way.`
  },
  {
    question: `What's the time commitment?`,
    answer: `The sessions plus roughly ${FIT.studyHoursPerWeek} hours a week on the study queue and drills, alongside your normal volume. If you can't protect that time, the audit will be accurate and the results won't be. Wait until you can.`
  },
  {
    question: 'Do you guarantee results?',
    answer: `Not your winrate. You should run from anyone who does. What I guarantee is the process. If the audit doesn't surface clear, fixable leaks, it's refunded. At the month-${OFFER.checkpointMonth} recalibration we compare your targeted stats against the plan we wrote down in week 1. If you've done your side and they haven't moved toward benchmark, I extend the program free until they do, or you walk with the remaining months refunded pro-rata. And the final re-audit either shows your frequencies moved or it doesn't. It's measured, not asserted.`
  },
  {
    question: 'What happens on the fit call?',
    answer: `Fifteen to twenty minutes. Your stakes, your sample, your goals, my honest read on whether the method fits your situation. It is not a coaching session. I won't diagnose your game from a conversation, because that's exactly the guessing the audit exists to replace.`
  }
];

// FAQPage structured data for search engines — regenerated from the items above.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer }
  }))
};

const FAQItem = ({ item, index, isExpanded, onToggle }) => (
  <div
    className="faq-item"
    style={{
      background: 'rgba(24, 24, 24, 0.9)',
      border: '1px solid rgba(167, 138, 67, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'border-color 0.3s ease, background 0.3s ease'
    }}
  >
    <button
      onClick={() => onToggle(index)}
      aria-expanded={isExpanded}
      style={{
        width: '100%',
        fontFamily: 'inherit',
        padding: '24px 28px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <span style={{
        color: '#F0F0F0',
        fontSize: '16.5px',
        fontWeight: '600',
        lineHeight: 1.45,
        flex: 1,
        paddingRight: '16px'
      }}>
        {item.question}
      </span>
      <ChevronDown
        size={20}
        color="#A78A43"
        style={{
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}
      />
    </button>
    {/* grid 0fr -> 1fr: the panel opens to its own height, no max-height guess */}
    <div
      className="faq-panel"
      style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>
        <div
          className="faq-answer"
          style={{
            padding: '0 28px 26px',
            color: 'rgba(240, 240, 240, 0.72)',
            fontSize: '15.5px',
            lineHeight: 1.8,
            maxWidth: '68ch',
            whiteSpace: 'pre-line',
            opacity: isExpanded ? 1 : 0
          }}
        >
          {item.answer}
        </div>
      </div>
    </div>
  </div>
);

const HomeFAQ = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(-1);

  return (
    <div
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        marginBottom: '160px'
      }}
    >
      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Centered Header */}
      <div data-reveal style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{
          fontSize: 'clamp(36px, 4.5vw, 52px)',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '16px',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          fontFamily: 'Manrope, Inter, sans-serif'
        }}>
          Questions & <span style={{
            color: '#A78A43',
            textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
          }}>Answers</span>
        </h2>
        <p style={{
          color: 'rgba(240, 240, 240, 0.62)',
          fontSize: '17px',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: '0 auto'
        }}>
          Everything you need to know about the program
        </p>
      </div>

      {/* Narrow Accordion Container */}
      <div style={{
        maxWidth: '768px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {faqItems.map((item, idx) => (
          <FAQItem
            key={idx}
            item={item}
            index={idx}
            isExpanded={expandedFAQ === idx}
            onToggle={(i) => setExpandedFAQ(expandedFAQ === i ? -1 : i)}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .faq-panel {
          display: grid;
          transition: grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-answer {
          transition: opacity 0.35s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-panel { transition: none; }
        }
      ` }} />
    </div>
  );
};

export default HomeFAQ;
