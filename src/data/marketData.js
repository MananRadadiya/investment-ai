// Market data with simulated live updates — 35+ assets
const baseAssets = [
  // ──── STOCKS ────
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, changePercent: 1.24, marketCap: '2.95T', volume: '54.2M', category: 'stock', color: '#a78bfa', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 878.36, changePercent: 3.47, marketCap: '2.17T', volume: '42.8M', category: 'stock', color: '#76b900', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.42, changePercent: -1.83, marketCap: '790.5B', volume: '98.1M', category: 'stock', color: '#e31937', sector: 'Automotive' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 421.55, changePercent: 0.87, marketCap: '3.13T', volume: '21.3M', category: 'stock', color: '#00a4ef', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.56, changePercent: 1.12, marketCap: '2.15T', volume: '28.7M', category: 'stock', color: '#4285f4', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.42, changePercent: 0.45, marketCap: '1.94T', volume: '34.1M', category: 'stock', color: '#ff9900', sector: 'E-Commerce' },
  { symbol: 'META', name: 'Meta Platforms', price: 502.30, changePercent: -0.92, marketCap: '1.28T', volume: '17.6M', category: 'stock', color: '#0082fb', sector: 'Technology' },
  { symbol: 'JPM', name: 'JP Morgan Chase', price: 198.75, changePercent: 0.34, marketCap: '571.2B', volume: '8.9M', category: 'stock', color: '#003087', sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc.', price: 279.40, changePercent: 0.56, marketCap: '573.8B', volume: '6.2M', category: 'stock', color: '#1a1f71', sector: 'Finance' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.20, changePercent: -0.23, marketCap: '376.4B', volume: '5.1M', category: 'stock', color: '#d51920', sector: 'Healthcare' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 68.95, changePercent: 0.78, marketCap: '553.6B', volume: '9.4M', category: 'stock', color: '#0071dc', sector: 'Retail' },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.30, changePercent: -1.45, marketCap: '205.8B', volume: '11.2M', category: 'stock', color: '#113ccf', sector: 'Entertainment' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 628.75, changePercent: 2.13, marketCap: '271.4B', volume: '5.7M', category: 'stock', color: '#e50914', sector: 'Entertainment' },
  { symbol: 'AMD', name: 'AMD Inc.', price: 164.80, changePercent: 2.67, marketCap: '265.9B', volume: '45.3M', category: 'stock', color: '#ed1c24', sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corp.', price: 31.25, changePercent: -2.14, marketCap: '132.1B', volume: '38.9M', category: 'stock', color: '#0071c5', sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 272.60, changePercent: 0.95, marketCap: '264.3B', volume: '4.8M', category: 'stock', color: '#00a1e0', sector: 'Technology' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 67.45, changePercent: -0.78, marketCap: '72.8B', volume: '12.4M', category: 'stock', color: '#003087', sector: 'Finance' },
  { symbol: 'BAC', name: 'Bank of America', price: 37.82, changePercent: 0.42, marketCap: '298.5B', volume: '32.1M', category: 'stock', color: '#e31837', sector: 'Finance' },

  // ──── CRYPTO ────
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.18, changePercent: 2.15, marketCap: '1.32T', volume: '28.4B', category: 'crypto', color: '#f7931a', sector: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.72, changePercent: -0.67, marketCap: '415.2B', volume: '14.7B', category: 'crypto', color: '#627eea', sector: 'Crypto' },
  { symbol: 'SOL', name: 'Solana', price: 178.45, changePercent: 4.23, marketCap: '79.8B', volume: '3.2B', category: 'crypto', color: '#9945ff', sector: 'Crypto' },
  { symbol: 'ADA', name: 'Cardano', price: 0.65, changePercent: 1.87, marketCap: '22.8B', volume: '520.4M', category: 'crypto', color: '#0033AD', sector: 'Crypto' },
  { symbol: 'DOT', name: 'Polkadot', price: 8.45, changePercent: -1.23, marketCap: '11.2B', volume: '285.6M', category: 'crypto', color: '#e6007a', sector: 'Crypto' },
  { symbol: 'AVAX', name: 'Avalanche', price: 42.15, changePercent: 3.56, marketCap: '15.8B', volume: '892.3M', category: 'crypto', color: '#e84142', sector: 'Crypto' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.92, changePercent: -0.34, marketCap: '8.5B', volume: '412.7M', category: 'crypto', color: '#8247e5', sector: 'Crypto' },
  { symbol: 'LINK', name: 'Chainlink', price: 18.92, changePercent: 1.45, marketCap: '11.1B', volume: '645.2M', category: 'crypto', color: '#375bd2', sector: 'Crypto' },
  { symbol: 'UNI', name: 'Uniswap', price: 12.34, changePercent: -2.18, marketCap: '7.4B', volume: '312.8M', category: 'crypto', color: '#ff007a', sector: 'Crypto' },
  { symbol: 'ATOM', name: 'Cosmos', price: 11.56, changePercent: 0.89, marketCap: '4.4B', volume: '178.9M', category: 'crypto', color: '#2E3148', sector: 'Crypto' },
  { symbol: 'XRP', name: 'Ripple', price: 0.62, changePercent: -0.92, marketCap: '33.7B', volume: '1.2B', category: 'crypto', color: '#23292f', sector: 'Crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.167, changePercent: 5.67, marketCap: '23.7B', volume: '2.8B', category: 'crypto', color: '#c2a633', sector: 'Crypto' },

  // ──── COMMODITIES ────
  { symbol: 'GOLD', name: 'Gold', price: 2341.50, changePercent: 0.34, marketCap: '13.5T', volume: '182.3B', category: 'commodity', color: '#fbbf24', sector: 'Commodity' },
  { symbol: 'SLV', name: 'Silver', price: 28.75, changePercent: 1.12, marketCap: '1.4T', volume: '42.8B', category: 'commodity', color: '#c0c0c0', sector: 'Commodity' },
  { symbol: 'USO', name: 'Crude Oil', price: 78.42, changePercent: -0.89, marketCap: '3.2T', volume: '98.5B', category: 'commodity', color: '#2d2d2d', sector: 'Energy' },
  { symbol: 'NG', name: 'Natural Gas', price: 2.34, changePercent: -3.21, marketCap: '285.6B', volume: '18.9B', category: 'commodity', color: '#ff6b35', sector: 'Energy' },

  // ──── ETFs ────
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 512.34, changePercent: 0.89, marketCap: '480.2B', volume: '72.5M', category: 'etf', color: '#4f8cff', sector: 'Index' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 445.67, changePercent: 1.34, marketCap: '245.8B', volume: '48.2M', category: 'etf', color: '#00bfff', sector: 'Index' },
  { symbol: 'VTI', name: 'Total Stock Market', price: 268.90, changePercent: 0.67, marketCap: '372.1B', volume: '3.8M', category: 'etf', color: '#8b5e3c', sector: 'Index' },
  { symbol: 'IWM', name: 'Russell 2000 ETF', price: 205.30, changePercent: -0.45, marketCap: '67.4B', volume: '25.6M', category: 'etf', color: '#e74c3c', sector: 'Index' },
  { symbol: 'ARKK', name: 'ARK Innovation', price: 48.92, changePercent: 2.78, marketCap: '8.2B', volume: '18.9M', category: 'etf', color: '#0052ff', sector: 'Innovation' },
];

