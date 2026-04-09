import { motion } from 'framer-motion';
import { PieChart, ArrowUpDown } from 'lucide-react';

export default function StrategyResults({ data }) {
  if (!data) return null;

  const { categoryAllocation, topHoldings, diversificationScore, rebalancing, sentimentAdjustment, strategy } = data;

  // SVG Donut Chart
  const donutSize = 140;
  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;

  let accumulatedOffset = 0;
  const donutSegments = (categoryAllocation || []).map((cat) => {
    const segmentLength = (cat.allocation / 100) * donutCircumference;
    const offset = accumulatedOffset;
    accumulatedOffset += segmentLength;
    return { ...cat, segmentLength, offset };
  });

  const divColor = diversificationScore > 70 ? '#22c55e' : diversificationScore > 50 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Donut Chart + Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: `${donutSize}px`, height: `${donutSize}px`, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ width: `${donutSize}px`, height: `${donutSize}px`, transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={donutRadius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
            {donutSegments.map((seg, i) => (
              <motion.circle
                key={seg.category}
                cx="60" cy="60" r={donutRadius}
                fill="none" stroke={seg.color} strokeWidth="14" strokeLinecap="butt"
                strokeDasharray={`${seg.segmentLength} ${donutCircumference - seg.segmentLength}`}
                initial={{ strokeDashoffset: donutCircumference }}
                animate={{ strokeDashoffset: -seg.offset }}
                transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                style={{ opacity: 0.85 }}
              />
            ))}
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: 800, color: divColor, lineHeight: 1 }}>{diversificationScore}</p>
            <p style={{ fontSize: '8px', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>Diversity</p>
          </div>
        </div>

        {/* Category Legend */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>
            Allocation ({strategy})
          </p>
          {(categoryAllocation || []).map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'capitalize', flex: 1 }}>{cat.category}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>{cat.allocation}%</span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>({cat.count})</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Holdings */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Top Holdings</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {(topHoldings || []).slice(0, 6).map((h, i) => (
            <motion.div
              key={h.symbol}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '10px', background: 'var(--color-surface)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: h.color || '#4f8cff' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{h.symbol}</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#4f8cff' }}>{(h.allocation * 100).toFixed(1)}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rebalancing Actions */}
      {rebalancing && rebalancing.filter((r) => r.action !== 'HOLD').length > 0 && (
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>
            <ArrowUpDown style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Rebalancing Needed
          </p>
          {rebalancing.filter((r) => r.action !== 'HOLD').map((r, i) => (
            <motion.div
              key={r.category}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px',
                background: r.action === 'REDUCE' ? 'rgba(239,68,68,0.04)' : 'rgba(34,197,94,0.04)',
              }}
            >
              <div style={{
                padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                background: r.action === 'REDUCE' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                color: r.action === 'REDUCE' ? '#ef4444' : '#22c55e',
              }}>
                {r.action}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'capitalize', flex: 1 }}>{r.category}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{r.current}%</span>
              <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>→</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text)' }}>{r.target}%</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
