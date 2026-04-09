import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { gradePortfolio } from '../data/aiData';
import { formatCurrency, formatPercent } from '../utils/format';
import {
  Sparkles, Target, Shield, TrendingUp, Zap,
  BarChart3, PieChart, GripVertical, ArrowUpRight, AlertTriangle
} from 'lucide-react';

const GRADE_COLORS = { 'A+': '#22c55e', 'A': '#22c55e', 'B+': '#4f8cff', 'B': '#4f8cff', 'C+': '#f59e0b', 'C': '#f59e0b', 'D': '#ef4444', 'F': '#ef4444', 'N/A': '#484f58' };

export default function PortfolioOptimizer() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();
  const [weights, setWeights] = useState(() => {
    if (!portfolio?.assets) return {};
    const w = {};
    portfolio.assets.forEach(a => { w[a.symbol] = Math.round((a.allocation || 0) * 100); });
    return w;
  });

  const totalWeight = useMemo(() => Object.values(weights).reduce((s, w) => s + w, 0), [weights]);

  const gradeResult = useMemo(() => {
    if (!portfolio?.assets) return { grade: 'N/A', score: 0, breakdown: {} };
    const adjustedAssets = portfolio.assets.map(a => ({
      ...a,
      allocation: (weights[a.symbol] || 0) / 100,
      category: assets.find(m => m.symbol === a.symbol)?.category || 'unknown',
    }));
    return gradePortfolio(adjustedAssets);
  }, [portfolio, weights, assets]);

  const handleWeightChange = useCallback((symbol, value) => {
    setWeights(prev => ({ ...prev, [symbol]: Math.max(0, Math.min(100, Number(value))) }));
  }, []);

  const optimizeWeights = useCallback(() => {
    if (!portfolio?.assets) return;
    const n = portfolio.assets.length;
    const equalWeight = Math.floor(100 / n);
    const remainder = 100 - equalWeight * n;
    const newWeights = {};
    portfolio.assets.forEach((a, i) => {
      newWeights[a.symbol] = equalWeight + (i === 0 ? remainder : 0);
    });
    setWeights(newWeights);
  }, [portfolio]);

  const gradeColor = GRADE_COLORS[gradeResult.grade] || '#484f58';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a78bfa, #4f8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Portfolio Optimizer</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Drag sliders to adjust weights — AI grades your allocation in real-time</p>
          </div>
        </div>
      </div>

      {!portfolio?.assets ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '80px 48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <Target style={{ width: '40px', height: '40px', color: '#4f8cff', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Portfolio Yet</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Run a simulation from the Dashboard to create a portfolio first</p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          {/* Asset Weight Sliders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 style={{ width: '14px', height: '14px', color: '#4f8cff' }} /> Asset Weights
              </span>
              <button onClick={optimizeWeights} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', background: 'rgba(79,140,255,0.1)', border: '1px solid rgba(79,140,255,0.15)', color: '#4f8cff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                <Zap style={{ width: '12px', height: '12px' }} /> Auto-Optimize
              </button>
            </div>

            {portfolio.assets.map((asset, idx) => {
              const w = weights[asset.symbol] || 0;
              const live = assets.find(m => m.symbol === asset.symbol);
              return (
                <motion.div key={asset.symbol} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + idx * 0.05 }} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <GripVertical style={{ width: '12px', height: '12px', color: 'var(--color-text-dim)', cursor: 'grab' }} />
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${asset.color}15`, color: asset.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{asset.symbol}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginLeft: '8px' }}>{asset.name}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {live ? formatCurrency(live.price) : '—'}
                      </span>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums', minWidth: '42px', textAlign: 'right' }}>{w}%</span>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={w} onChange={(e) => handleWeightChange(asset.symbol, e.target.value)} style={{ width: '100%', background: `linear-gradient(90deg, ${asset.color} ${w}%, rgba(255,255,255,0.06) ${w}%)` }} />
                </motion.div>
              );
            })}

            {/* Total Weight */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: totalWeight === 100 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${totalWeight === 100 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`, marginTop: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Total Allocation</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: totalWeight === 100 ? '#22c55e' : '#ef4444' }}>
                {totalWeight}%
                {totalWeight !== 100 && <AlertTriangle style={{ width: '14px', height: '14px', marginLeft: '6px', display: 'inline' }} />}
              </span>
            </div>
          </motion.div>

          {/* AI Grade Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Grade Card */}
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2 }} style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', borderRadius: '50%', background: gradeColor, filter: 'blur(60px)', opacity: 0.08 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>AI Grade</span>
              <motion.div key={gradeResult.grade} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} style={{ fontSize: '72px', fontWeight: 800, color: gradeColor, lineHeight: 1, margin: '16px 0' }}>
                {gradeResult.grade}
              </motion.div>
              <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${gradeResult.score}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${gradeColor}, ${gradeColor}88)` }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px', display: 'block' }}>{gradeResult.score}/100 Score</span>
            </motion.div>

            {/* Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Shield style={{ width: '14px', height: '14px', color: '#a78bfa' }} /> Score Breakdown
              </span>
              {[
                { label: 'Diversification', value: gradeResult.breakdown.diversification || 0, color: '#4f8cff', icon: PieChart },
                { label: 'Concentration', value: gradeResult.breakdown.concentration || 0, color: '#22c55e', icon: Target },
                { label: 'Sector Spread', value: gradeResult.breakdown.sectorDiversification || 0, color: '#a78bfa', icon: BarChart3 },
              ].map((item, idx) => (
                <div key={item.label} style={{ marginBottom: idx < 2 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <item.icon style={{ width: '12px', height: '12px', color: item.color }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }} style={{ height: '100%', borderRadius: '999px', background: item.color }} />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* AI Suggestions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles style={{ width: '14px', height: '14px', color: '#f59e0b' }} /> AI Suggestions
              </span>
              {[
                { text: 'Consider adding uncorrelated assets like GOLD to reduce risk', icon: '🛡️' },
                { text: 'No single asset should exceed 30% allocation', icon: '⚖️' },
                { text: 'Add emerging market exposure for growth potential', icon: '🌍' },
              ].map((tip, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', marginBottom: idx < 2 ? '8px' : 0 }}>
                  <span style={{ fontSize: '16px' }}>{tip.icon}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
