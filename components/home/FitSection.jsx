'use client';

import { Check, X } from 'lucide-react';
import { track } from '@vercel/analytics';
import { FIT, AUDIT } from '@/lib/offer';
import { RIO_COURSE_URL, COURSE, cfpUrl } from '@/lib/links';

const fmtK = (n) => `${n / 1000}k`;

/**
 * Fit / not-fit section (P1.5). Numbers route through FIT/AUDIT; the CFP and
 * course links are the honest exits for people the program doesn't fit.
 */
const FitSection = () => {
  const cfpLink = (
    <a
      href={cfpUrl('fit_section')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('outbound', { target: 'cfp_fit' })}
      style={{ color: '#a88b46', textDecoration: 'none', borderBottom: '1px solid rgba(167, 138, 67, 0.4)' }}
    >
      my CFP
    </a>
  );

  const courseLink = (
    <a
      href={RIO_COURSE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('outbound', { target: 'rio_course_fit' })}
      style={{ color: '#a88b46', textDecoration: 'none', borderBottom: '1px solid rgba(167, 138, 67, 0.4)' }}
    >
      the {COURSE.priceFormatted} course
    </a>
  );

  const goodFit = [
    <>you play {FIT.stakesRange} online cash on your own bankroll</>,
    <>you have a database of {fmtK(AUDIT.dbMinHands)}+ hands ({fmtK(FIT.dbPreferredHands)} preferred) and put in {fmtK(FIT.monthlyHandsFloor)}+ hands a month</>,
    <>you want to understand why adjustments work, not memorize lines</>,
    <>you can commit {FIT.studyHoursPerWeek}+ hours a week to structured study</>,
    <>you&apos;re a winning or near-breakeven reg who&apos;s plateaued</>
  ];

  const notFit = [
    <>you&apos;re looking for staking. That&apos;s {cfpLink}, a different business and a different deal</>,
    <>you want shortcuts, &quot;secret lines,&quot; or someone to guarantee you a win rate</>,
    <>you&apos;re below {FIT.stakesFloor} or building a first bankroll. Start with {courseLink}; it&apos;s most of the theory at a fraction of the price</>,
    <>you won&apos;t share your database. The entire method runs on it</>
  ];

  return (
    <div
      className="reveal"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        marginBottom: '140px'
      }}
    >
      {/* Centered Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 style={{
          fontSize: 'clamp(36px, 4.5vw, 52px)',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '16px',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          fontFamily: 'Manrope, Inter, sans-serif'
        }}>
          Is This Right <span style={{
            color: '#A78A43',
            textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
          }}>For You</span>?
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '64px',
        maxWidth: '950px',
        margin: '0 auto'
      }}>
        {/* Good Fit Column */}
        <div>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#F0F0F0',
            marginBottom: '28px'
          }}>
            This is a fit if:
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {goodFit.map((reason, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(167, 138, 67, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Check size={14} color="#A78A43" />
                </div>
                <span style={{
                  color: 'rgba(240, 240, 240, 0.8)',
                  fontSize: '15px',
                  lineHeight: 1.6
                }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Not a Fit Column */}
        <div>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#F0F0F0',
            marginBottom: '28px'
          }}>
            This is not a fit if:
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {notFit.map((reason, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <X size={14} color="#ef4444" />
                </div>
                <span style={{
                  color: 'rgba(240, 240, 240, 0.55)',
                  fontSize: '15px',
                  lineHeight: 1.6
                }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitSection;
