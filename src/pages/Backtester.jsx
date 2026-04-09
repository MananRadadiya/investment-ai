import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { History, TrendingUp, BarChart3, Target, DollarSign } from 'lucide-react';

export default function Backtester() {
  const assets = useMarketData();
  const [amount, setAmount] = useState(10000);
  const [period, setPeriod] = useState(365);
  const [selectedAssets, setSelectedAssets] = useState(['BTC', 'ETH', 'SPY']);

  const result = useMemo(() => {
    const days = period;
    const perAsset = amount / selectedAssets.length;
    const data = [];
    let portfolioValue = amount;
    let spyValue = amount;
    const now = Date.now();

    for (let i = days; i >= 0; i--) {
      const dayProgress = (days - i) / days;
      // Simulated growth with volatility
      const dailyReturn = (Math.random() - 0.46) * 0.025;
      const spyDailyReturn = (Math.random() - 0.47) * 0.015;
      portfolioValue *= (1 + dailyReturn);
      spyValue *= (1 + spyDailyReturn);

      data.push({
        date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        portfolio: +portfolioValue.toFixed(2),
        benchmark: +spyValue.toFixed(2),
      });
    }

    const finalValue = data[data.length - 1].portfolio;
    const benchmarkFinal = data[data.length - 1].benchmark;
    const totalReturn = ((finalValue - amount) / amount) * 100;
    const benchmarkReturn = ((benchmarkFinal - amount) / amount) * 100;
    const cagr = (Math.pow(finalValue / amount, 365 / days) - 1) * 100;
    const maxDrawdown = -(Math.random() * 15 + 5);
    const sharpe = 1.2 + Math.random() * 1.5;
    const winRate = 55 + Math.random() * 20;

    return { data, finalValue, totalReturn, cagr, maxDrawdown, sharpe: +sharpe.toFixed(2), winRate: +winRate.toFixed(1), benchmarkReturn: +benchmarkReturn.toFixed(2), alpha: +(totalReturn - benchmarkReturn).toFixed(2) };
  }, [amount, period, selectedAssets]);

  const toggleAsset = (symbol) => {
    setSelectedAssets(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4f8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfolio Backtester</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>"If I'd invested ${amount.toLocaleString()} — what would it be worth?"</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Investment Amount</span>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            {[5000, 10000, 25000, 50000, 100000].map(a => (
              <button key={a} onClick={() => setAmount(a)} style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', background: amount === a ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: amount === a ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
                ${(a / 1000)}K
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Time Period</span>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            {[{ l: '3M', d: 90 }, { l: '6M', d: 180 }, { l: '1Y', d: 365 }, { l: '3Y', d: 1095 }, { l: '5Y', d: 1825 }].map(t => (
              <button key={t.l} onClick={() => setPeriod(t.d)} style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', background: period === t.d ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: period === t.d ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset selection */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {assets.slice(0, 16).map(a => (
          <button key={a.symbol} onClick={() => toggleAsset(a.symbol)}
            style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', background: selectedAssets.includes(a.symbol) ? `${a.color}20` : 'rgba(255,255,255,0.04)', color: selectedAssets.includes(a.symbol) ? a.color : 'var(--color-text-dim)' }}>
            {a.symbol}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Final Value', value: formatCurrency(result.finalValue), color: '#22c55e' },
          { label: 'Total Return', value: formatPercent(result.totalReturn), color: result.totalReturn >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'CAGR', value: formatPercent(result.cagr), color: '#4f8cff' },
          { label: 'Max Drawdown', value: formatPercent(result.maxDrawdown), color: '#ef4444' },
          { label: 'Sharpe Ratio', value: result.sharpe.toString(), color: '#a78bfa' },
          { label: 'Alpha', value: `${result.alpha > 0 ? '+' : ''}${result.alpha}%`, color: result.alpha >= 0 ? '#22c55e' : '#ef4444' },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>{m.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: m.color }}>{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Equity Curve */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Equity Curve vs Benchmark (S&P 500)</span>
        <div style={{ height: '280px', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.data.filter((_, i) => i % Math.ceil(result.data.length / 200) === 0)}>
              <defs>
                <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={0.2} /><stop offset="100%" stopColor="#4f8cff" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} interval={Math.ceil(result.data.length / 8)} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip content={({ active, payload }) => active && payload?.length ? (<div style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}><p style={{ fontSize: '11px', fontWeight: 600, color: '#4f8cff' }}>Portfolio: {formatCurrency(payload[0]?.value)}</p><p style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa' }}>S&P 500: {formatCurrency(payload[1]?.value)}</p></div>) : null} />
              <Area type="monotone" dataKey="portfolio" stroke="#4f8cff" fill="url(#backGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="benchmark" stroke="#a78bfa" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
