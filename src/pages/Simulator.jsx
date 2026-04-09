import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { runAgentPipeline } from '../agents';
import InvestmentForm from '../components/InvestmentForm';
import AgentActivityPanel from '../components/AgentActivityPanel';
import AIRecommendationPanel from '../components/AIRecommendationPanel';
import AllocationChart from '../components/AllocationChart';
import { FlaskConical } from 'lucide-react';

export default function Simulator() {
  const assets = useMarketData();
  const { savePortfolio } = usePortfolio();
  const [agentResult, setAgentResult] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = useCallback(async ({ amount, risk }) => {
    setIsRunning(true);
    setAgentLogs([]);
    setAgentResult(null);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '48px' }}>
        <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
          <FlaskConical style={{ width: '24px', height: '24px', color: '#4f8cff' }} />
          <h1 className="text-3xl font-semibold tracking-tight">Simulator</h1>
        </div>
        <p className="text-sm text-[var(--color-text-dim)]">
          Configure parameters and let AI agents build an optimal portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px' }}>
        <InvestmentForm onSubmit={handleRunSimulation} isRunning={isRunning} />
        <AgentActivityPanel logs={agentLogs} isRunning={isRunning} />
      </div>

      {agentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px', marginTop: '40px' }}>
          <AIRecommendationPanel result={agentResult} onInvest={handleSavePortfolio} />
          <AllocationChart allocation={agentResult.strategy.allocation} />
        </div>
      )}
    </motion.div>
  );
}
