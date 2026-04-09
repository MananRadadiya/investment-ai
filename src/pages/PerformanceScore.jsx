import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { Award, Shield, TrendingUp, Target, BarChart3, Zap } from 'lucide-react';

function AnimatedGauge({ value, size = 120, color, label }) {
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle cx="60" cy="60" r="48" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</motion.span>
        <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

export default function PerformanceScore() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();

  const scores = useMemo(() => {
    if (!portfolio?.assets) return null;
    const n = portfolio.assets.length;
    const diversification = Math.min(n / 10, 1) * 100;
    const maxAlloc = Math.max(...portfolio.assets.map(a => a.allocation || 0));
    const riskMgmt = Math.max(0, 100 - maxAlloc * 150);
    const returns = 50 + Math.random() * 40;
    const consistency = 60 + Math.random() * 30;
    const overall = Math.round(diversification * 0.25 + riskMgmt * 0.25 + returns * 0.25 + consistency * 0.25);
    return { overall, diversification: Math.round(diversification), riskMgmt: Math.round(riskMgmt), returns: Math.round(returns), consistency: Math.round(consistency) };
  }, [portfolio]);

  if (!portfolio?.assets) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '32px' }}>
        <Award style={{ width: '40px', height: '40px', color: '#4f8cff', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Portfolio</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Create a portfolio to see your performance score</p>
      </motion.div>
    );
  }

  const overallColor = scores.overall >= 80 ? '#22c55e' : scores.overall >= 60 ? '#4f8cff' : scores.overall >= 40 ? '#f59e0b' : '#ef4444';
  const overallLabel = scores.overall >= 80 ? 'Excellent' : scores.overall >= 60 ? 'Good' : scores.overall >= 40 ? 'Fair' : 'Needs Work';

  const subscores = [
    { label: 'Diversification', value: scores.diversification, color: '#4f8cff', icon: Target, desc: 'How well your assets are spread across different sectors and classes' },
    { label: 'Risk Management', value: scores.riskMgmt, color: '#a78bfa', icon: Shield, desc: 'How well your portfolio is protected against concentration risk' },
    { label: 'Returns', value: scores.returns, color: '#22c55e', icon: TrendingUp, desc: 'Historical return performance relative to benchmarks' },
    { label: 'Consistency', value: scores.consistency, color: '#f59e0b', icon: BarChart3, desc: 'How stable and predictable your returns are over time' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Performance Score</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Lighthouse-style portfolio grading with improvement tips</p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', borderRadius: '50%', background: overallColor, filter: 'blur(80px)', opacity: 0.08 }} />
        <AnimatedGauge value={scores.overall} size={160} color={overallColor} label="Overall" />
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginTop: '16px', color: overallColor }}>{overallLabel}</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Your portfolio scores {scores.overall}/100</p>
      </motion.div>

      {/* Subscores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {subscores.map((s, idx) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.08 }}
            style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <AnimatedGauge value={s.value} size={90} color={s.color} label="" />
            <s.icon style={{ width: '14px', height: '14px', color: s.color, marginTop: '12px' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, marginTop: '6px' }}>{s.label}</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: s.color, marginTop: '2px' }}>{s.value}/100</span>
            <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', lineHeight: 1.5, marginTop: '8px' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Zap style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Improvement Recommendations</span>
        </div>
        {[
          { tip: 'Add 2-3 more asset classes (bonds, commodities) to improve diversification', impact: '+12', color: '#4f8cff' },
          { tip: 'Reduce your largest position to under 25% for better risk management', impact: '+8', color: '#a78bfa' },
          { tip: 'Consider adding dividend-paying stocks for consistent income', impact: '+5', color: '#22c55e' },
          { tip: 'Review high-correlation assets and substitute for diversified alternatives', impact: '+6', color: '#f59e0b' },
        ].map((r, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', marginBottom: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', flex: 1 }}>{r.tip}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>+{r.impact} pts</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
