import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useState } from 'react';

export default function Market() {
  const assets = useMarketData();
  const [search, setSearch] = useState('');

  const filtered = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '48px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Market</h1>
          <p className="text-sm text-[var(--color-text-dim)]">Live prices · updated every 3 seconds</p>
        </div>
        <div className="relative">
          <Search className="absolute w-4 h-4 text-[var(--color-text-dim)]"
            style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)]
              focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-soft)]"
            style={{
              paddingLeft: '40px', paddingRight: '20px', paddingTop: '12px', paddingBottom: '12px',
              background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: 'none',
              width: '210px', transition: 'all 150ms',
            }}
            id="market-search"
          />
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-6"
        style={{ gap: '16px', padding: '0 24px 12px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>
        <span className="col-span-2">Asset</span>
        <span style={{ textAlign: 'right' }}>Price</span>
        <span style={{ textAlign: 'right' }}>Change</span>
        <span style={{ textAlign: 'right' }}>Market Cap</span>
        <span style={{ textAlign: 'right' }}>Volume</span>
      </div>

      <div>
        {filtered.map((asset, idx) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.035 }}
            className="panel grid grid-cols-6 items-center"
            style={{ gap: '16px', padding: '20px 24px', marginBottom: '8px' }}
          >
            <div className="col-span-2 flex items-center" style={{ gap: '16px' }}>
              <div
                className="flex items-center justify-center text-xs font-bold"
                style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${asset.color}10`, color: asset.color,
                }}
              >
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold">{asset.symbol}</p>
                <p className="text-xs text-[var(--color-text-dim)]" style={{ marginTop: '2px' }}>{asset.name}</p>
              </div>
            </div>

            <motion.div
              key={asset.price}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'right' }}
            >
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(asset.price)}</p>
            </motion.div>

            <div style={{ textAlign: 'right' }}>
              <span className={`inline-flex items-center text-xs font-semibold ${
                asset.changePercent >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
              }`} style={{ gap: '6px' }}>
                {asset.changePercent >= 0
                  ? <TrendingUp className="w-3.5 h-3.5" />
                  : <TrendingDown className="w-3.5 h-3.5" />
                }
                {formatPercent(asset.changePercent)}
              </span>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] tabular-nums" style={{ textAlign: 'right' }}>{asset.marketCap}</p>
            <p className="text-sm text-[var(--color-text-muted)] tabular-nums" style={{ textAlign: 'right' }}>{asset.volume}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
