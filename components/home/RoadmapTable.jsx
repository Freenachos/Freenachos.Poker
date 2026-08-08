'use client';

import { ROADMAP } from '@/lib/offer';

/**
 * The call-by-call roadmap (P1.6) — renders ROADMAP from lib/offer.js.
 * Wide table scrolls inside its own container on small screens.
 */
const RoadmapTable = () => (
  <div
    className="glass-card roadmap-table-wrap"
    style={{
      borderRadius: '20px',
      overflow: 'hidden',
      maxWidth: '900px',
      margin: '0 auto'
    }}
  >
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '640px',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(168, 139, 70, 0.3)' }}>
            {['Call', 'Week', 'Focus', 'What happens'].map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                padding: '16px 20px',
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
              style={{
                borderBottom: idx < ROADMAP.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none'
              }}
            >
              <td style={{
                padding: '16px 20px',
                color: '#a88b46',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                {row.call}
              </td>
              <td style={{
                padding: '16px 20px',
                color: 'rgba(240, 240, 240, 0.55)',
                whiteSpace: 'nowrap'
              }}>
                {row.week}
              </td>
              <td style={{
                padding: '16px 20px',
                color: '#F0F0F0',
                fontWeight: '600',
                minWidth: '180px'
              }}>
                {row.title}
              </td>
              <td style={{
                padding: '16px 20px',
                color: 'rgba(240, 240, 240, 0.65)',
                lineHeight: 1.7,
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
);

export default RoadmapTable;
