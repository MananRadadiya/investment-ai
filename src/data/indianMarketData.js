// ─── Indian Market Data — NSE/BSE stocks, indices, ₹ prices ───

const baseAssets = [
  // ──── NIFTY 50 LARGE CAPS ────
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2945.60, changePercent: 1.34, marketCap: '19.92L Cr', volume: '12.4M', category: 'stock', sector: 'Energy', exchange: 'NSE' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3842.15, changePercent: 0.67, marketCap: '13.89L Cr', volume: '3.2M', category: 'stock', sector: 'IT', exchange: 'NSE' },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1578.30, changePercent: -0.42, marketCap: '6.55L Cr', volume: '8.7M', category: 'stock', sector: 'IT', exchange: 'NSE' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1685.45, changePercent: 0.89, marketCap: '12.84L Cr', volume: '6.1M', category: 'stock', sector: 'Banking', exchange: 'NSE' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1234.70, changePercent: 1.12, marketCap: '8.67L Cr', volume: '9.3M', category: 'stock', sector: 'Banking', exchange: 'NSE' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2456.80, changePercent: -0.28, marketCap: '5.77L Cr', volume: '2.1M', category: 'stock', sector: 'FMCG', exchange: 'NSE' },
  { symbol: 'ITC', name: 'ITC Ltd', price: 468.55, changePercent: 0.56, marketCap: '5.84L Cr', volume: '15.8M', category: 'stock', sector: 'FMCG', exchange: 'NSE' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 842.30, changePercent: 1.78, marketCap: '7.52L Cr', volume: '18.2M', category: 'stock', sector: 'Banking', exchange: 'NSE' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1567.90, changePercent: 0.34, marketCap: '9.37L Cr', volume: '4.5M', category: 'stock', sector: 'Telecom', exchange: 'NSE' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1823.40, changePercent: -0.67, marketCap: '3.62L Cr', volume: '3.8M', category: 'stock', sector: 'Banking', exchange: 'NSE' },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3456.25, changePercent: 0.92, marketCap: '4.75L Cr', volume: '2.9M', category: 'stock', sector: 'Infrastructure', exchange: 'NSE' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', price: 7234.80, changePercent: -1.23, marketCap: '4.48L Cr', volume: '2.4M', category: 'stock', sector: 'Finance', exchange: 'NSE' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', price: 12456.70, changePercent: 0.45, marketCap: '3.92L Cr', volume: '1.1M', category: 'stock', sector: 'Auto', exchange: 'NSE' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', price: 1678.90, changePercent: 1.56, marketCap: '4.03L Cr', volume: '3.6M', category: 'stock', sector: 'Pharma', exchange: 'NSE' },
  { symbol: 'TITAN', name: 'Titan Company Ltd', price: 3245.60, changePercent: -0.89, marketCap: '2.88L Cr', volume: '2.2M', category: 'stock', sector: 'Consumer', exchange: 'NSE' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', price: 2867.30, changePercent: 0.23, marketCap: '2.75L Cr', volume: '1.8M', category: 'stock', sector: 'Consumer', exchange: 'NSE' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 467.85, changePercent: -0.56, marketCap: '2.44L Cr', volume: '7.2M', category: 'stock', sector: 'IT', exchange: 'NSE' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', price: 2534.20, changePercent: 0.12, marketCap: '2.44L Cr', volume: '0.8M', category: 'stock', sector: 'FMCG', exchange: 'NSE' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 978.45, changePercent: 2.34, marketCap: '3.60L Cr', volume: '22.1M', category: 'stock', sector: 'Auto', exchange: 'NSE' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3123.40, changePercent: -1.45, marketCap: '3.57L Cr', volume: '5.4M', category: 'stock', sector: 'Conglomerate', exchange: 'NSE' },

  // ──── INDICES ────
  { symbol: 'NIFTY50', name: 'NIFTY 50', price: 24678.90, changePercent: 0.72, marketCap: '', volume: '', category: 'index', sector: 'Index', exchange: 'NSE' },
  { symbol: 'SENSEX', name: 'S&P BSE Sensex', price: 81234.56, changePercent: 0.68, marketCap: '', volume: '', category: 'index', sector: 'Index', exchange: 'BSE' },
  { symbol: 'BANKNIFTY', name: 'NIFTY Bank', price: 51234.80, changePercent: 1.12, marketCap: '', volume: '', category: 'index', sector: 'Index', exchange: 'NSE' },
  { symbol: 'NIFTYIT', name: 'NIFTY IT', price: 38456.30, changePercent: -0.34, marketCap: '', volume: '', category: 'index', sector: 'Index', exchange: 'NSE' },
  { symbol: 'NIFTYPHARMA', name: 'NIFTY Pharma', price: 19876.40, changePercent: 1.23, marketCap: '', volume: '', category: 'index', sector: 'Index', exchange: 'NSE' },
];

let subscribers = [];
let currentAssets = JSON.parse(JSON.stringify(baseAssets));
let intervalId = null;

function randomFluctuation(price, maxPercent = 0.5) {
  const change = (Math.random() - 0.48) * maxPercent;
  return +(price * (1 + change / 100)).toFixed(2);
}

function updatePrices() {
  currentAssets = currentAssets.map((asset) => {
    if (asset.category === 'index') {
      // Indices move less aggressively
      const newPrice = randomFluctuation(asset.price, 0.3);
      const changePercent = +(((newPrice - asset.price) / asset.price) * 100 + asset.changePercent * 0.92).toFixed(2);
      return { ...asset, price: newPrice, changePercent: +changePercent.toFixed(2) };
    }
    const newPrice = randomFluctuation(asset.price);
    const changePercent = +(((newPrice - asset.price) / asset.price) * 100 + asset.changePercent * 0.9).toFixed(2);
    return { ...asset, price: newPrice, changePercent: +changePercent.toFixed(2) };
  });
  subscribers.forEach((cb) => cb([...currentAssets]));
}

// Subscribe to live price updates (3-second interval)
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

// Get current snapshot of all assets
export function getMarketData() {
  return [...currentAssets];
}

// Get stocks only (exclude indices)
export function getStocks() {
  return currentAssets.filter((a) => a.category === 'stock');
}

// Get indices only
export function getIndices() {
  return currentAssets.filter((a) => a.category === 'index');
}

// Get single asset by symbol
export function getAssetBySymbol(symbol) {
  return currentAssets.find((a) => a.symbol === symbol);
}

// Top gainers and losers
export function getTopMovers(assets, count = 5) {
  const stocks = (assets || currentAssets).filter((a) => a.category === 'stock');
  const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: sorted.filter((a) => a.changePercent > 0).slice(0, count),
    losers: sorted.filter((a) => a.changePercent < 0).slice(0, count),
  };
}

// Sector breakdown
export function getSectorBreakdown(assets) {
  const stocks = (assets || currentAssets).filter((a) => a.category === 'stock');
  const sectors = {};
  stocks.forEach((a) => {
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

// Generate simulated historical data for charts (in ₹)
export function generateHistoricalData(days = 30, startValue = 100000) {
  const data = [];
  let value = startValue;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.45) * (startValue * 0.015);
    value = Math.max(value + change, startValue * 0.7);
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: +value.toFixed(2),
    });
  }
  return data;
}

// NIFTY 50 historical monthly returns (simulated but realistic)
export function generateNiftyReturns() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const data = [];
  years.forEach((year) => {
    months.forEach((month, mIdx) => {
      if (year === 2026 && mIdx > 7) return;
      data.push({
        year,
        month,
        return: +((Math.random() * 16 - 5).toFixed(1)),
      });
    });
  });
  return data;
}
