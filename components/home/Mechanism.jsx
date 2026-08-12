'use client';

import { Crosshair, ListOrdered, Wrench, LineChart } from 'lucide-react';
import { PROOF, AUDIT, FIT } from '@/lib/offer';

const fmtK = (n) => `${n / 1000}k`;
const BOTS = PROOF.botsTracked.replace(/ tracked$/, '');

/**
 * The Mechanism — replaces the old six "What You Get" tiles (P1.4).
 * Keeps the #mentorship anchor the navbar/footer historically pointed at.
 * Four steps: Diagnose → Prioritize → Install → Verify, each with a media
 * asset from /public/mechanism/ (Phase 7 screenshot pipeline).
 */
const STEPS = [
  {
    n: 1,
    title: 'Diagnose',
    icon: Crosshair,
    body: (
      <>
        We start with a full audit of your database: {fmtK(AUDIT.dbMinHands)} hands minimum, {fmtK(FIT.dbPreferredHands)} preferred. My Stat Checker compares every meaningful stat you have against two baselines: GTO, and the winning population at your stakes, drawn from {PROOF.poolHands}. I built the Stat Checker myself, on a pool database I maintain, including tracking {BOTS} so the benchmarks aren&apos;t poisoned. Not what a coach thinks looks off. What the numbers say is off.
      </>
    ),
    asset: '/mechanism/diagnose.png',
    isVideo: false,
    hasAsset: true, // BB Defense view, account chip redacted (2026-08-08)
    caption: 'Stat Checker: a student database vs GTO and vs winning-population benchmarks.'
  },
  {
    n: 2,
    title: 'Prioritize',
    icon: ListOrdered,
    body: (
      <>
        An audit that finds 40 leaks is useless. Every action line in every branch gets scored: your frequency against the baseline, the gap flagged from minor to major, the sample size right next to it so you know what&apos;s signal and what&apos;s noise. You leave the first month with a short, ordered list: the three to five deviations that matter most.
      </>
    ),
    asset: '/mechanism/prioritize.png',
    isVideo: false,
    hasAsset: true, // 3BP OOP PFC turn view, admin nav cropped + account chip redacted (2026-08-12)
    caption: 'A 3-bet pot, out of position, on the turn: every line scored vs PIO, gaps flagged from minor to major.'
  },
  {
    n: 3,
    title: 'Install',
    icon: Wrench,
    body: (
      <>
        Knowing a leak exists doesn&apos;t close it. The fixes get installed through biweekly 1-on-1 sessions, one call per branch of the game tree, each followed by a tailored PDF: summary, action points, study suggestions. You don&apos;t just watch. You implement. The goal is not theoretical perfection; the goal is to translate data into profit.
      </>
    ),
    asset: '/mechanism/install.png',
    isVideo: false, // switches to install.webm loop when the capture lands
    hasAsset: false, // TODO(patrick): screenshot pending (Phase 7 pipeline)
    caption: 'The study queue and drill flow between sessions.'
  },
  {
    n: 4,
    title: 'Verify',
    icon: LineChart,
    body: (
      <>
        Every month we recalibrate against your fresh sample. At month six, a full re-audit: same stats, same benchmarks, before and after. Win rate over six months is mostly noise. Your frequencies aren&apos;t. If your fold-to-3bet moved from 68% to 54%, that&apos;s not variance. That&apos;s the deliverable.
      </>
    ),
    asset: '/mechanism/verify.png',
    isVideo: false,
    hasAsset: false, // TODO(patrick): screenshot pending (Phase 7 pipeline)
    caption: 'Before/after re-audit panel: same stats, month 1 vs month 6.'
  }
];

const MechanismFigure = ({ step }) => (
  <figure style={{ margin: 0, width: '100%' }}>
    {step.hasAsset ? (
      step.isVideo ? (
        <video
          src={step.asset}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '16px',
            border: '1px solid rgba(168, 139, 70, 0.2)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
          }}
        />
      ) : (
        <img
          src={step.asset}
          alt={step.caption}
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '16px',
            border: '1px solid rgba(168, 139, 70, 0.2)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
          }}
        />
      )
    ) : (
      /* Styled placeholder frame until the Phase 7 screenshots exist.
         No stock images, no mocked UI — just the frame and the caption. */
      <div
        className="glass-card"
        style={{
          width: '100%',
          aspectRatio: '16 / 10',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(168, 139, 70, 0.08) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <step.icon size={44} strokeWidth={1.25} color="rgba(168, 139, 70, 0.5)" />
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(240, 240, 240, 0.35)'
        }}>
          Screenshot from the live tool, coming soon
        </span>
      </div>
    )}
    <figcaption style={{
      marginTop: '14px',
      fontSize: '12.5px',
      color: 'rgba(240, 240, 240, 0.45)',
      fontStyle: 'italic',
      letterSpacing: '0.02em',
      lineHeight: 1.6
    }}>
      {step.caption}
    </figcaption>
  </figure>
);

const Mechanism = () => (
  <div
    id="mentorship"
    className="reveal mechanism-section"
    style={{
      paddingTop: '140px',
      paddingBottom: '140px',
      marginBottom: '0',
      scrollMarginTop: '90px'
    }}
  >
    {/* Header */}
    <div style={{
      textAlign: 'center',
      marginBottom: '72px',
      maxWidth: '720px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h2 style={{
        fontSize: 'clamp(38px, 5vw, 56px)',
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: '24px',
        lineHeight: 1.08,
        letterSpacing: '-0.025em',
        fontFamily: 'Manrope, Inter, sans-serif'
      }}>
        A measurement loop, <span style={{
          color: '#A78A43',
          textShadow: '0 0 60px rgba(167, 138, 67, 0.4)'
        }}>not a conversation.</span>
      </h2>
      <p style={{
        fontSize: '18px',
        color: 'rgba(240, 240, 240, 0.6)',
        lineHeight: 1.85,
        maxWidth: '560px',
        margin: '0 auto'
      }}>
        Most coaching is a series of conversations. This is four steps, run over six months, against your own database.
      </p>
    </div>

    {/* Alternating step rows */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '96px',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      {STEPS.map((step, idx) => (
        <div
          key={step.n}
          className={`mechanism-row ${idx % 2 === 1 ? 'mechanism-row-flipped' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '72px',
            alignItems: 'center'
          }}
        >
          <div style={{ order: idx % 2 === 1 ? 2 : 1 }} className="mechanism-copy">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#A78A43',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                {step.n} · {step.title}
              </span>
              <span style={{
                flexShrink: 0,
                width: '48px',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(167, 138, 67, 0.5), transparent)'
              }} />
            </div>
            <p style={{
              color: 'rgba(240, 240, 240, 0.75)',
              fontSize: '16px',
              lineHeight: 1.9,
              margin: 0
            }}>
              {step.body}
            </p>
          </div>
          <div style={{ order: idx % 2 === 1 ? 1 : 2 }} className="mechanism-media">
            <MechanismFigure step={step} />
          </div>
        </div>
      ))}
    </div>

    <style dangerouslySetInnerHTML={{ __html: `
      @media (max-width: 900px) {
        .mechanism-row {
          grid-template-columns: 1fr !important;
          gap: 32px !important;
        }
        .mechanism-row .mechanism-copy {
          order: 1 !important;
        }
        .mechanism-row .mechanism-media {
          order: 2 !important;
        }
        .mechanism-section {
          padding-top: 100px !important;
          padding-bottom: 100px !important;
        }
      }
    ` }} />
  </div>
);

export default Mechanism;
