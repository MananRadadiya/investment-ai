import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePaperTrading } from '../hooks/usePaperTrading';
import { useMarketData } from '../hooks/useMarketData';
import { generatePnLHistory } from '../data/paperTradingData';
import { formatCurrency } from '../utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, TrendingUp, TrendingDown, Wallet, RotateCcw, X } from 'lucide-react';

export default function PaperTrading() {
  const { balance, orders, positions, placeOrder, cancelOrder, resetTrading, totalEquity } = usePaperTrading();
  const assets = useMarketData();
  const [orderForm, setOrderForm] = useState({ symbol: 'BTC', side: 'buy', type: 'market', quantity: '', price: '' });
  const [tab, setTab] = useState('positions');
  const pnlHistory = useMemo(() => generatePnLHistory(30), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const asset = assets.find(a => a.symbol === orderForm.symbol);
    if (!asset || !orderForm.quantity) return;
    const price = orderForm.type === 'market' ? asset.price : Number(orderForm.price);
    if (!price) return;
    placeOrder({ symbol: orderForm.symbol, side: orderForm.side, type: orderForm.type, quantity: Number(orderForm.quantity), price, color: asset.color });
    setOrderForm(prev => ({ ...prev, quantity: '', price: '' }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #4f8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #22c55e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Paper Trading</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Practice trading with simulated orders and track P&L</p>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Cash Balance', value: formatCurrency(balance), color: '#4f8cff', icon: Wallet },
          { label: 'Total Equity', value: formatCurrency(totalEquity), color: '#22c55e', icon: TrendingUp },
          { label: 'Open Positions', value: positions.length, color: '#a78bfa', icon: ShoppingCart },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ flex: 1, minWidth: '180px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <s.icon style={{ width: '16px', height: '16px', color: s.color, marginBottom: '8px' }} />
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, marginTop: '2px' }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        {/* Order Form */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Place Order</span>
            <button onClick={resetTrading} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
              <RotateCcw style={{ width: '10px', height: '10px' }} /> Reset
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Side toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '3px' }}>
              {['buy', 'sell'].map(s => (
                <button key={s} type="button" onClick={() => setOrderForm(p => ({ ...p, side: s }))}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', background: orderForm.side === s ? (s === 'buy' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent', color: orderForm.side === s ? (s === 'buy' ? '#22c55e' : '#ef4444') : 'var(--color-text-dim)' }}>
                  {s}
                </button>
              ))}
            </div>
            <select value={orderForm.symbol} onChange={(e) => setOrderForm(p => ({ ...p, symbol: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }}>
              {assets.slice(0, 20).map(a => <option key={a.symbol} value={a.symbol}>{a.symbol} — {formatCurrency(a.price)}</option>)}
            </select>
            <select value={orderForm.type} onChange={(e) => setOrderForm(p => ({ ...p, type: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }}>
              {['market', 'limit', 'stop-loss'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Quantity" value={orderForm.quantity} onChange={(e) => setOrderForm(p => ({ ...p, quantity: e.target.value }))} step="any" min="0"
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }} />
            {orderForm.type !== 'market' && (
              <input type="number" placeholder="Price" value={orderForm.price} onChange={(e) => setOrderForm(p => ({ ...p, price: e.target.value }))} step="any" min="0"
                style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }} />
            )}
            <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', background: orderForm.side === 'buy' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {orderForm.side === 'buy' ? 'Buy' : 'Sell'} {orderForm.symbol}
            </button>
          </form>
        </motion.div>

        {/* Main Panel */}
        <div>
          {/* P&L Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>P&L History</span>
            <div style={{ height: '160px', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlHistory}>
                  <defs><linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={0.3} /><stop offset="100%" stopColor="#4f8cff" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} interval={6} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-dim)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 0 ? '' : ''}${(v/1000).toFixed(1)}K`} />
                  <Tooltip content={({ active, payload }) => active && payload?.[0] ? (<div style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '8px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}><p style={{ fontSize: '11px', fontWeight: 600, color: '#e6edf3' }}>{formatCurrency(payload[0].value)}</p></div>) : null} />
                  <Area type="monotone" dataKey="pnl" stroke="#4f8cff" fill="url(#pnlGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {['positions', 'orders'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: tab === t ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: tab === t ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
                {t} ({t === 'positions' ? positions.length : orders.length})
              </button>
            ))}
          </div>

          {tab === 'positions' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {positions.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-text-dim)', padding: '24px' }}>No open positions</p> : positions.map((p, i) => {
                const live = assets.find(a => a.symbol === p.symbol);
                const currentPrice = live?.price || p.avgPrice;
                const pnl = ((currentPrice - p.avgPrice) / p.avgPrice * 100);
                const value = p.quantity * currentPrice;
                return (
                  <div key={p.symbol} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: i < positions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{p.symbol.slice(0, 2)}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 600 }}>{p.symbol}</div><div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Qty: {p.quantity} · Avg: {formatCurrency(p.avgPrice)}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '13px', fontWeight: 600 }}>{formatCurrency(value)}</div><div style={{ fontSize: '11px', fontWeight: 600, color: pnl >= 0 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>{pnl >= 0 ? <TrendingUp style={{ width: '10px', height: '10px' }} /> : <TrendingDown style={{ width: '10px', height: '10px' }} />}{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%</div></div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'none' }}>
              {orders.slice(0, 20).map((o, i) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 19 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: o.side === 'buy' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: o.side === 'buy' ? '#22c55e' : '#ef4444', textTransform: 'uppercase' }}>{o.side}</span>
                  <div style={{ flex: 1 }}><span style={{ fontSize: '12px', fontWeight: 600 }}>{o.symbol}</span><span style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginLeft: '6px' }}>{o.type} · {o.quantity}</span></div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>{formatCurrency(o.total)}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: o.status === 'filled' ? 'rgba(34,197,94,0.1)' : o.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: o.status === 'filled' ? '#22c55e' : o.status === 'pending' ? '#f59e0b' : '#ef4444' }}>{o.status}</span>
                  {o.status === 'pending' && <button onClick={() => cancelOrder(o.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}><X style={{ width: '12px', height: '12px' }} /></button>}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
