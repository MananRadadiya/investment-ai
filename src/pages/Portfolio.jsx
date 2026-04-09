import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import PerformanceChart from '../components/PerformanceChart';

export default function Portfolio() {
  const { portfolio, clearPortfolio } = usePortfolio();
  const assets = useMarketData();

  if (!portfolio) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Portfolio</h1>
        <p className="text-sm text-[var(--color-text-dim)]" style={{ marginBottom: '48px' }}>
          Track your AI-generated portfolio performance
        </p>
        <div className="panel-static flex flex-col items-center justify-center text-center"
          style={{ padding: '80px 48px' }}>
          <div className="flex items-center justify-center"
            style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', marginBottom: '20px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-dim)]">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold" style={{ marginBottom: '8px' }}>No portfolio yet</h2>
          <p className="text-sm text-[var(--color-text-dim)] leading-relaxed" style={{ maxWidth: '400px' }}>
            Run the AI simulator from the Dashboard to create your first portfolio
          </p>
        </div>
      </motion.div>
    );
  }

  const currentValue = portfolio.assets.reduce((sum, a) => {
    const liveAsset = assets.find((m) => m.symbol === a.symbol);
    if (liveAsset && a.buyPrice) {
      return sum + (a.amount / a.buyPrice) * liveAsset.price;
    }
    return sum + a.amount;
  }, 0);

  const profitLoss = currentValue - portfolio.totalInvestment;
  const percentReturn = (profitLoss / portfolio.totalInvestment) * 100;
  const isPositive = profitLoss >= 0;

  const chartData = portfolio.assets.map((a) => ({
    name: a.symbol,
    value: +(a.allocation * 100).toFixed(1),
    color: a.color,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '48px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Portfolio</h1>
          <p className="text-sm text-[var(--color-text-dim)]">Track your AI-generated portfolio performance</p>
        </div>
        <button
          onClick={clearPortfolio}
          className="flex items-center text-xs font-medium text-[var(--color-red)] cursor-pointer"
          style={{ gap: '8px', padding: '8px 16px', background: 'rgba(239,68,68,0.12)', borderRadius: '12px', border: 'none', transition: 'all 150ms' }}
        >
          <Trash2 className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: '48px' }}>
        <motion.h2
          key={currentValue}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="text-5xl font-semibold tracking-tight"
        >
          {formatCurrency(currentValue)}
        </motion.h2>
        <div className="flex items-center" style={{ gap: '24px', marginTop: '16px' }}>
          <span className={`text-sm font-medium flex items-center ${
            isPositive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
          }`} style={{ gap: '6px' }}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatPercent(percentReturn)}
          </span>
          <span className="text-[var(--color-text-dim)] text-xs">•</span>
          <span className="text-sm text-[var(--color-text-dim)]">
            {isPositive ? '+' : ''}{formatCurrency(profitLoss)} P&L
          </span>
          <span className="text-[var(--color-text-dim)] text-xs">•</span>
          <span className="text-sm text-[var(--color-text-dim)]">
            Invested {formatCurrency(portfolio.totalInvestment)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12" style={{ gap: '24px', marginBottom: '40px' }}>
        {/* Allocation */}
        <div className="col-span-12 lg:col-span-5">
          <div className="panel" style={{ padding: '32px' }}>
            <span className="section-label">Allocation</span>
            <div style={{ height: '220px', marginTop: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {chartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color || '#4f8cff'} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.[0] ? (
                        <div className="backdrop-blur-xl shadow-2xl"
                          style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '12px', padding: '12px 16px' }}>
                          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]" style={{ marginTop: '2px' }}>{payload[0].value}%</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="col-span-12 lg:col-span-7">
          <div className="panel" style={{ padding: '32px' }}>
            <span className="section-label">Holdings</span>
            <div style={{ marginTop: '24px' }}>
              {portfolio.assets.map((asset, idx) => {
                const live = assets.find((a) => a.symbol === asset.symbol);
                const currentPrice = live?.price || asset.buyPrice || 0;
                const assetPnl = asset.buyPrice ? ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100 : 0;
                return (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)]"
                    style={{ padding: '14px 12px', margin: '0 -12px', borderRadius: '12px', transition: 'background 150ms' }}
                  >
                    <div className="flex items-center" style={{ gap: '16px' }}>
                      <div
                        className="flex items-center justify-center text-xs font-bold"
                        style={{
                          width: '40px', height: '40px', borderRadius: '12px',
                          background: `${asset.color}12`, color: asset.color,
                        }}
                      >
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{asset.symbol}</p>
                        <p className="text-xs text-[var(--color-text-dim)]" style={{ marginTop: '2px' }}>{asset.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="text-sm font-medium tabular-nums">{formatCurrency(asset.amount)}</p>
                      <p className={`text-xs font-medium flex items-center justify-end ${
                        assetPnl >= 0 ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
                      }`} style={{ gap: '6px', marginTop: '2px' }}>
                        {assetPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatPercent(assetPnl)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <PerformanceChart />
    </motion.div>
  );
}
