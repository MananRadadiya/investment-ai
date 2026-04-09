import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Filter, Clock } from 'lucide-react';
import { fakeTransactions } from '../data/userData';
import { formatCurrency } from '../utils/format';

export default function TransactionHistory() {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'buy', 'sell'];

  const filtered = filter === 'all'
    ? fakeTransactions
    : fakeTransactions.filter((t) => t.type === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '48px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Transactions</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
            Your complete trade history
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '4px', padding: '4px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs font-semibold capitalize cursor-pointer"
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                transition: 'all 150ms',
                background: filter === f ? 'rgba(79,140,255,0.12)' : 'transparent',
                color: filter === f ? '#4f8cff' : '#484f58',
              }}
            >
              {f === 'all' ? 'All' : f === 'buy' ? '↗ Buy' : '↙ Sell'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
          style={{ padding: '24px' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>Total Transactions</p>
          <p className="text-2xl font-semibold tracking-tight">{fakeTransactions.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="panel"
          style={{ padding: '24px' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>Total Bought</p>
          <p className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-green)' }}>
            {formatCurrency(fakeTransactions.filter((t) => t.type === 'buy').reduce((s, t) => s + t.amount, 0))}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="panel"
          style={{ padding: '24px' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginBottom: '8px' }}>Total Sold</p>
          <p className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-red)' }}>
            {formatCurrency(fakeTransactions.filter((t) => t.type === 'sell').reduce((s, t) => s + t.amount, 0))}
          </p>
        </motion.div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6"
        style={{
          gap: '16px', padding: '0 24px 12px',
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-text-dim)',
        }}>
        <span className="col-span-2">Asset</span>
        <span style={{ textAlign: 'right' }}>Type</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
        <span style={{ textAlign: 'right' }}>Price</span>
        <span style={{ textAlign: 'right' }}>Date</span>
      </div>

      {/* Rows */}
      <div>
        {filtered.map((tx, idx) => {
          const isBuy = tx.type === 'buy';
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="panel grid grid-cols-6 items-center"
              style={{ gap: '16px', padding: '20px 24px', marginBottom: '8px' }}
            >
              <div className="col-span-2 flex items-center" style={{ gap: '14px' }}>
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: isBuy ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  }}>
                  {isBuy
                    ? <ArrowUpRight style={{ width: '18px', height: '18px', color: '#22c55e' }} />
                    : <ArrowDownRight style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold">{tx.symbol}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>{tx.name}</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="text-xs font-semibold"
                  style={{
                    padding: '4px 10px', borderRadius: '999px',
                    background: isBuy ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                    color: isBuy ? '#22c55e' : '#ef4444',
                  }}>
                  {tx.type.toUpperCase()}
                </span>
              </div>

              <p className="text-sm font-medium" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(tx.amount)}
              </p>

              <div style={{ textAlign: 'right' }}>
                <p className="text-sm" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-muted)' }}>
                  {formatCurrency(tx.price)}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>
                  × {tx.quantity.toFixed(tx.quantity < 1 ? 4 : 1)}
                </p>
              </div>

              <p className="text-xs flex items-center justify-end" style={{ gap: '6px', color: 'var(--color-text-dim)' }}>
                <Clock style={{ width: '10px', height: '10px' }} />
                {formatDate(tx.date)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
