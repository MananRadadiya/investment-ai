// Strategy Agent — creates optimal asset allocation with rich analysis
import { getMarketData } from '../data/marketData';

export function runStrategyAgent(marketResult, riskResult) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Support standalone mode
      const assets = marketResult?.assets || getMarketData();
      const sentiment = marketResult?.sentiment || 'neutral';
      const riskLevel = riskResult?.riskLevel || 'moderate';
      const riskScore = riskResult?.riskScore || 50;

      // Allocation strategy based on risk level
      const strategies = {
        conservative: { stocks: 0.25, crypto: 0.05, commodity: 0.35, etf: 0.35 },
        moderate: { stocks: 0.40, crypto: 0.15, commodity: 0.20, etf: 0.25 },
        aggressive: { stocks: 0.35, crypto: 0.35, commodity: 0.10, etf: 0.20 },
      };

      const strategy = { ...(strategies[riskLevel] || strategies.moderate) };

      // Adjust based on sentiment
      if (sentiment === 'bullish') {
        strategy.stocks += 0.05;
        strategy.commodity -= 0.05;
      } else if (sentiment === 'bearish') {
        strategy.commodity += 0.05;
        strategy.crypto -= 0.05;
      }

      // Build portfolio allocation
      const allocation = assets.map((asset) => {
        const categoryWeight = strategy[asset.category] || 0.1;
        const categoryAssets = assets.filter((a) => a.category === asset.category);
        const performanceBonus = asset.changePercent > 0 ? 0.02 : -0.01;
        const weight = Math.max(0.02, categoryWeight / categoryAssets.length + performanceBonus);
        return {
          symbol: asset.symbol,
          name: asset.name,
          allocation: +weight.toFixed(3),
          category: asset.category,
          color: asset.color,
          changePercent: asset.changePercent,
        };
      });

      // Normalize to 100%
      const totalWeight = allocation.reduce((sum, a) => sum + a.allocation, 0);
      allocation.forEach((a) => {
        a.allocation = +(a.allocation / totalWeight).toFixed(3);
      });

      // Group by category for chart rendering
      const categoryBreakdown = {};
      allocation.forEach((a) => {
        if (!categoryBreakdown[a.category]) {
          categoryBreakdown[a.category] = { totalAllocation: 0, count: 0, assets: [] };
        }
        categoryBreakdown[a.category].totalAllocation += a.allocation;
        categoryBreakdown[a.category].count++;
        categoryBreakdown[a.category].assets.push(a);
      });

      const categoryAllocation = Object.entries(categoryBreakdown).map(([cat, data]) => ({
        category: cat,
        allocation: +(data.totalAllocation * 100).toFixed(1),
        count: data.count,
        topHolding: data.assets.sort((a, b) => b.allocation - a.allocation)[0]?.symbol,
        color: { stock: '#4f8cff', crypto: '#a78bfa', commodity: '#f59e0b', etf: '#22c55e' }[cat] || '#8b949e',
      }));

      // Top holdings
      const topHoldings = [...allocation].sort((a, b) => b.allocation - a.allocation).slice(0, 8);

      // Diversification score
      const diversificationScore = Math.round(85 - riskScore * 0.2);

      // Rebalancing recommendations
      const rebalancing = categoryAllocation.map((cat) => {
        const target = (strategy[cat.category] || 0.1) * 100;
        const diff = +(cat.allocation - target).toFixed(1);
        return {
          category: cat.category,
          current: cat.allocation,
          target: +target.toFixed(1),
          diff,
          action: diff > 2 ? 'REDUCE' : diff < -2 ? 'INCREASE' : 'HOLD',
        };
      });

      resolve({
        agent: 'Strategy Agent',
        timestamp: Date.now(),
        allocation,
        strategy: riskLevel,
        diversificationScore,
        categoryAllocation,
        topHoldings,
        rebalancing,
        sentimentAdjustment: sentiment,
        logs: [
          'Building optimal portfolio...',
          `Strategy mode: ${riskLevel.toUpperCase()}`,
          `Market sentiment factor: ${sentiment}`,
          `Diversification score: ${diversificationScore}/100`,
          `Allocating across ${allocation.length} assets in ${categoryAllocation.length} categories...`,
          ...categoryAllocation.map((c) => `  ${c.category.toUpperCase()}: ${c.allocation}% (${c.count} assets)`),
          `Top holding: ${topHoldings[0]?.symbol} (${(topHoldings[0]?.allocation * 100).toFixed(1)}%)`,
          ...rebalancing.filter((r) => r.action !== 'HOLD').map((r) =>
            `  ⚡ ${r.action} ${r.category}: ${r.current}% → ${r.target}%`
          ),
          'Portfolio optimization complete ✓',
        ],
      });
    }, 700);
  });
}
