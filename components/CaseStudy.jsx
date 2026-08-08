'use client';

/**
 * Case-study card for /results (P4).
 *
 * Every field renders only what can be sourced. Where before/after stats or
 * graphs are still owed by the owner, pass `pending: true` on the item and a
 * visible TODO placeholder renders instead — numbers are NEVER invented.
 */

const GOLD = '#A78A43';

const Pending = ({ children }) => (
  <div style={{
    border: '1px dashed rgba(167, 138, 67, 0.4)',
    borderRadius: '12px',
    padding: '18px 20px',
    color: 'rgba(240, 240, 240, 0.45)',
    fontSize: '13.5px',
    lineHeight: 1.7,
    fontStyle: 'italic'
  }}>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '12px',
    fontWeight: '700',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '14px'
  }}>
    {children}
  </div>
);

const CaseStudy = ({ study }) => (
  <div
    id={study.slug}
    className="glass-card"
    style={{
      borderRadius: '24px',
      padding: '48px 44px',
      scrollMarginTop: '110px'
    }}
  >
    {/* Headline metric */}
    <h2 style={{
      fontSize: 'clamp(24px, 3vw, 32px)',
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: '10px',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      fontFamily: 'Manrope, Inter, sans-serif'
    }}>
      {study.name}: <span style={{ color: GOLD }}>{study.headline}</span>
    </h2>

    {/* Situation */}
    <p style={{
      color: 'rgba(240, 240, 240, 0.65)',
      fontSize: '15px',
      lineHeight: 1.85,
      marginBottom: '32px'
    }}>
      {study.situation}
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      marginBottom: '32px'
    }} className="case-study-grid">
      {/* What the audit found */}
      <div>
        <SectionLabel>What the audit found</SectionLabel>
        {study.pendingStats ? (
          <Pending>[TODO(patrick): 2–3 specific before/after stat lines with numbers]</Pending>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '18px',
            color: 'rgba(240, 240, 240, 0.75)',
            fontSize: '14.5px',
            lineHeight: 2
          }}>
            {study.auditFound.map((line, idx) => <li key={idx}>{line}</li>)}
          </ul>
        )}
      </div>

      {/* What was installed */}
      <div>
        <SectionLabel>What was installed</SectionLabel>
        {study.pendingInstalled ? (
          <Pending>[TODO(patrick): the fixes installed, in priority order]</Pending>
        ) : (
          <p style={{
            margin: 0,
            color: 'rgba(240, 240, 240, 0.75)',
            fontSize: '14.5px',
            lineHeight: 1.9
          }}>
            {study.installed}
          </p>
        )}
      </div>
    </div>

    {/* Graph */}
    <div style={{ marginBottom: '32px' }}>
      <SectionLabel>The graph</SectionLabel>
      {study.graph ? (
        <figure style={{ margin: 0 }}>
          <img
            src={study.graph}
            alt={`${study.name} results graph`}
            style={{
              width: '100%',
              display: 'block',
              borderRadius: '14px',
              border: '1px solid rgba(168, 139, 70, 0.25)'
            }}
          />
          {study.graphCaption && (
            <figcaption style={{
              marginTop: '12px',
              fontSize: '12.5px',
              color: 'rgba(240, 240, 240, 0.45)',
              fontStyle: 'italic'
            }}>
              {study.graphCaption}
            </figcaption>
          )}
        </figure>
      ) : (
        <Pending>[TODO(patrick): results graph — hands on the x-axis]</Pending>
      )}
    </div>

    {/* Quote */}
    <blockquote style={{
      margin: '0 0 24px',
      padding: '24px 28px',
      borderLeft: `2px solid ${GOLD}`,
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '0 14px 14px 0'
    }}>
      <p style={{
        margin: '0 0 12px',
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '15px',
        lineHeight: 1.85,
        fontStyle: 'italic'
      }}>
        &quot;{study.quote}&quot;
      </p>
      <cite style={{
        color: GOLD,
        fontSize: '14px',
        fontWeight: '600',
        fontStyle: 'normal'
      }}>
        — {study.name}
      </cite>
    </blockquote>

    {/* Variance caveat */}
    <p style={{
      margin: 0,
      color: 'rgba(240, 240, 240, 0.4)',
      fontSize: '12.5px',
      lineHeight: 1.7
    }}>
      {study.varianceCaveat}
    </p>

    <style>{`
      @media (max-width: 760px) {
        .case-study-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </div>
);

export default CaseStudy;
