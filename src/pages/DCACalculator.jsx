import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency } from '../utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Repeat, DollarSign } from 'lucide-react';

export default function DCACalculator() {
  const assets = useMarketData();
  const [symbol, setSymbol] = useState('BTC');
  const [amount, setAmount] = useState(500);
  const [frequency, setFrequency] = useState('monthly');
  const [months, setMonths] = useState(12);

  const result = useMemo(() => {
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset) return null;
    const intervalsPerMonth = frequency === 'weekly' ? 4.33 : frequency === 'biweekly' ? 2.17 : 1;
    const totalIntervals = Math.round(months * intervalsPerMonth);
    const data = [];
    let totalInvested = 0, totalUnits = 0, lumpSumValue = 0;
    const basePrice = asset.price;

    for (let i = 0; i <= totalIntervals; i++) {
      const progress = i / totalIntervals;
      const priceVariation = Math.sin(progress * Math.PI * 4) * 0.15 + (Math.random() - 0.48) * 0.08;
      const currentPrice = basePrice * (1 + priceVariation + progress * 0.1);
      if (i > 0) {
        totalInvested += amount;
        totalUnits += amount / currentPrice;
      }
      if (i === 0) { lumpSumValue = totalIntervals * amount; }
      const dcaValue = totalUnits * currentPrice;
      const lumpUnits = (totalIntervals * amount) / basePrice;
      const lumpVal = lumpUnits * currentPrice;

      data.push({
        period: i,
        invested: totalInvested,
        dcaValue: +dcaValue.toFixed(2),
        lumpSum: +lumpVal.toFixed(2),
        price: +currentPrice.toFixed(2),
        label: `${frequency === 'weekly' ? 'W' : frequency === 'biweekly' ? 'Bi' : 'M'}${i}`,
      });
    }

    const lastRow = data[data.length - 1];
    const avgCost = totalInvested / totalUnits;
    return {
      data, totalInvested, currentValue: lastRow.dcaValue, totalUnits: +totalUnits.toFixed(6),
      avgCost: +avgCost.toFixed(2), gain: lastRow.dcaValue - totalInvested,
      gainPercent: ((lastRow.dcaValue - totalInvested) / totalInvested * 100),
      lumpSumValue: lastRow.lumpSum, lumpSumGain: lastRow.lumpSum - totalInvested,
    };
  }, [symbol, amount, frequency, months, assets]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #14b8a6, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #14b8a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DCA Calculator</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Dollar-Cost Averaging simulator — DCA vs Lump Sum</p>
          </div>
        </div>
      </div>

      {/* Config */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '8px' }}>Asset</span>
          <select value={symbol} onChange={e => setSymbol(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px' }}>
            {assets.slice(0, 20).map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
          </select>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '8px' }}>Amount per Interval</span>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px' }} />
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '8px' }}>Frequency</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {['weekly', 'biweekly', 'monthly'].map(f => (
              <button key={f} onClick={() => setFrequency(f)} style={{ flex: 1, padding: '6px 4px', borderRadius: '6px', fontSize: '9px', fontWeight: 600, border: 'none', cursor: 'pointer', textTransform: 'capitalize', background: frequency === f ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: frequency === f ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '8px' }}>Duration (months)</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[6, 12, 24, 36].map(m => (
              <button key={m} onClick={() => setMonths(m)} style={{ flex: 1, padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', background: months === m ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: months === m ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>{m}M</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Total Invested', value: formatCurrency(result.totalInvested), color: '#4f8cff' },
              { label: 'DCA Value', value: formatCurrency(result.currentValue), color: '#22c55e' },
              { label: 'DCA Gain', value: `${result.gain >= 0 ? '+' : ''}${formatCurrency(result.gain)}`, color: result.gain >= 0 ? '#22c55e' : '#ef4444' },
              { label: 'Avg Cost Basis', value: formatCurrency(result.avgCost), color: '#a78bfa' },
            ].map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>{m.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>DCA vs Lump Sum vs Invested</span>
            <div style={{ height: '260px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.data}>
                  <defs>
                    <linearGradient id="dcaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} interval={Math.ceil(result.data.length / 10)} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={({ active, payload }) => active && payload?.length ? (<div style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}><p style={{ fontSize: '11px', color: '#22c55e' }}>DCA: {formatCurrency(payload[0]?.value)}</p><p style={{ fontSize: '11px', color: '#f59e0b' }}>Lump: {formatCurrency(payload[1]?.value)}</p><p style={{ fontSize: '11px', color: '#4f8cff' }}>Invested: {formatCurrency(payload[2]?.value)}</p></div>) : null} />
                  <Area type="monotone" dataKey="dcaValue" stroke="#22c55e" fill="url(#dcaGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="lumpSum" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="invested" stroke="#4f8cff" fill="none" strokeWidth={1} strokeDasharray="2 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
