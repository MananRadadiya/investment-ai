import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Gauge, BarChart3 } from 'lucide-react';

export default function MarketResults({ data }) {
  if (!data) return null;

  const { sentiment, bullishCount, bearishCount, avgChange, fearGreed, rsi, momentum, topGainers, topLosers, sectors, totalAssets } = data;

  const sentimentColor = sentiment === 'bullish' ? '#22c55e' : sentiment === 'bearish' ? '#ef4444' : '#f59e0b';
  const fgColor = fearGreed > 70 ? '#22c55e' : fearGreed > 40 ? '#f59e0b' : '#ef4444';
  const fgLabel = fearGreed > 75 ? 'Extreme Greed' : fearGreed > 55 ? 'Greed' : fearGreed > 45 ? 'Neutral' : fearGreed > 25 ? 'Fear' : 'Extreme Fear';

  // SVG arc gauge helper
  const createArc = (value, max, radius = 46, stroke = 7) => {
    const circumference = Math.PI * radius;
    const progress = (value / max) * circumference;
    return { circumference, progress, radius, stroke };
  };

  const fgArc = createArc(fearGreed, 100);
  const rsiArc = createArc(rsi, 100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Sentiment', value: sentiment.toUpperCase(), color: sentimentColor },
          { label: 'Avg Change', value: `${avgChange > 0 ? '+' : ''}${avgChange}%`, color: avgChange > 0 ? '#22c55e' : '#ef4444' },
          { label: 'Assets', value: totalAssets, color: '#4f8cff' },
          { label: 'Momentum', value: momentum, color: momentum > 55 ? '#22c55e' : momentum < 45 ? '#ef4444' : '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '14px', borderRadius: '14px', background: 'var(--color-surface)', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '6px' }}>{stat.label}</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Gauges Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Fear & Greed Gauge */}
        <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--color-surface)', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '12px' }}>Fear & Greed</p>
          <svg viewBox="0 0 100 60" style={{ width: '120px', height: '72px' }}>
            <path d={`M 4 56 A ${fgArc.radius} ${fgArc.radius} 0 0 1 96 56`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={fgArc.stroke} strokeLinecap="round" />
            <motion.path
              d={`M 4 56 A ${fgArc.radius} ${fgArc.radius} 0 0 1 96 56`}
              fill="none" stroke={fgColor} strokeWidth={fgArc.stroke} strokeLinecap="round"
              strokeDasharray={fgArc.circumference}
              initial={{ strokeDashoffset: fgArc.circumference }}
              animate={{ strokeDashoffset: fgArc.circumference - fgArc.progress }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <text x="50" y="52" textAnchor="middle" fill={fgColor} fontSize="18" fontWeight="700" fontFamily="var(--font-sans)">{fearGreed}</text>
          </svg>
          <p style={{ fontSize: '11px', fontWeight: 600, color: fgColor, marginTop: '4px' }}>{fgLabel}</p>
        </div>

        {/* RSI Gauge */}
        <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--color-surface)', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '12px' }}>RSI Index</p>
          <svg viewBox="0 0 100 60" style={{ width: '120px', height: '72px' }}>
            <path d={`M 4 56 A ${rsiArc.radius} ${rsiArc.radius} 0 0 1 96 56`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={rsiArc.stroke} strokeLinecap="round" />
            <motion.path
              d={`M 4 56 A ${rsiArc.radius} ${rsiArc.radius} 0 0 1 96 56`}
              fill="none" stroke={rsi > 70 ? '#ef4444' : rsi < 30 ? '#22c55e' : '#4f8cff'} strokeWidth={rsiArc.stroke} strokeLinecap="round"
              strokeDasharray={rsiArc.circumference}
              initial={{ strokeDashoffset: rsiArc.circumference }}
              animate={{ strokeDashoffset: rsiArc.circumference - rsiArc.progress }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
            />
            <text x="50" y="52" textAnchor="middle" fill={rsi > 70 ? '#ef4444' : rsi < 30 ? '#22c55e' : '#4f8cff'} fontSize="18" fontWeight="700" fontFamily="var(--font-sans)">{rsi}</text>
          </svg>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
          </p>
        </div>
      </div>

      {/* Signal Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>
            <TrendingUp style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {bullishCount} Bullish
          </span>
          <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
            {bearishCount} Bearish
            <TrendingDown style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
          </span>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(bullishCount / (bullishCount + bearishCount)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', borderRadius: '999px 0 0 999px' }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(bearishCount / (bullishCount + bearishCount)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #f87171, #ef4444)', borderRadius: '0 999px 999px 0' }}
          />
        </div>
      </div>

      {/* Top Movers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Top Gainers</p>
          {topGainers?.slice(0, 4).map((a, i) => (
            <motion.div key={a.symbol} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '10px', background: i === 0 ? 'rgba(34,197,94,0.06)' : 'transparent', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{a.symbol}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e' }}>+{a.changePercent.toFixed(2)}%</span>
            </motion.div>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Top Losers</p>
          {topLosers?.slice(0, 4).map((a, i) => (
            <motion.div key={a.symbol} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '10px', background: i === 0 ? 'rgba(239,68,68,0.06)' : 'transparent', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{a.symbol}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444' }}>{a.changePercent.toFixed(2)}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sector Performance */}
      {sectors && sectors.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Sector Performance</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sectors.slice(0, 6).map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', width: '80px', flexShrink: 0 }}>{s.name}</span>
                <div style={{ flex: 1, height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.abs(s.avgChange) * 20)}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    style={{ height: '100%', borderRadius: '999px', background: s.avgChange > 0 ? '#22c55e' : '#ef4444' }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: s.avgChange > 0 ? '#22c55e' : '#ef4444', width: '50px', textAlign: 'right' }}>
                  {s.avgChange > 0 ? '+' : ''}{s.avgChange}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
