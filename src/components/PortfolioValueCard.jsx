import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PortfolioValueCard({ portfolio, currentValue }) {
  const totalInvestment = portfolio?.totalInvestment || 0;
  const value = currentValue || totalInvestment;
  const profitLoss = value - totalInvestment;
  const percentReturn = totalInvestment > 0 ? ((profitLoss / totalInvestment) * 100) : 0;
  const isPositive = profitLoss >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="py-4"
    >
      <p className="text-sm text-[var(--color-text-muted)] font-medium mb-4">
        Portfolio Value
      </p>

      <motion.h1
        key={value}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className="text-5xl font-semibold tracking-tight leading-none mb-5"
      >
        {formatCurrency(value)}
      </motion.h1>

      <div className="flex items-center gap-6">
        <div className={`inline-flex items-center gap-2 text-sm font-medium ${
          isPositive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {formatPercent(percentReturn)} today
        </div>

        <span className="text-[var(--color-text-dim)] text-xs">•</span>

        <span className="text-sm text-[var(--color-text-muted)]">
          Invested {formatCurrency(totalInvestment)}
        </span>

        <span className="text-[var(--color-text-dim)] text-xs">•</span>

        <span className={`text-sm font-medium ${isPositive ? 'text-[var(--color-green)]' : 'text-[var(--color-red)]'}`}>
          {isPositive ? '+' : ''}{formatCurrency(profitLoss)} P&L
        </span>
      </div>
    </motion.div>
  );
}
