'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ROADMAP } from '@/lib/offer';

// Rows shown before the expander: through the first checkpoint (the guarantee gate).
const COLLAPSED_ROWS = 6;
const isCheckpoint = (row) => /^(Checkpoint|Exit)/.test(row.title);

/**
 * The call-by-call roadmap (P1.6) — renders ROADMAP from lib/offer.js.
 * Opens on the first half (theory, the four SRP formations, the checkpoint)
 * and expands to all twelve calls. Every row stays in the DOM either way.
 * Wide table scrolls inside its own container on small screens.
 */
const RoadmapTable = () => {
  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState({ collapsed: 470, full: 1200 });
  const tableRef = useRef(null);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const measure = () => {
      const cut = table.querySelectorAll('tbody tr')[COLLAPSED_ROWS];
      setHeights({
        collapsed: cut ? cut.offsetTop : table.offsetHeight,
        full: table.offsetHeight
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(table);
    return () => ro.disconnect();
  }, []);

  return (
    <div data-reveal style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div
        className="glass-card roadmap-table-wrap"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          id="roadmap-rows"
          className="roadmap-clip"
          style={{
            maxHeight: `${expanded ? heights.full : heights.collapsed}px`,
            overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              ref={tableRef}
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '640px',
                fontSize: '14.5px'
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(168, 139, 70, 0.3)' }}>
                  {['Call', 'Week', 'Focus', 'What happens'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '18px 24px',
                      color: '#a88b46',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      whiteSpace: 'nowrap'
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROADMAP.map((row, idx) => (
                  <tr
                    key={row.call}
                    className="roadmap-row"
                    style={{
                      borderBottom: idx < ROADMAP.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                      background: isCheckpoint(row) ? 'rgba(167, 138, 67, 0.07)' : 'transparent'
                    }}
                  >
                    <td className="tnum" style={{
                      padding: '18px 24px',
                      color: '#a88b46',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }}>
                      {row.call}
                    </td>
                    <td className="tnum" style={{
                      padding: '18px 24px',
                      color: 'rgba(240, 240, 240, 0.6)',
                      whiteSpace: 'nowrap'
                    }}>
                      {row.week}
                    </td>
                    <td style={{
                      padding: '18px 24px',
                      color: '#F0F0F0',
                      fontWeight: '600',
                      minWidth: '180px'
                    }}>
                      {row.title}
                    </td>
                    <td style={{
                      padding: '18px 24px',
                      color: 'rgba(240, 240, 240, 0.68)',
                      lineHeight: 1.65,
                      minWidth: '280px'
                    }}>
                      {row.job}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fade over the cut line while collapsed */}
        <div
          aria-hidden="true"
          className="roadmap-fade"
          style={{ opacity: expanded ? 0 : 1 }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="roadmap-rows"
          className="roadmap-expander-btn"
        >
          {expanded ? 'Show the first six calls' : `Show all ${ROADMAP.length} calls`}
          <ChevronDown
            size={16}
            style={{
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .roadmap-clip {
          transition: max-height 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .roadmap-fade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 72px;
          background: linear-gradient(to top, rgba(12, 14, 22, 0.96), transparent);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .roadmap-row {
          transition: background 0.2s ease;
        }
        .roadmap-row:hover {
          background: rgba(255, 255, 255, 0.035) !important;
        }
        .roadmap-expander-btn {
          background: transparent;
          color: #C9A85A;
          border: 1.5px solid rgba(167, 138, 67, 0.45);
          border-radius: 12px;
          padding: 13px 26px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .roadmap-expander-btn:hover {
          background: rgba(168, 139, 70, 0.08);
          border-color: #a88b46;
        }
        @media (prefers-reduced-motion: reduce) {
          .roadmap-clip { transition: none; }
        }
      ` }} />
    </div>
  );
};

export default RoadmapTable;
