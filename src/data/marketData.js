// ─── COMPATIBILITY STUB ───
// This file re-exports from indianMarketData.js to avoid breaking existing page imports.
// Old pages (Market.jsx, Analytics.jsx, etc.) import from this path.
// TODO: Update all old page imports to use indianMarketData.js directly in Phase 2.

export {
  subscribeToMarket,
  getMarketData,
  getStocks,
  getIndices,
  getAssetBySymbol,
  getTopMovers,
  getSectorBreakdown,
  generateHistoricalData,
  generateNiftyReturns as generateMonthlyReturns,
} from './indianMarketData';

// Aliases for backward compatibility
export function generateCorrelationMatrix() {
  // Simplified stub — returns a basic correlation structure
  const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ITC'];
  const matrix = symbols.map((s1) =>
    symbols.map((s2) => {
      if (s1 === s2) return 1;
      return +(Math.random() * 0.6 + 0.1).toFixed(2);
    })
  );
  return { symbols, matrix };
}
