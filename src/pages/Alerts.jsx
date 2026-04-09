import { useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Plus, Trash2, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { priceAlerts } from '../data/userData';
import { formatCurrency } from '../utils/format';

export default function Alerts() {
  const [alerts, setAlerts] = useState(priceAlerts);
  const [showAdd, setShowAdd] = useState(false);
  const [newAlert, setNewAlert] = useState({ symbol: 'BTC', condition: 'above', price: '' });

  const toggleActive = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const addAlert = () => {
    if (!newAlert.price) return;
    setAlerts((prev) => [...prev, { id: Date.now(), symbol: newAlert.symbol, condition: newAlert.condition, price: parseFloat(newAlert.price), active: true, triggered: false }]);
    setNewAlert({ symbol: 'BTC', condition: 'above', price: '' });
    setShowAdd(false);
  };

  const active = alerts.filter((a) => a.active && !a.triggered);
  const triggered = alerts.filter((a) => a.triggered);
  const inactive = alerts.filter((a) => !a.active && !a.triggered);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Price Alerts</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Get notified when prices hit your targets</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAdd(!showAdd)}
          className="flex items-center text-xs font-semibold cursor-pointer"
          style={{ gap: '6px', padding: '10px 18px', borderRadius: '12px', background: 'var(--color-accent)', color: '#fff', border: 'none' }}>
          <Plus style={{ width: '14px', height: '14px' }} /> New Alert
        </motion.button>
      </div>

      {/* Add Alert Form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '24px', marginBottom: '20px' }}>
          <span className="section-label">Create New Alert</span>
          <div className="flex items-end" style={{ gap: '12px', marginTop: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="text-xs" style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '6px' }}>Symbol</label>
              <select value={newAlert.symbol} onChange={(e) => setNewAlert((p) => ({ ...p, symbol: e.target.value }))}
                className="text-sm w-full focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                {['BTC', 'ETH', 'SOL', 'NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'GOLD', 'SPY'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-xs" style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '6px' }}>Condition</label>
              <select value={newAlert.condition} onChange={(e) => setNewAlert((p) => ({ ...p, condition: e.target.value }))}
                className="text-sm w-full focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="text-xs" style={{ color: 'var(--color-text-dim)', display: 'block', marginBottom: '6px' }}>Price</label>
              <input type="number" value={newAlert.price} onChange={(e) => setNewAlert((p) => ({ ...p, price: e.target.value }))} placeholder="0.00"
                className="text-sm w-full focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addAlert}
              className="text-xs font-semibold cursor-pointer" style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', whiteSpace: 'nowrap' }}>
              Create Alert
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Active Alerts', value: active.length, color: '#4f8cff' },
          { label: 'Triggered', value: triggered.length, color: '#22c55e' },
          { label: 'Inactive', value: inactive.length, color: '#484f58' },
        ].map((s, idx) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="panel" style={{ padding: '20px' }}>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginBottom: '4px' }}>{s.label}</p>
            <p className="text-2xl font-semibold" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.map((alert, idx) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            className="panel flex items-center justify-between" style={{ padding: '16px 24px', opacity: alert.active || alert.triggered ? 1 : 0.5 }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div className="flex items-center justify-center" style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: alert.condition === 'above' ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
              }}>
                {alert.condition === 'above' ? <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--color-green)' }} /> : <TrendingDown style={{ width: '18px', height: '18px', color: 'var(--color-red)' }} />}
              </div>
              <div>
                <p className="text-sm font-semibold">{alert.symbol} {alert.condition === 'above' ? '>' : '<'} {formatCurrency(alert.price)}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>
                  {alert.triggered ? '✓ Triggered' : alert.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <button onClick={() => toggleActive(alert.id)} className="cursor-pointer"
                style={{ width: '36px', height: '20px', borderRadius: '999px', background: alert.active ? 'var(--color-accent)' : 'var(--color-surface-active)', border: 'none', position: 'relative', padding: 0 }}>
                <div style={{ position: 'absolute', top: '2px', left: alert.active ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '999px', background: '#fff', transition: 'left 200ms' }} />
              </button>
              <button onClick={() => removeAlert(alert.id)} className="cursor-pointer"
                style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', padding: '4px' }}>
                <Trash2 style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
