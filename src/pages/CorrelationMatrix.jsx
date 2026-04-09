import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { generateCorrelationMatrix } from '../data/marketData';
import { GitBranch } from 'lucide-react';

export default function CorrelationMatrix() {
  const assets = useMarketData();
  const [selected, setSelected] = useState(null);
  const symbols = useMemo(() => assets.slice(0, 15).map(a => a.symbol), [assets]);
  const matrix = useMemo(() => generateCorrelationMatrix(symbols), [symbols]);

  const getColor = (val) => {
    if (val >= 0.7) return 'rgba(34,197,94,0.6)';
    if (val >= 0.3) return 'rgba(34,197,94,0.25)';
    if (val >= -0.3) return 'rgba(255,255,255,0.04)';
    if (val >= -0.7) return 'rgba(239,68,68,0.25)';
    return 'rgba(239,68,68,0.6)';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #14b8a6, #4f8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitBranch style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #14b8a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Correlation Matrix</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Interactive correlation heatmap between portfolio assets</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${symbols.length}, 1fr)`, gap: '2px', minWidth: `${60 + symbols.length * 56}px` }}>
          {/* Header row */}
          <div />
          {symbols.map(s => (
            <div key={`h-${s}`} style={{ textAlign: 'center', fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', padding: '4px 2px', transform: 'rotate(-45deg)', transformOrigin: 'bottom center', height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>{s}</div>
          ))}
          {/* Matrix rows */}
          {symbols.map((s1, i) => (
            <>
              <div key={`l-${s1}`} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }}>{s1}</div>
              {symbols.map((s2, j) => {
                const val = matrix[s1]?.[s2] ?? 0;
                const isSelected = selected && (selected[0] === s1 && selected[1] === s2 || selected[0] === s2 && selected[1] === s1);
                return (
                  <motion.div key={`${s1}-${s2}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (i * symbols.length + j) * 0.002 }}
                    onClick={() => s1 !== s2 && setSelected([s1, s2])}
                    style={{ aspectRatio: '1', borderRadius: '4px', background: getColor(val), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 600, color: s1 === s2 ? '#22c55e' : 'var(--color-text-muted)', cursor: s1 !== s2 ? 'pointer' : 'default', border: isSelected ? '2px solid #4f8cff' : '2px solid transparent', transition: 'all 150ms' }}>
                    {val.toFixed(1)}
                  </motion.div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        {[{ label: 'Strong Negative', color: 'rgba(239,68,68,0.6)' }, { label: 'Weak', color: 'rgba(255,255,255,0.06)' }, { label: 'Strong Positive', color: 'rgba(34,197,94,0.6)' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: l.color }} />
            <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Selected pair info */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', padding: '20px', borderRadius: '16px', background: 'rgba(79,140,255,0.06)', border: '1px solid rgba(79,140,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{selected[0]} ↔ {selected[1]}</span>
            <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '4px' }}>
              {(matrix[selected[0]]?.[selected[1]] ?? 0) > 0.5 ? 'These assets tend to move together — consider diversifying.' : (matrix[selected[0]]?.[selected[1]] ?? 0) < -0.3 ? 'These assets are inversely correlated — great for hedging.' : 'Low correlation — good diversification pair.'}
            </p>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: (matrix[selected[0]]?.[selected[1]] ?? 0) >= 0 ? '#22c55e' : '#ef4444' }}>
            {(matrix[selected[0]]?.[selected[1]] ?? 0).toFixed(2)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
