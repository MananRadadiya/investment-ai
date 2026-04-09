// Market Agent — analyzes current market trends with rich analysis
import { getMarketData } from '../data/marketData';

export function runMarketAgent() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const assets = getMarketData();
      const bullish = assets.filter((a) => a.changePercent > 0);
      const bearish = assets.filter((a) => a.changePercent < 0);
      const avgChange = assets.reduce((sum, a) => sum + a.changePercent, 0) / assets.length;

      const sentiment = avgChange > 0.5 ? 'bullish' : avgChange < -0.5 ? 'bearish' : 'neutral';

      // Sector analysis
      const sectorMap = {};
      assets.forEach((a) => {
        if (!sectorMap[a.sector]) sectorMap[a.sector] = { assets: [], totalChange: 0 };
        sectorMap[a.sector].assets.push(a);
        sectorMap[a.sector].totalChange += a.changePercent;
      });
      const sectors = Object.entries(sectorMap).map(([name, data]) => ({
        name,
        count: data.assets.length,
        avgChange: +(data.totalChange / data.assets.length).toFixed(2),
        topAsset: data.assets.sort((a, b) => b.changePercent - a.changePercent)[0]?.symbol,
      })).sort((a, b) => b.avgChange - a.avgChange);

      // Category breakdown
      const categories = {};
      assets.forEach((a) => {
        if (!categories[a.category]) categories[a.category] = { count: 0, bullish: 0, bearish: 0 };
        categories[a.category].count++;
        if (a.changePercent > 0) categories[a.category].bullish++;
        else categories[a.category].bearish++;
      });

      // Momentum indicators (simulated)
      const momentum = +(50 + avgChange * 12 + (Math.random() * 10 - 5)).toFixed(0);
      const rsi = Math.min(100, Math.max(0, +(50 + avgChange * 8 + (Math.random() * 15 - 7)).toFixed(0)));
      const fearGreed = Math.min(100, Math.max(0, +(45 + avgChange * 15 + (Math.random() * 10)).toFixed(0)));

      // Top movers
      const sorted = [...assets].sort((a, b) => b.changePercent - a.changePercent);
      const topGainers = sorted.slice(0, 5);
      const topLosers = sorted.slice(-5).reverse();

      resolve({
        agent: 'Market Agent',
        timestamp: Date.now(),
        sentiment,
        bullishCount: bullish.length,
        bearishCount: bearish.length,
        avgChange: +avgChange.toFixed(2),
        topPick: sorted[0]?.symbol,
        assets,
        sectors,
        categories,
        momentum,
        rsi,
        fearGreed,
        topGainers,
        topLosers,
        totalAssets: assets.length,
        marketStatus: 'open',
        logs: [
          `Scanning ${assets.length} assets across ${Object.keys(sectorMap).length} sectors...`,
          `Detected ${bullish.length} bullish, ${bearish.length} bearish signals`,
          `Overall market sentiment: ${sentiment.toUpperCase()}`,
          `Average market change: ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
          `Momentum index: ${momentum} | RSI: ${rsi}`,
          `Fear & Greed index: ${fearGreed}/100`,
          `Top sector: ${sectors[0]?.name} (${sectors[0]?.avgChange > 0 ? '+' : ''}${sectors[0]?.avgChange}%)`,
          `Top performing asset: ${sorted[0]?.symbol} (+${sorted[0]?.changePercent.toFixed(2)}%)`,
          `Worst performing: ${sorted[sorted.length-1]?.symbol} (${sorted[sorted.length-1]?.changePercent.toFixed(2)}%)`,
          'Market analysis complete ✓',
        ],
      });
    }, 800);
  });
}
