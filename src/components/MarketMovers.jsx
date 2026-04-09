import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/format';
import { getTopMovers } from '../data/marketData';

export default function MarketMovers({ assets = [] }) {
  const { gainers, losers } = getTopMovers(assets);
  const all = [...gainers, ...losers];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="panel"
      style={{ padding: '32px' }}
    >
      <span className="section-label">Market Movers</span>

      <div style={{ marginTop: '24px' }}>
        {all.map((asset, idx) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className="flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)]"
            style={{ padding: '14px 12px', margin: '0 -12px', borderRadius: '12px', transition: 'background 150ms' }}
          >
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div
                className="flex items-center justify-center text-xs font-bold tracking-tight"
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `${asset.color}12`, color: asset.color,
                }}
              >
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{asset.symbol}</p>
                <p className="text-xs text-[var(--color-text-dim)]" style={{ marginTop: '2px' }}>{asset.name}</p>
              </div>
            </div>

            <div className="flex items-center" style={{ gap: '24px' }}>
              <motion.span
                key={asset.price}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-[var(--color-text-secondary)] tabular-nums"
              >
                {formatCurrency(asset.price)}
              </motion.span>
              <span className={`inline-flex items-center text-xs font-semibold ${
                asset.changePercent >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
              }`}
                style={{ gap: '6px', minWidth: '72px', justifyContent: 'flex-end' }}>
                {asset.changePercent >= 0
                  ? <TrendingUp className="w-3.5 h-3.5" />
                  : <TrendingDown className="w-3.5 h-3.5" />
                }
                {formatPercent(asset.changePercent)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