let subscribers = [];
let currentAssets = JSON.parse(JSON.stringify(baseAssets));
let intervalId = null;

function randomFluctuation(price, maxPercent = 0.8) {
  const change = (Math.random() - 0.48) * maxPercent;
  return +(price * (1 + change / 100)).toFixed(2);
}

function updatePrices() {
  currentAssets = currentAssets.map((asset) => {
    const newPrice = randomFluctuation(asset.price);
    const changePercent = +(((newPrice - asset.price) / asset.price) * 100 + asset.changePercent * 0.9).toFixed(2);
    return {
      ...asset,
      price: newPrice,
      changePercent: +changePercent.toFixed(2),
    };
  });
  subscribers.forEach((cb) => cb([...currentAssets]));
}

export function subscribeToMarket(callback) {
  subscribers.push(callback);
  callback([...currentAssets]);

  if (!intervalId) {
    intervalId = setInterval(updatePrices, 3000);
  }

  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
    if (subscribers.length === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

export function getMarketData() {
  return [...currentAssets];
}

export function getAssetBySymbol(symbol) {
  return currentAssets.find((a) => a.symbol === symbol);
}

export function getTopMovers(assets, count = 5) {
  const sorted = [...assets].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  return {
    gainers: sorted.filter((a) => a.changePercent > 0).slice(0, count),
    losers: sorted.filter((a) => a.changePercent < 0).slice(0, count),
  };
}

// Generate fake historical data for charts
export function generateHistoricalData(days = 30) {
  const data = [];
  let value = 50000;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.45) * 800;
    value = Math.max(value + change, 30000);
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: +value.toFixed(2),
    });
  }
  return data;
}

// Generate sector breakdown
export function getSectorBreakdown(assets) {
  const sectors = {};
  assets.forEach((a) => {
    if (!sectors[a.sector]) sectors[a.sector] = { count: 0, totalChange: 0 };
    sectors[a.sector].count++;
    sectors[a.sector].totalChange += a.changePercent;
  });
  return Object.entries(sectors).map(([name, data]) => ({
    name,
    count: data.count,
    avgChange: +(data.totalChange / data.count).toFixed(2),
  }));
}

// Generate asset correlation matrix (fake)
export function generateCorrelationMatrix(symbols) {
  const matrix = {};
  symbols.forEach((s1) => {
    matrix[s1] = {};
    symbols.forEach((s2) => {
      if (s1 === s2) matrix[s1][s2] = 1.0;
      else if (matrix[s2]?.[s1] !== undefined) matrix[s1][s2] = matrix[s2][s1];
      else matrix[s1][s2] = +((Math.random() * 1.6 - 0.3).toFixed(2));
    });
  });
  return matrix;
}

// Monthly returns heatmap data
export function generateMonthlyReturns() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2022, 2023, 2024, 2025, 2026];
  const data = [];
  years.forEach((year) => {
    months.forEach((month, mIdx) => {
      if (year === 2026 && mIdx > 3) return;
      data.push({
        year,
        month,
        return: +((Math.random() * 20 - 8).toFixed(1)),
      });
    });
  });
  return data;
}
