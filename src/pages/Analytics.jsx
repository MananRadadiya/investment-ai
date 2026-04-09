import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { generateMonthlyReturns, getSectorBreakdown } from '../data/marketData';
import { portfolioSnapshots } from '../data/userData';
import { fearGreedIndex } from '../data/socialData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Shield, Target, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div style={{ background: 'var(--color-tooltip-bg)', backdropFilter: 'blur(16px)', borderRadius: '10px', padding: '10px 14px', border: '1px solid var(--color-border)' }}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>{typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}</p>
    </div>
  );
};

export default function Analytics() {
  const assets = useMarketData();
  const monthlyReturns = useMemo(() => generateMonthlyReturns(), []);
  const sectorData = useMemo(() => getSectorBreakdown(assets), [assets]);

  // Risk-Return scatter data
  const scatterData = useMemo(() => assets.slice(0, 20).map((a) => ({
    name: a.symbol,
    risk: +(Math.abs(a.changePercent) * 3 + Math.random() * 10).toFixed(1),
    return: +(a.changePercent * 5 + (Math.random() - 0.3) * 20).toFixed(1),
    color: a.color,
  })), [assets]);

  // Portfolio performance
  const last30 = portfolioSnapshots.slice(-30);

  // Metric cards
  const metrics = [
    { label: 'Sharpe Ratio', value: '1.84', change: '+0.12', positive: true, icon: Activity, color: '#4f8cff' },
    { label: 'Sortino Ratio', value: '2.31', change: '+0.08', positive: true, icon: Shield, color: '#22c55e' },
    { label: 'Max Drawdown', value: '-12.4%', change: '-1.2%', positive: false, icon: TrendingDown, color: '#ef4444' },
    { label: 'Win Rate', value: '73.2%', change: '+2.1%', positive: true, icon: Target, color: '#f59e0b' },
    { label: 'Calmar Ratio', value: '3.42', change: '+0.34', positive: true, icon: Zap, color: '#a78bfa' },
    { label: 'Beta', value: '0.87', change: '-0.05', positive: true, icon: TrendingUp, color: '#14b8a6' },
  ];

  // Fear & Greed gauge
  const fgValue = fearGreedIndex.value;
  const fgColor = fgValue >= 75 ? '#ef4444' : fgValue >= 55 ? '#22c55e' : fgValue >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Deep portfolio insights and market analysis</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {metrics.map((m, idx) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="panel" style={{ padding: '20px' }}>
            <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}15`, marginBottom: '12px' }}>
              <m.icon style={{ width: '16px', height: '16px', color: m.color }} />
            </div>
            <p className="text-xl font-semibold tracking-tight">{m.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>{m.label}</p>
            <span className="text-xs font-medium" style={{ color: m.positive ? 'var(--color-green)' : 'var(--color-red)', marginTop: '4px', display: 'inline-block' }}>{m.change}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Portfolio Drawdown Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Portfolio Performance (30 Days)</span>
          <div style={{ height: '220px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last30}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} interval={6} tickFormatter={(v) => { const d = new Date(v); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#4f8cff" fill="url(#perfGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk-Return Scatter */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Risk vs Return (Assets)</span>
          <div style={{ height: '220px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <XAxis dataKey="risk" name="Risk" tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} label={{ value: 'Risk %', position: 'bottom', fontSize: 10, fill: 'var(--color-text-dim)' }} />
                <YAxis dataKey="return" name="Return" tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} label={{ value: 'Return %', angle: -90, position: 'left', fontSize: 10, fill: 'var(--color-text-dim)' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => active && payload?.[0] ? (
                  <div style={{ background: 'var(--color-tooltip-bg)', backdropFilter: 'blur(16px)', borderRadius: '10px', padding: '10px 14px', border: '1px solid var(--color-border)' }}>
                    <p className="text-xs font-semibold">{payload[0].payload.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Risk: {payload[0].payload.risk}% · Return: {payload[0].payload.return}%</p>
                  </div>
                ) : null} />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} fillOpacity={0.8} r={6} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '20px', marginBottom: '20px' }}>
        {/* Sector Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Sector Performance</span>
          <div style={{ height: '220px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgChange" radius={[0, 6, 6, 0]} barSize={14}>
                  {sectorData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.avgChange >= 0 ? '#22c55e' : '#ef4444'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Returns Heatmap */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Monthly Returns Heatmap</span>
          <div style={{ marginTop: '16px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px' }}>
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m) => (
                <div key={m} className="text-xs text-center" style={{ color: 'var(--color-text-dim)', fontSize: '9px', padding: '4px 0' }}>{m}</div>
              ))}
              {monthlyReturns.map((d, idx) => {
                const intensity = Math.min(Math.abs(d.return) / 10, 1);
                const bg = d.return >= 0 ? `rgba(34, 197, 94, ${intensity * 0.6 + 0.1})` : `rgba(239, 68, 68, ${intensity * 0.6 + 0.1})`;
                return (
                  <div key={idx} title={`${d.month} ${d.year}: ${d.return > 0 ? '+' : ''}${d.return}%`}
                    style={{ aspectRatio: '1', borderRadius: '4px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer' }}>
                    {Math.abs(d.return) > 5 ? `${d.return > 0 ? '+' : ''}${d.return}` : ''}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center" style={{ gap: '16px', marginTop: '12px' }}>
              {[2022, 2023, 2024, 2025, 2026].map((y) => (
                <span key={y} className="text-xs" style={{ color: 'var(--color-text-dim)', fontSize: '9px' }}>{y}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fear & Greed Index */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Fear & Greed Index</span>
          <div className="flex flex-col items-center" style={{ marginTop: '24px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-surface-active)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={fgColor} strokeWidth="8"
                  strokeDasharray={`${(fgValue / 100) * 327} 327`}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-2xl font-bold" style={{ color: fgColor }}>{fgValue}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{fearGreedIndex.label}</span>
              </div>
            </div>
            <div style={{ marginTop: '20px', width: '100%' }}>
              {Object.entries(fearGreedIndex.components).map(([key, comp]) => (
                <div key={key} className="flex items-center justify-between" style={{ padding: '6px 0' }}>
                  <span className="text-xs capitalize" style={{ color: 'var(--color-text-dim)' }}>{key}</span>
                  <span className="text-xs font-semibold">{comp.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
