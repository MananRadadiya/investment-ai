import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { chartPatterns } from '../data/aiData';
import { Eye, TrendingUp, TrendingDown, Shield, Zap, Info } from 'lucide-react';

function PatternPreview({ points, color, w = 200, h = 80 }) {
  if (!points || points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const pathPoints = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * (h - 10) - 5}`).join(' ');

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`pg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pathPoints} ${w},${h}`} fill={`url(#pg-${color.replace('#', '')})`} />
      <polyline points={pathPoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const cx = (i / (points.length - 1)) * w;
        const cy = h - ((p - min) / range) * (h - 10) - 5;
        return <circle key={i} cx={cx} cy={cy} r="3" fill={color} />;
      })}
    </svg>
  );
}

export default function PatternRecognition() {
  const [selectedPattern, setSelectedPattern] = useState(chartPatterns[0]);
  const [filterType, setFilterType] = useState('all');

  const filtered = useMemo(() => {
    if (filterType === 'all') return chartPatterns;
    if (filterType === 'bullish') return chartPatterns.filter(p => p.direction === 'bullish');
    if (filterType === 'bearish') return chartPatterns.filter(p => p.direction === 'bearish');
    return chartPatterns.filter(p => p.type === filterType);
  }, [filterType]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pattern Recognition</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>AI-detected chart patterns with confidence scoring</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'bullish', 'bearish', 'reversal', 'continuation'].map(f => (
          <button key={f} onClick={() => setFilterType(f)}
            style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: filterType === f ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: filterType === f ? 'var(--color-accent)' : 'var(--color-text-muted)', transition: 'all 150ms' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Pattern Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((pattern, idx) => (
            <motion.div key={pattern.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
              onClick={() => setSelectedPattern(pattern)}
              style={{ padding: '20px', borderRadius: '16px', background: selectedPattern?.id === pattern.id ? 'rgba(79,140,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedPattern?.id === pattern.id ? 'rgba(79,140,255,0.15)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ flexShrink: 0 }}>
                <PatternPreview points={pattern.points} color={pattern.color} w={120} h={50} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{pattern.name}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: pattern.direction === 'bullish' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: pattern.direction === 'bullish' ? '#22c55e' : '#ef4444', textTransform: 'uppercase' }}>
                    {pattern.direction}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{pattern.type} · {pattern.reliability}% reliable</div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {pattern.detected.map(s => (
                    <span key={s} style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: pattern.color }}>{pattern.reliability}%</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-dim)' }}>confidence</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedPattern && (
          <motion.div key={selectedPattern.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ position: 'sticky', top: '24px', alignSelf: 'start' }}>
            <div style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                {selectedPattern.direction === 'bullish' ? <TrendingUp style={{ width: '20px', height: '20px', color: '#22c55e' }} /> : <TrendingDown style={{ width: '20px', height: '20px', color: '#ef4444' }} />}
                <h2 style={{ fontSize: '22px', fontWeight: 700 }}>{selectedPattern.name}</h2>
              </div>
              <PatternPreview points={selectedPattern.points} color={selectedPattern.color} w={340} h={140} />
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: '20px' }}>{selectedPattern.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <Shield style={{ width: '14px', height: '14px', color: selectedPattern.color, marginBottom: '6px' }} />
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Reliability</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: selectedPattern.color }}>{selectedPattern.reliability}%</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <Zap style={{ width: '14px', height: '14px', color: '#f59e0b', marginBottom: '6px' }} />
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Type</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize' }}>{selectedPattern.type}</div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info style={{ width: '12px', height: '12px' }} /> Detected In
                </span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {selectedPattern.detected.map(s => (
                    <span key={s} style={{ padding: '6px 12px', borderRadius: '8px', background: `${selectedPattern.color}10`, border: `1px solid ${selectedPattern.color}20`, fontSize: '12px', fontWeight: 600, color: selectedPattern.color }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
