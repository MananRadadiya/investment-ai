// Execution Agent — simulates placing trades with realistic details
import { getMarketData } from '../data/marketData';

export function runExecutionAgent(strategyResult, investmentAmount = 50000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Support standalone mode
      const assets = getMarketData();
      const allocation = strategyResult?.allocation || assets.slice(0, 10).map((a) => ({
        symbol: a.symbol,
        name: a.name,
        allocation: +(1 / 10).toFixed(3),
        category: a.category,
        color: a.color,
      }));

      const startTime = Date.now();

      const trades = allocation.map((asset) => {
        const amount = +(investmentAmount * asset.allocation).toFixed(2);
        const assetData = assets.find((a) => a.symbol === asset.symbol);
        const price = assetData?.price || 100;

        // Simulated slippage (0.01% - 0.15%)
        const slippagePct = +(Math.random() * 0.14 + 0.01).toFixed(3);
        const slippageAmount = +(amount * slippagePct / 100).toFixed(2);

        // Simulated fee (0.05% - 0.25%)
        const feePct = +(Math.random() * 0.2 + 0.05).toFixed(3);
        const feeAmount = +(amount * feePct / 100).toFixed(2);

        // Shares/units purchased
        const fillPrice = +(price * (1 + slippagePct / 100)).toFixed(2);
        const units = +((amount - feeAmount - slippageAmount) / fillPrice).toFixed(4);

        return {
          symbol: asset.symbol,
          name: asset.name,
          action: 'BUY',
          amount,
          allocation: asset.allocation,
          price,
          fillPrice,
          units,
          slippage: slippageAmount,
          fee: feeAmount,
          netAmount: +(amount - feeAmount - slippageAmount).toFixed(2),
          status: Math.random() > 0.02 ? 'filled' : 'partial',
          color: asset.color,
          category: asset.category || 'unknown',
          timestamp: Date.now() + Math.random() * 500,
        };
      });

      const executionTime = +((Date.now() - startTime + Math.random() * 800 + 200) / 1000).toFixed(3);
      const totalAllocated = trades.reduce((sum, t) => sum + t.amount, 0);
      const totalFees = trades.reduce((sum, t) => sum + t.fee, 0);
      const totalSlippage = trades.reduce((sum, t) => sum + t.slippage, 0);
      const filledCount = trades.filter((t) => t.status === 'filled').length;

      // P&L projections (simulated)
      const projections = {
        day1: +((Math.random() * 4 - 1.5) * investmentAmount / 100).toFixed(2),
        week1: +((Math.random() * 8 - 2) * investmentAmount / 100).toFixed(2),
        month1: +((Math.random() * 15 - 3) * investmentAmount / 100).toFixed(2),
        month3: +((Math.random() * 25 - 5) * investmentAmount / 100).toFixed(2),
      };

      resolve({
        agent: 'Execution Agent',
        timestamp: Date.now(),
        trades,
        totalAllocated: +totalAllocated.toFixed(2),
        totalInvestment: investmentAmount,
        totalFees: +totalFees.toFixed(2),
        totalSlippage: +totalSlippage.toFixed(2),
        filledCount,
        totalTrades: trades.length,
        executionTime: `${executionTime}s`,
        fillRate: Math.round((filledCount / trades.length) * 100),
        projections,
        logs: [
          'Allocating funds to exchange...',
          `Processing ${trades.length} trade orders...`,
          ...trades.slice(0, 6).map((t) => `  ✓ ${t.action} ${t.units} ${t.symbol} @ $${t.fillPrice.toLocaleString()}`),
          trades.length > 6 ? `  ... and ${trades.length - 6} more trades` : null,
          `Total allocated: $${totalAllocated.toLocaleString()}`,
          `Total fees: $${totalFees.toFixed(2)} | Slippage: $${totalSlippage.toFixed(2)}`,
          `Fill rate: ${Math.round((filledCount / trades.length) * 100)}% (${filledCount}/${trades.length})`,
          `Execution time: ${executionTime}s`,
          'All trades executed successfully ✓',
        ].filter(Boolean),
      });
    }, 500);
  });
}
