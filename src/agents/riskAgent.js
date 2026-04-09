// Risk Agent — calculates portfolio risk score with deep analysis
import { getMarketData } from '../data/marketData';

export function runRiskAgent(marketResult, riskLevel = 'moderate') {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Support standalone mode — use live market data if no result passed
      const assets = marketResult?.assets || getMarketData();
      const avgChange = marketResult?.avgChange ??
        +(assets.reduce((sum, a) => sum + a.changePercent, 0) / assets.length).toFixed(2);

      const volatility = assets.reduce((sum, a) => sum + Math.abs(a.changePercent), 0) / assets.length;

      const riskMultiplier = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 }[riskLevel] || 1.0;
      const riskScore = Math.min(100, Math.round(volatility * 20 * riskMultiplier));

      const maxDrawdown = +(volatility * 3.5 * riskMultiplier).toFixed(1);
      const sharpeRatio = +(avgChange / Math.max(volatility, 0.01)).toFixed(2);

      // Value at Risk (95% confidence, 1-day horizon) — simulated
      const portfolioValue = 50000;
      const valueAtRisk = +(portfolioValue * volatility * 0.0165 * riskMultiplier).toFixed(2);

      // Beta calculation (simulated)
      const beta = +(0.6 + Math.random() * 0.8).toFixed(2);

      // Concentration risk
      const categoryCount = {};
      assets.forEach((a) => {
        categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
      });
      const maxConcentration = Math.max(...Object.values(categoryCount));
      const concentrationRisk = Math.round((maxConcentration / assets.length) * 100);

      // Risk breakdown by category
      const riskByCategory = {};
      assets.forEach((a) => {
        if (!riskByCategory[a.category]) riskByCategory[a.category] = { totalVol: 0, count: 0 };
        riskByCategory[a.category].totalVol += Math.abs(a.changePercent);
        riskByCategory[a.category].count++;
      });
      const categoryRisk = Object.entries(riskByCategory).map(([cat, data]) => ({
        category: cat,
        avgVolatility: +(data.totalVol / data.count).toFixed(2),
        riskContribution: Math.round((data.totalVol / (volatility * assets.length)) * 100),
      })).sort((a, b) => b.riskContribution - a.riskContribution);

      const recommendation = riskScore > 70 ? 'reduce exposure' : riskScore > 40 ? 'maintain position' : 'increase exposure';

      resolve({
        agent: 'Risk Agent',
        timestamp: Date.now(),
        riskScore,
        riskLevel,
        volatility: +volatility.toFixed(2),
        maxDrawdown,
        sharpeRatio,
        valueAtRisk,
        beta,
        concentrationRisk,
        categoryRisk,
        recommendation,
        logs: [
          'Calculating portfolio volatility...',
          `Portfolio volatility index: ${volatility.toFixed(2)}`,
          `Risk score: ${riskScore}/100 (${riskLevel})`,
          `Maximum drawdown estimate: -${maxDrawdown}%`,
          `Sharpe ratio: ${sharpeRatio}`,
          `Value at Risk (95% CI): $${valueAtRisk.toLocaleString()}`,
          `Portfolio beta: ${beta}`,
          `Concentration risk: ${concentrationRisk}%`,
          `Highest risk: ${categoryRisk[0]?.category} (${categoryRisk[0]?.riskContribution}% contribution)`,
          `Recommendation: ${recommendation.charAt(0).toUpperCase() + recommendation.slice(1)}`,
          'Risk assessment complete ✓',
        ],
      });
    }, 600);
  });
}
