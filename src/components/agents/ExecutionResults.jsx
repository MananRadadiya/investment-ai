import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default function ExecutionResults({ data }) {
  if (!data) return null;

  const { trades, totalAllocated, totalInvestment, totalFees, totalSlippage, filledCount, totalTrades, executionTime, fillRate, projections } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { icon: DollarSign, label: 'Allocated', value: `$${(totalAllocated || 0).toLocaleString()}`, color: '#4f8cff' },
          { icon: CheckCircle, label: 'Fill Rate', value: `${fillRate || 0}%`, color: (fillRate || 0) > 95 ? '#22c55e' : '#f59e0b' },
          { icon: Clock, label: 'Exec Time', value: executionTime || '—', color: '#a78bfa' },
          { icon: TrendingUp, label: 'Trades', value: `${filledCount || 0}/${totalTrades || 0}`, color: '#22c55e' },
        ].map((stat) => (
          <div key={stat.label} style={{ padding: '14px', borderRadius: '14px', background: 'var(--color-surface)', textAlign: 'center' }}>
            <stat.icon style={{ width: '16px', height: '16px', color: stat.color, margin: '0 auto 6px' }} />
            <p style={{ fontSize: '14px', fontWeight: 700, color: stat.color, marginBottom: '2px' }}>{stat.value}</p>
            <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Fees</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>${(totalFees || 0).toFixed(2)}</span>
        </div>
        <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(245,158,11,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Slippage</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>${(totalSlippage || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Trade Table */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>Trade Execution Log</p>
        <div style={{ maxHeight: '220px', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                {['Asset', 'Action', 'Units', 'Fill Price', 'Amount', 'Fee', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-dim)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(trades || []).slice(0, 12).map((trade, i) => (
                <motion.tr
                  key={trade.symbol}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: trade.color || '#4f8cff' }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{trade.symbol}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '10px', fontWeight: 700 }}>BUY</span>
                  </td>
                  <td style={{ padding: '9px 10px', color: 'var(--color-text-muted)' }}>{trade.units?.toFixed(2)}</td>
                  <td style={{ padding: '9px 10px', color: 'var(--color-text-muted)' }}>${trade.fillPrice?.toLocaleString()}</td>
                  <td style={{ padding: '9px 10px', fontWeight: 600, color: 'var(--color-text)' }}>${trade.amount?.toLocaleString()}</td>
                  <td style={{ padding: '9px 10px', color: '#ef4444', fontSize: '10px' }}>${trade.fee?.toFixed(2)}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '999px',
                        background: trade.status === 'filled' ? '#22c55e' : '#f59e0b',
                      }} />
                      <span style={{ fontSize: '10px', color: trade.status === 'filled' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize', fontWeight: 600 }}>
                        {trade.status}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {(trades || []).length > 12 && (
            <div style={{ padding: '8px', textAlign: 'center', fontSize: '10px', color: 'var(--color-text-dim)' }}>
              + {trades.length - 12} more trades
            </div>
          )}
        </div>
      </div>

      {/* P&L Projections */}
      {projections && (
        <div>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '10px' }}>P&L Projections (Simulated)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { label: '1 Day', value: projections.day1 },
              { label: '1 Week', value: projections.week1 },
              { label: '1 Month', value: projections.month1 },
              { label: '3 Months', value: projections.month3 },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                style={{
                  padding: '12px', borderRadius: '12px', textAlign: 'center',
                  background: p.value > 0 ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                  border: `1px solid ${p.value > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}`,
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 700, color: p.value > 0 ? '#22c55e' : '#ef4444', marginBottom: '4px' }}>
                  {p.value > 0 ? '+' : ''}${Math.abs(p.value).toLocaleString()}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 600 }}>{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
