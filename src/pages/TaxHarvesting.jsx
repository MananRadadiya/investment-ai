import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { Scissors, TrendingDown, ArrowRight, AlertTriangle, DollarSign } from 'lucide-react';

const SWAP_SUGGESTIONS = { BTC: 'ETH', ETH: 'SOL', TSLA: 'NFLX', AAPL: 'MSFT', META: 'GOOGL', INTC: 'AMD', DIS: 'NFLX', PYPL: 'V', DOT: 'ATOM', DOGE: 'ADA', AVAX: 'SOL' };

export default function TaxHarvesting() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();

  const harvesting = useMemo(() => {
    if (!portfolio?.assets) return null;
    const losses = [];
    let totalLoss = 0;

    portfolio.assets.forEach(a => {
      const live = assets.find(m => m.symbol === a.symbol);
      if (!live || !a.buyPrice) return;
      const pnl = ((live.price - a.buyPrice) / a.buyPrice) * 100;
      if (pnl < 0) {
        const lossAmount = (a.amount / a.buyPrice) * (a.buyPrice - live.price);
        totalLoss += lossAmount;
        losses.push({
          ...a, livePrice: live.price, pnl, lossAmount: +lossAmount.toFixed(2),
          swap: SWAP_SUGGESTIONS[a.symbol] || null,
          swapName: SWAP_SUGGESTIONS[a.symbol] ? assets.find(m => m.symbol === SWAP_SUGGESTIONS[a.symbol])?.name : null,
        });
      }
    });

    const taxRate = 0.25;
    const potentialSavings = totalLoss * taxRate;
    return { losses: losses.sort((a, b) => a.pnl - b.pnl), totalLoss: +totalLoss.toFixed(2), potentialSavings: +potentialSavings.toFixed(2), taxRate };
  }, [portfolio, assets]);

  if (!portfolio?.assets) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '32px' }}>
        <Scissors style={{ width: '40px', height: '40px', color: '#4f8cff', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Portfolio</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Create a portfolio to identify tax-loss harvesting opportunities</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scissors style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tax Loss Harvesting</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Identify losses and optimize your tax liability</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
          <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444', marginBottom: '8px' }} />
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Total Unrealized Losses</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>-{formatCurrency(harvesting?.totalLoss || 0)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
          <DollarSign style={{ width: '16px', height: '16px', color: '#22c55e', marginBottom: '8px' }} />
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Potential Tax Savings</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#22c55e', marginTop: '4px' }}>{formatCurrency(harvesting?.potentialSavings || 0)}</div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>at {(harvesting?.taxRate || 0) * 100}% tax rate</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Scissors style={{ width: '16px', height: '16px', color: '#f59e0b', marginBottom: '8px' }} />
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Harvest Opportunities</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>{harvesting?.losses.length || 0}</div>
        </motion.div>
      </div>

      {/* Loss Positions */}
      {harvesting?.losses.length === 0 ? (
        <div style={{ padding: '48px', borderRadius: '20px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)', textAlign: 'center' }}>
          <span style={{ fontSize: '32px' }}>🎉</span>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '12px' }}>No Losses to Harvest</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', marginTop: '4px' }}>All your positions are in profit!</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertTriangle style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Harvest Opportunities</span>
          </div>
          {harvesting.losses.map((loss, idx) => (
            <motion.div key={loss.symbol} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + idx * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '14px', marginBottom: '8px', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.06)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${loss.color}15`, color: loss.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{loss.symbol.slice(0, 2)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{loss.symbol}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Buy: {formatCurrency(loss.buyPrice)} → Now: {formatCurrency(loss.livePrice)}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444' }}>{formatPercent(loss.pnl)}</div>
                <div style={{ fontSize: '11px', color: '#ef4444' }}>-{formatCurrency(loss.lossAmount)}</div>
              </div>
              {loss.swap && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                  <ArrowRight style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e' }}>Swap to {loss.swap}</div>
                    <div style={{ fontSize: '9px', color: 'var(--color-text-dim)' }}>{loss.swapName}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
