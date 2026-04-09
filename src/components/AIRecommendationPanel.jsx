import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export default function AIRecommendationPanel({ result, onInvest }) {
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="panel"
        style={{ padding: '32px' }}
      >
        <span className="section-label flex items-center" style={{ gap: '10px' }}>
          <Bot className="w-3.5 h-3.5" />
          AI Recommendation
        </span>
        <div className="flex flex-col items-center justify-center text-[var(--color-text-dim)]"
          style={{ height: '200px' }}>
          <Bot className="w-8 h-8 opacity-15" style={{ marginBottom: '12px' }} />
          <p className="text-sm">Run the simulator for recommendations</p>
        </div>
      </motion.div>
    );
  }

  const { strategy, execution, risk } = result;
  const allocation = strategy?.allocation || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="panel"
      style={{ padding: '32px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '28px' }}>
        <span className="section-label flex items-center" style={{ gap: '10px' }}>
          <Bot className="w-3.5 h-3.5" />
          AI Recommendation
        </span>
        <div className="flex items-center text-xs" style={{ gap: '20px' }}>
          <span className="text-[var(--color-text-dim)]">
            Risk <span className="text-[var(--color-text-muted)] font-semibold" style={{ marginLeft: '4px' }}>{risk?.riskScore}/100</span>
          </span>
          <span className="text-[var(--color-text-dim)]">
            Score <span className="text-[var(--color-text-muted)] font-semibold" style={{ marginLeft: '4px' }}>{strategy?.diversificationScore}/100</span>
          </span>
        </div>
      </div>

      <div>
        {allocation.slice(0, 5).map((asset, idx) => (
          <div key={idx} className="flex items-center" style={{ gap: '16px', marginBottom: '16px' }}>
            <div
              className="flex items-center justify-center font-bold flex-shrink-0"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                fontSize: '10px', background: `${asset.color}12`, color: asset.color,
              }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <span className="text-sm font-medium">{asset.symbol}</span>
                <span className="text-xs text-[var(--color-text-muted)] tabular-nums">
                  {(asset.allocation * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full overflow-hidden"
                style={{ height: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${asset.allocation * 100}%` }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: '999px', background: asset.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {execution && (
        <div className="flex items-center justify-between"
          style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs text-[var(--color-text-dim)]">
            Total: {formatCurrency(execution.totalAllocated)}
          </span>
          <button
            onClick={onInvest}
            className="text-sm font-semibold text-white cursor-pointer"
            style={{
              padding: '10px 20px', background: '#4f8cff', borderRadius: '12px',
              border: 'none', transition: 'all 150ms',
            }}
          >
            Save Portfolio
          </button>
        </div>
      )}
    </motion.div>
  );
}
