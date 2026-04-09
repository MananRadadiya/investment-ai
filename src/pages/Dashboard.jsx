import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuth } from '../context/AuthContext';
import { runAgentPipeline } from '../agents';
import { User } from 'lucide-react';

import PortfolioValueCard from '../components/PortfolioValueCard';
import PerformanceChart from '../components/PerformanceChart';
import InvestmentForm from '../components/InvestmentForm';
import AgentActivityPanel from '../components/AgentActivityPanel';
import MarketMovers from '../components/MarketMovers';
import AIRecommendationPanel from '../components/AIRecommendationPanel';
import NotificationsPanel from '../components/NotificationsPanel';
import Watchlist from '../components/Watchlist';

export default function Dashboard() {
  const assets = useMarketData();
  const { portfolio, savePortfolio } = usePortfolio();
  const { user } = useAuth();
  const [agentResult, setAgentResult] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const currentValue = portfolio
    ? portfolio.assets.reduce((sum, a) => {
        const liveAsset = assets.find((m) => m.symbol === a.symbol);
        if (liveAsset && a.buyPrice) {
          return sum + (a.amount / a.buyPrice) * liveAsset.price;
        }
        return sum + a.amount;
      }, 0)
    : 0;

  const handleRunSimulation = useCallback(async ({ amount, risk }) => {
    setIsRunning(true);
    setAgentLogs([]);
    const result = await runAgentPipeline(amount, risk, (log) => {
      setAgentLogs((prev) => [...prev, log]);
    });
    setAgentResult(result);
    setIsRunning(false);
  }, []);

  const handleSavePortfolio = useCallback(() => {
    if (!agentResult) return;
    const { execution } = agentResult;
    savePortfolio({
      totalInvestment: execution.totalInvestment,
      assets: execution.trades.map((t) => ({
        symbol: t.symbol,
        name: t.name,
        allocation: t.allocation,
        amount: t.amount,
        buyPrice: assets.find((a) => a.symbol === t.symbol)?.price || 0,
        color: t.color,
      })),
    });
  }, [agentResult, assets, savePortfolio]);

  return (
    <div>
      {/* Date + controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
        style={{ marginBottom: '8px' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <NotificationsPanel />
          <div className="flex items-center justify-center cursor-pointer"
            style={{ width: '32px', height: '32px', borderRadius: '999px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hero portfolio */}
      <PortfolioValueCard portfolio={portfolio} currentValue={currentValue} />

      {/* Performance chart */}
      <div style={{ marginTop: '40px' }}>
        <PerformanceChart />
      </div>

      {/* Simulator + Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px', marginTop: '40px' }}>
        <InvestmentForm onSubmit={handleRunSimulation} isRunning={isRunning} />
        <AgentActivityPanel logs={agentLogs} isRunning={isRunning} />
      </div>

      {/* Market Movers + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px', marginTop: '40px' }}>
        <MarketMovers assets={assets} />
        <Watchlist />
      </div>

      {/* AI Recommendation */}
      {agentResult && (
        <div style={{ marginTop: '40px' }}>
          <AIRecommendationPanel result={agentResult} onInvest={handleSavePortfolio} />
        </div>
      )}
    </div>
  );
}
