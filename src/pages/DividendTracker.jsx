import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { dividendData } from '../data/educationData';
import { formatCurrency } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Calendar, TrendingUp, Repeat } from 'lucide-react';

export default function DividendTracker() {
  const assets = useMarketData();

  const dividendAssets = useMemo(() => {
    return Object.entries(dividendData).filter(([, d]) => d.yield > 0).map(([symbol, d]) => {
      const asset = assets.find(a => a.symbol === symbol);
      return { symbol, ...d, name: asset?.name || symbol, price: asset?.price || 0, color: asset?.color || '#4f8cff', annualIncome: asset ? (asset.price * d.yield / 100) : 0 };
    }).sort((a, b) => b.yield - a.yield);
  }, [assets]);

  const totalAnnualIncome = useMemo(() => dividendAssets.reduce((s, a) => s + a.annualIncome * 10, 0), [dividendAssets]);

  const historyChart = useMemo(() => {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];
    return quarters.map((q, i) => ({ quarter: q, income: +(totalAnnualIncome / 4 * (0.85 + i * 0.06 + Math.random() * 0.1)).toFixed(2) }));
  }, [totalAnnualIncome]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #22c55e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dividend Tracker</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Track dividend payments, yields, and reinvestment projections</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Annual Income', value: formatCurrency(totalAnnualIncome), color: '#22c55e', icon: DollarSign },
          { label: 'Dividend Stocks', value: dividendAssets.length.toString(), color: '#4f8cff', icon: TrendingUp },
          { label: 'Avg Yield', value: `${(dividendAssets.reduce((s, a) => s + a.yield, 0) / dividendAssets.length).toFixed(2)}%`, color: '#a78bfa', icon: Repeat },
          { label: 'Next Payment', value: 'Apr 20', color: '#f59e0b', icon: Calendar },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ flex: 1, minWidth: '160px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <s.icon style={{ width: '14px', height: '14px', color: s.color, marginBottom: '6px' }} />
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, marginTop: '2px' }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Income Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Dividend Income by Quarter</span>
          <div style={{ height: '220px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyChart}>
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={({ active, payload }) => active && payload?.[0] ? (<div style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}><p style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e' }}>{formatCurrency(payload[0].value)}</p></div>) : null} />
                <Bar dataKey="income" radius={[6, 6, 0, 0]} barSize={32}>
                  {historyChart.map((_, i) => <Cell key={i} fill="#22c55e" fillOpacity={0.6 + i * 0.07} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dividend Assets */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '380px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '16px' }}>Dividend-Paying Assets</span>
          {dividendAssets.map((a, idx) => (
            <motion.div key={a.symbol} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: idx < dividendAssets.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{a.symbol.slice(0, 2)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.symbol}<span style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginLeft: '6px' }}>{a.name}</span></div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>{a.frequency} · Ex: {a.exDate || 'N/A'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{a.yield}%</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>${a.lastPayment}/share</div>
              </div>
              {/* Mini history */}
              <svg width="48" height="20" style={{ overflow: 'visible' }}>
                {a.history.map((v, i) => {
                  const max = Math.max(...a.history);
                  const h = max > 0 ? (v / max) * 18 : 0;
                  return <rect key={i} x={i * 6} y={20 - h} width="4" height={h} rx="1" fill="#22c55e" fillOpacity={0.4 + (i / a.history.length) * 0.5} />;
                })}
              </svg>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
