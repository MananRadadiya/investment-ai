import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';

export default function RiskResults({ data }) {
  if (!data) return null;

  const { riskScore, riskLevel, volatility, maxDrawdown, sharpeRatio, valueAtRisk, beta, concentrationRisk, categoryRisk, recommendation } = data;

  const riskColor = riskScore > 70 ? '#ef4444' : riskScore > 40 ? '#f59e0b' : '#22c55e';
  const riskLabel = riskScore > 70 ? 'High Risk' : riskScore > 40 ? 'Moderate' : 'Low Risk';

  // Circular gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (riskScore / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Risk Score Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ width: '130px', height: '130px', transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r={radius} fill="none" stroke={riskColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ fontSize: '28px', fontWeight: 800, color: riskColor, lineHeight: 1 }}
            >{riskScore}</motion.p>
            <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>/100</p>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ padding: '4px 10px', borderRadius: '999px', background: `${riskColor}15`, color: riskColor, fontSize: '11px', fontWeight: 700 }}>
              {riskLabel}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>({riskLevel})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Sharpe Ratio', value: sharpeRatio, color: sharpeRatio > 1 ? '#22c55e' : '#f59e0b' },
              { label: 'Beta', value: beta, color: '#4f8cff' },
              { label: 'Volatility', value: `${volatility}%`, color: '#a78bfa' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { icon: TrendingDown, label: 'Max Drawdown', value: `-${maxDrawdown}%`, color: '#ef4444' },
          { icon: AlertTriangle, label: 'VaR (95%)', value: `$${valueAtRisk?.toLocaleString()}`, color: '#f59e0b' },
          { icon: Shield, label: 'Concentration', value: `${concentrationRisk}%`, color: concentrationRisk > 50 ? '#ef4444' : '#22c55e' },
        ].map((metric) => (
          <div key={metric.label} style={{ padding: '14px', borderRadius: '14px', background: 'var(--color-surface)', textAlign: 'center' }}>
            <metric.icon style={{ width: '16px', height: '16px', color: metric.color, margin: '0 auto 8px' }} />
            <p style={{ fontSize: '14px', fontWeight: 700, color: metric.color, marginBottom: '4px' }}>{metric.value}</p>
            <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Risk by Category */}
      {categoryRisk && categoryRisk.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Risk Contribution</p>
          {categoryRisk.map((cat, i) => (
            <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', width: '70px', flexShrink: 0, textTransform: 'capitalize' }}>{cat.category}</span>
              <div style={{ flex: 1, height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.riskContribution}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  style={{ height: '100%', borderRadius: '999px', background: cat.riskContribution > 35 ? '#ef4444' : cat.riskContribution > 20 ? '#f59e0b' : '#22c55e' }}
                />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', width: '35px', textAlign: 'right' }}>{cat.riskContribution}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          padding: '14px 16px', borderRadius: '12px',
          background: recommendation === 'reduce exposure' ? 'rgba(239,68,68,0.06)' : recommendation === 'increase exposure' ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)',
          border: `1px solid ${recommendation === 'reduce exposure' ? 'rgba(239,68,68,0.12)' : recommendation === 'increase exposure' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)'}`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <Shield style={{ width: '16px', height: '16px', color: recommendation === 'reduce exposure' ? '#ef4444' : recommendation === 'increase exposure' ? '#22c55e' : '#f59e0b', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text)', textTransform: 'capitalize' }}>Recommendation: {recommendation}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Based on risk score of {riskScore}/100 with {riskLevel} tolerance
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
