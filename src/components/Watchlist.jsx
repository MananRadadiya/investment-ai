import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { Star, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

export default function Watchlist() {
  const assets = useMarketData();
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('ai-invest-watchlist');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH', 'SOL'];
  });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai-invest-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((symbol) => {
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev;
      return [...prev, symbol];
    });
    setShowAdd(false);
  }, []);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  }, []);

  const watchlistAssets = assets.filter((a) => watchlist.includes(a.symbol));
  const availableToAdd = assets.filter((a) => !watchlist.includes(a.symbol));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="panel"
      style={{ padding: '32px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <span className="section-label flex items-center" style={{ gap: '10px' }}>
          <Star style={{ width: '14px', height: '14px' }} />
          Watchlist
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center cursor-pointer text-xs font-medium"
          style={{
            gap: '4px', padding: '6px 12px', borderRadius: '8px',
            background: showAdd ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
            border: 'none', color: showAdd ? '#ef4444' : 'var(--color-text-dim)',
            transition: 'all 150ms',
          }}
        >
          {showAdd ? <X style={{ width: '12px', height: '12px' }} /> : <Plus style={{ width: '12px', height: '12px' }} />}
          {showAdd ? 'Cancel' : 'Add'}
        </button>
      </div>

      {/* Add panel */}
      <AnimatePresence>
        {showAdd && availableToAdd.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', marginBottom: '16px' }}
          >
            <div className="flex flex-wrap" style={{ gap: '6px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              {availableToAdd.map((a) => (
                <button
                  key={a.symbol}
                  onClick={() => addToWatchlist(a.symbol)}
                  className="text-xs font-medium cursor-pointer"
                  style={{
                    padding: '6px 12px', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.04)', border: 'none',
                    color: 'var(--color-text-muted)', transition: 'all 150ms',
                  }}
                >
                  + {a.symbol}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watchlist items */}
      <div>
        {watchlistAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center"
            style={{ padding: '40px 0' }}>
            <Star style={{ width: '28px', height: '28px', color: 'var(--color-text-dim)', opacity: 0.2, marginBottom: '12px' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Add assets to your watchlist</p>
          </div>
        ) : (
          watchlistAssets.map((asset, idx) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center justify-between group"
              style={{
                padding: '12px', margin: '0 -12px', borderRadius: '12px',
                transition: 'background 150ms',
              }}
            >
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div className="flex items-center justify-center text-xs font-bold"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${asset.color}12`, color: asset.color,
                  }}>
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium">{asset.symbol}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '1px' }}>{asset.name}</p>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <motion.p
                    key={asset.price}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatCurrency(asset.price)}
                  </motion.p>
                  <span className={`text-xs font-semibold ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    {asset.changePercent >= 0
                      ? <TrendingUp style={{ width: '12px', height: '12px' }} />
                      : <TrendingDown style={{ width: '12px', height: '12px' }} />
                    }
                    {formatPercent(asset.changePercent)}
                  </span>
                </div>
                <button
                  onClick={() => removeFromWatchlist(asset.symbol)}
                  className="cursor-pointer opacity-0 group-hover:opacity-100"
                  style={{
                    padding: '4px', borderRadius: '6px',
                    background: 'none', border: 'none',
                    color: 'var(--color-text-dim)', transition: 'opacity 150ms',
                  }}>
                  <X style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
