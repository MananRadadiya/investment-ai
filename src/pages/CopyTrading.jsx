import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Copy, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { leaderboard, copyTradingSignals, communityPosts } from '../data/socialData';
import { formatCurrency } from '../utils/format';

export default function CopyTrading() {
  const [tab, setTab] = useState('leaderboard');
  const tabs = ['leaderboard', 'signals', 'community'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Copy Trading</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Follow top traders and learn from the community</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center" style={{ gap: '4px', padding: '4px', borderRadius: '14px', background: 'var(--color-surface)', marginBottom: '24px', width: 'fit-content' }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-xs font-semibold capitalize cursor-pointer"
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: tab === t ? 'var(--color-accent)' : 'transparent', color: tab === t ? '#fff' : 'var(--color-text-muted)', transition: 'all 150ms' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div>
          <div className="grid grid-cols-5" style={{ gap: '16px', padding: '0 24px 12px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>
            <span className="col-span-2">Trader</span>
            <span style={{ textAlign: 'right' }}>Returns</span>
            <span style={{ textAlign: 'right' }}>Win Rate</span>
            <span style={{ textAlign: 'right' }}>Strategy</span>
          </div>
          {leaderboard.map((trader, idx) => (
            <motion.div key={trader.rank} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
              className="panel grid grid-cols-5 items-center" style={{ gap: '16px', padding: '16px 24px', marginBottom: '6px', background: trader.isCurrentUser ? 'var(--color-accent-soft)' : undefined }}>
              <div className="col-span-2 flex items-center" style={{ gap: '12px' }}>
                <span className="text-xs font-bold" style={{ width: '20px', color: idx < 3 ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>#{trader.rank}</span>
                <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '999px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{trader.avatar}</div>
                <div>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <span className="text-sm font-semibold">{trader.name}</span>
                    {trader.badge && <span style={{ fontSize: '14px' }}>{trader.badge}</span>}
                    {trader.isCurrentUser && <span className="text-xs" style={{ padding: '1px 6px', borderRadius: '4px', background: 'var(--color-accent)', color: '#fff', fontSize: '9px' }}>YOU</span>}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '1px' }}>{trader.trades} trades</p>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ textAlign: 'right', color: 'var(--color-green)' }}>+{trader.returns}%</p>
              <p className="text-sm font-medium" style={{ textAlign: 'right', color: 'var(--color-text-muted)' }}>{trader.winRate}%</p>
              <div style={{ textAlign: 'right' }}>
                <span className="text-xs" style={{ padding: '3px 10px', borderRadius: '6px', background: 'var(--color-surface-active)', color: 'var(--color-text-dim)' }}>{trader.strategy}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Signals */}
      {tab === 'signals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {copyTradingSignals.map((signal, idx) => (
            <motion.div key={signal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="panel" style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                <div className="flex items-center" style={{ gap: '10px' }}>
                  <div className="flex items-center justify-center" style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: signal.action === 'buy' ? 'var(--color-green-soft)' : 'var(--color-red-soft)',
                  }}>
                    {signal.action === 'buy' ? <ArrowUpRight style={{ width: '16px', height: '16px', color: 'var(--color-green)' }} /> : <ArrowDownRight style={{ width: '16px', height: '16px', color: 'var(--color-red)' }} />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{signal.trader}</span>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{signal.time}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ padding: '4px 10px', borderRadius: '8px', background: signal.action === 'buy' ? 'var(--color-green-soft)' : 'var(--color-red-soft)', color: signal.action === 'buy' ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {signal.action.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{signal.symbol}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{formatCurrency(signal.amount)} at {formatCurrency(signal.price)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Confidence</span>
                    <span className="text-sm font-bold" style={{ color: signal.confidence >= 85 ? 'var(--color-green)' : 'var(--color-amber)' }}>{signal.confidence}%</span>
                  </div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full text-xs font-semibold cursor-pointer"
                style={{ marginTop: '14px', padding: '8px', borderRadius: '10px', background: 'var(--color-accent-soft)', border: 'none', color: 'var(--color-accent)' }}>
                Copy This Trade
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Community */}
      {tab === 'community' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {communityPosts.map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="panel" style={{ padding: '20px 24px' }}>
              <div className="flex items-center" style={{ gap: '12px', marginBottom: '12px' }}>
                <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '999px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{post.avatar}</div>
                <div>
                  <span className="text-sm font-semibold">{post.author}</span>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{post.time}</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{post.content}</p>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '12px' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs" style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--color-surface-active)', color: 'var(--color-text-dim)' }}>#{tag}</span>
                ))}
              </div>
              <div className="flex items-center" style={{ gap: '20px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>❤️ {post.likes}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>💬 {post.comments}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
