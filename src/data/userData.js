// Fake user data for the profile and other features

export const demoUser = {
  name: 'Alex Morgan',
  email: 'demo@aiinvest.com',
  plan: 'Pro',
  memberSince: 'March 2024',
  avatar: null,
  phone: '+1 (555) 987-6543',
  location: 'San Francisco, CA',
  bio: 'AI-driven investor focused on crypto and tech. Using algorithmic strategies since 2021.',
  stats: {
    totalTrades: 847,
    successRate: 73.2,
    bestTrade: '+42.8% (SOL)',
    worstTrade: '-18.3% (AVAX)',
    avgHoldTime: '14 days',
    portfolioHigh: '$284,500',
    totalProfit: '$47,320',
    joinedStreak: '186 days',
  },
  badges: [
    { id: 1, name: 'First Trade', icon: '🎯', earned: '2024-03-16', description: 'Completed your first trade' },
    { id: 2, name: 'Diamond Hands', icon: '💎', earned: '2024-05-22', description: 'Held a position for 30+ days' },
    { id: 3, name: 'Diversifier', icon: '🌈', earned: '2024-06-10', description: 'Invested in 5+ asset categories' },
    { id: 4, name: 'AI Pioneer', icon: '🤖', earned: '2024-04-01', description: 'Used AI agents 50+ times' },
    { id: 5, name: 'Profit Machine', icon: '💰', earned: '2024-07-15', description: 'Achieved 50%+ total returns' },
    { id: 6, name: 'Risk Manager', icon: '🛡️', earned: '2024-08-03', description: 'Maintained risk score below 40 for 30 days' },
    { id: 7, name: 'Early Bird', icon: '🌅', earned: '2024-03-15', description: 'Joined during beta' },
    { id: 8, name: 'Streak Master', icon: '🔥', earned: '2024-09-01', description: '100-day login streak' },
    { id: 9, name: 'Whale', icon: '🐋', earned: '2025-01-12', description: 'Portfolio exceeded $100K' },
    { id: 10, name: 'Social Star', icon: '⭐', earned: '2025-02-20', description: 'Referred 5+ friends' },
  ],
};

export const fakeNotifications = [
  { id: 1, type: 'price_alert', title: 'BTC Price Alert', message: 'Bitcoin crossed $67,000 — up 3.2% in 24h', time: '2 min ago', read: false, icon: '📈' },
  { id: 2, type: 'agent', title: 'Agent Pipeline Complete', message: 'Your moderate-risk simulation finished with 5 trades recommended', time: '15 min ago', read: false, icon: '🤖' },
  { id: 3, type: 'portfolio', title: 'Portfolio Update', message: 'Your portfolio value increased by +$1,240 today', time: '1 hour ago', read: false, icon: '💰' },
  { id: 4, type: 'price_alert', title: 'ETH Price Alert', message: 'Ethereum dropped below $3,400 support level', time: '2 hours ago', read: true, icon: '📉' },
  { id: 5, type: 'system', title: 'New Feature Available', message: 'AI Agent v2.0 with improved strategy engine is now live', time: '5 hours ago', read: true, icon: '✨' },
  { id: 6, type: 'agent', title: 'Risk Assessment Updated', message: 'Market volatility increased — your risk score adjusted to 62/100', time: '1 day ago', read: true, icon: '🛡️' },
  { id: 7, type: 'portfolio', title: 'Rebalance Suggestion', message: 'Your SOL allocation exceeds 30% — consider rebalancing', time: '1 day ago', read: true, icon: '⚖️' },
  { id: 8, type: 'social', title: 'New Follower', message: 'TraderJake92 started following your portfolio', time: '1 day ago', read: true, icon: '👤' },
  { id: 9, type: 'price_alert', title: 'NVDA All-Time High', message: 'NVIDIA hit a new all-time high of $892.45', time: '2 days ago', read: true, icon: '🚀' },
  { id: 10, type: 'achievement', title: 'Badge Earned!', message: 'You earned the "Whale" badge — portfolio exceeded $100K', time: '3 days ago', read: true, icon: '🏆' },
  { id: 11, type: 'system', title: 'Scheduled Maintenance', message: 'Platform will undergo maintenance on Sunday 2 AM - 4 AM EST', time: '3 days ago', read: true, icon: '🔧' },
  { id: 12, type: 'copy_trade', title: 'Copy Trade Executed', message: 'AlphaTrader bought $5,000 of SOL — your copy trade executed', time: '4 days ago', read: true, icon: '📋' },
];

export const fakeTransactions = [
  { id: 1, type: 'buy', symbol: 'BTC', name: 'Bitcoin', amount: 12500, price: 67234.50, quantity: 0.1859, date: '2026-04-09T14:23:00', status: 'completed', fee: 12.50 },
  { id: 2, type: 'buy', symbol: 'ETH', name: 'Ethereum', amount: 8000, price: 3421.80, quantity: 2.338, date: '2026-04-09T14:23:00', status: 'completed', fee: 8.00 },
  { id: 3, type: 'buy', symbol: 'SOL', name: 'Solana', amount: 5000, price: 178.45, quantity: 28.02, date: '2026-04-09T14:23:00', status: 'completed', fee: 5.00 },
  { id: 4, type: 'sell', symbol: 'AVAX', name: 'Avalanche', amount: 2200, price: 42.15, quantity: 52.2, date: '2026-04-08T09:15:00', status: 'completed', fee: 2.20 },
  { id: 5, type: 'buy', symbol: 'LINK', name: 'Chainlink', amount: 3500, price: 18.92, quantity: 185.0, date: '2026-04-07T16:42:00', status: 'completed', fee: 3.50 },
  { id: 6, type: 'sell', symbol: 'BTC', name: 'Bitcoin', amount: 6000, price: 65890.20, quantity: 0.091, date: '2026-04-06T11:30:00', status: 'completed', fee: 6.00 },
  { id: 7, type: 'buy', symbol: 'DOT', name: 'Polkadot', amount: 1800, price: 8.45, quantity: 213.0, date: '2026-04-05T08:55:00', status: 'completed', fee: 1.80 },
  { id: 8, type: 'buy', symbol: 'MATIC', name: 'Polygon', amount: 2500, price: 0.92, quantity: 2717.4, date: '2026-04-04T13:20:00', status: 'completed', fee: 2.50 },
  { id: 9, type: 'sell', symbol: 'ETH', name: 'Ethereum', amount: 4500, price: 3380.10, quantity: 1.331, date: '2026-04-03T17:10:00', status: 'completed', fee: 4.50 },
  { id: 10, type: 'buy', symbol: 'ADA', name: 'Cardano', amount: 1500, price: 0.65, quantity: 2307.7, date: '2026-04-02T10:05:00', status: 'completed', fee: 1.50 },
  { id: 11, type: 'sell', symbol: 'SOL', name: 'Solana', amount: 3200, price: 172.30, quantity: 18.57, date: '2026-04-01T15:45:00', status: 'completed', fee: 3.20 },
  { id: 12, type: 'buy', symbol: 'BTC', name: 'Bitcoin', amount: 15000, price: 64500.00, quantity: 0.2326, date: '2026-03-30T09:30:00', status: 'completed', fee: 15.00 },
  { id: 13, type: 'buy', symbol: 'NVDA', name: 'NVIDIA Corp.', amount: 8500, price: 856.20, quantity: 9.93, date: '2026-03-28T10:12:00', status: 'completed', fee: 8.50 },
  { id: 14, type: 'sell', symbol: 'DOGE', name: 'Dogecoin', amount: 1200, price: 0.158, quantity: 7594.9, date: '2026-03-27T14:33:00', status: 'completed', fee: 1.20 },
  { id: 15, type: 'buy', symbol: 'MSFT', name: 'Microsoft Corp.', amount: 6200, price: 415.80, quantity: 14.91, date: '2026-03-26T09:45:00', status: 'completed', fee: 6.20 },
  { id: 16, type: 'buy', symbol: 'AAPL', name: 'Apple Inc.', amount: 4800, price: 182.30, quantity: 26.33, date: '2026-03-25T11:20:00', status: 'completed', fee: 4.80 },
  { id: 17, type: 'sell', symbol: 'XRP', name: 'Ripple', amount: 980, price: 0.58, quantity: 1689.7, date: '2026-03-24T16:55:00', status: 'completed', fee: 0.98 },
  { id: 18, type: 'buy', symbol: 'GOOGL', name: 'Alphabet Inc.', amount: 5500, price: 168.45, quantity: 32.65, date: '2026-03-23T10:30:00', status: 'completed', fee: 5.50 },
  { id: 19, type: 'buy', symbol: 'AMZN', name: 'Amazon.com Inc.', amount: 4200, price: 179.90, quantity: 23.35, date: '2026-03-22T13:15:00', status: 'completed', fee: 4.20 },
  { id: 20, type: 'sell', symbol: 'LINK', name: 'Chainlink', amount: 2800, price: 19.45, quantity: 143.96, date: '2026-03-21T08:40:00', status: 'completed', fee: 2.80 },
  { id: 21, type: 'buy', symbol: 'GOLD', name: 'Gold', amount: 10000, price: 2298.50, quantity: 4.351, date: '2026-03-20T09:00:00', status: 'completed', fee: 10.00 },
  { id: 22, type: 'buy', symbol: 'SPY', name: 'S&P 500 ETF', amount: 7500, price: 505.60, quantity: 14.84, date: '2026-03-19T10:15:00', status: 'completed', fee: 7.50 },
  { id: 23, type: 'sell', symbol: 'META', name: 'Meta Platforms', amount: 3900, price: 498.20, quantity: 7.83, date: '2026-03-18T14:22:00', status: 'completed', fee: 3.90 },
  { id: 24, type: 'buy', symbol: 'QQQ', name: 'Nasdaq 100 ETF', amount: 5800, price: 438.75, quantity: 13.22, date: '2026-03-17T11:30:00', status: 'completed', fee: 5.80 },
  { id: 25, type: 'buy', symbol: 'ATOM', name: 'Cosmos', amount: 1600, price: 10.85, quantity: 147.47, date: '2026-03-16T15:45:00', status: 'completed', fee: 1.60 },
  { id: 26, type: 'sell', symbol: 'ADA', name: 'Cardano', amount: 1100, price: 0.72, quantity: 1527.8, date: '2026-03-15T09:10:00', status: 'completed', fee: 1.10 },
  { id: 27, type: 'buy', symbol: 'UNI', name: 'Uniswap', amount: 2200, price: 13.15, quantity: 167.3, date: '2026-03-14T12:30:00', status: 'completed', fee: 2.20 },
  { id: 28, type: 'buy', symbol: 'ARKK', name: 'ARK Innovation', amount: 3100, price: 46.80, quantity: 66.24, date: '2026-03-13T10:45:00', status: 'completed', fee: 3.10 },
  { id: 29, type: 'sell', symbol: 'TSLA', name: 'Tesla Inc.', amount: 5200, price: 255.30, quantity: 20.37, date: '2026-03-12T14:00:00', status: 'completed', fee: 5.20 },
  { id: 30, type: 'buy', symbol: 'AMD', name: 'AMD Inc.', amount: 3800, price: 158.90, quantity: 23.92, date: '2026-03-11T09:30:00', status: 'completed', fee: 3.80 },
  { id: 31, type: 'buy', symbol: 'BTC', name: 'Bitcoin', amount: 20000, price: 62800.00, quantity: 0.3185, date: '2026-03-10T08:15:00', status: 'completed', fee: 20.00 },
  { id: 32, type: 'sell', symbol: 'NVDA', name: 'NVIDIA Corp.', amount: 4200, price: 845.50, quantity: 4.97, date: '2026-03-09T16:30:00', status: 'completed', fee: 4.20 },
  { id: 33, type: 'buy', symbol: 'CRM', name: 'Salesforce Inc.', amount: 2800, price: 265.40, quantity: 10.55, date: '2026-03-08T11:00:00', status: 'completed', fee: 2.80 },
  { id: 34, type: 'buy', symbol: 'NFLX', name: 'Netflix Inc.', amount: 4500, price: 612.80, quantity: 7.34, date: '2026-03-07T13:45:00', status: 'completed', fee: 4.50 },
  { id: 35, type: 'sell', symbol: 'DOT', name: 'Polkadot', amount: 900, price: 9.12, quantity: 98.68, date: '2026-03-06T10:20:00', status: 'completed', fee: 0.90 },
  { id: 36, type: 'buy', symbol: 'V', name: 'Visa Inc.', amount: 3200, price: 274.50, quantity: 11.66, date: '2026-03-05T09:30:00', status: 'completed', fee: 3.20 },
  { id: 37, type: 'buy', symbol: 'JPM', name: 'JP Morgan Chase', amount: 2600, price: 192.40, quantity: 13.51, date: '2026-03-04T14:15:00', status: 'completed', fee: 2.60 },
  { id: 38, type: 'sell', symbol: 'ETH', name: 'Ethereum', amount: 6800, price: 3510.20, quantity: 1.937, date: '2026-03-03T11:40:00', status: 'completed', fee: 6.80 },
  { id: 39, type: 'buy', symbol: 'SLV', name: 'Silver', amount: 1500, price: 27.20, quantity: 55.15, date: '2026-03-02T10:00:00', status: 'completed', fee: 1.50 },
  { id: 40, type: 'buy', symbol: 'DIS', name: 'Walt Disney Co.', amount: 2100, price: 108.75, quantity: 19.31, date: '2026-03-01T09:45:00', status: 'completed', fee: 2.10 },
  { id: 41, type: 'sell', symbol: 'SOL', name: 'Solana', amount: 4800, price: 185.60, quantity: 25.86, date: '2026-02-28T15:30:00', status: 'completed', fee: 4.80 },
  { id: 42, type: 'buy', symbol: 'BAC', name: 'Bank of America', amount: 1800, price: 36.50, quantity: 49.32, date: '2026-02-27T10:10:00', status: 'completed', fee: 1.80 },
  { id: 43, type: 'buy', symbol: 'INTC', name: 'Intel Corp.', amount: 1200, price: 33.40, quantity: 35.93, date: '2026-02-26T13:55:00', status: 'completed', fee: 1.20 },
  { id: 44, type: 'sell', symbol: 'MATIC', name: 'Polygon', amount: 1600, price: 0.98, quantity: 1632.7, date: '2026-02-25T08:30:00', status: 'completed', fee: 1.60 },
  { id: 45, type: 'buy', symbol: 'WMT', name: 'Walmart Inc.', amount: 2400, price: 66.80, quantity: 35.93, date: '2026-02-24T11:20:00', status: 'completed', fee: 2.40 },
  { id: 46, type: 'buy', symbol: 'PYPL', name: 'PayPal Holdings', amount: 1900, price: 64.20, quantity: 29.60, date: '2026-02-23T14:40:00', status: 'completed', fee: 1.90 },
  { id: 47, type: 'sell', symbol: 'BTC', name: 'Bitcoin', amount: 8500, price: 68200.00, quantity: 0.1246, date: '2026-02-22T09:15:00', status: 'completed', fee: 8.50 },
  { id: 48, type: 'buy', symbol: 'VTI', name: 'Total Stock Market', amount: 4000, price: 262.30, quantity: 15.25, date: '2026-02-21T10:30:00', status: 'completed', fee: 4.00 },
  { id: 49, type: 'buy', symbol: 'IWM', name: 'Russell 2000 ETF', amount: 2800, price: 201.50, quantity: 13.90, date: '2026-02-20T11:45:00', status: 'completed', fee: 2.80 },
  { id: 50, type: 'sell', symbol: 'GOOGL', name: 'Alphabet Inc.', amount: 3600, price: 170.25, quantity: 21.14, date: '2026-02-19T15:00:00', status: 'completed', fee: 3.60 },
  { id: 51, type: 'buy', symbol: 'JNJ', name: 'Johnson & Johnson', amount: 2200, price: 152.80, quantity: 14.40, date: '2026-02-18T09:30:00', status: 'completed', fee: 2.20 },
  { id: 52, type: 'buy', symbol: 'USO', name: 'Crude Oil', amount: 3000, price: 76.90, quantity: 39.01, date: '2026-02-17T10:00:00', status: 'completed', fee: 3.00 },
  { id: 53, type: 'buy', symbol: 'DOGE', name: 'Dogecoin', amount: 800, price: 0.142, quantity: 5633.8, date: '2026-02-16T12:30:00', status: 'pending', fee: 0.80 },
  { id: 54, type: 'sell', symbol: 'AMZN', name: 'Amazon.com Inc.', amount: 2500, price: 183.45, quantity: 13.63, date: '2026-02-15T14:20:00', status: 'failed', fee: 0 },
  { id: 55, type: 'buy', symbol: 'NG', name: 'Natural Gas', amount: 1000, price: 2.55, quantity: 392.16, date: '2026-02-14T09:00:00', status: 'completed', fee: 1.00 },
];

// Portfolio value snapshots (90 days)
export const portfolioSnapshots = (() => {
  const data = [];
  let value = 142000;
  const now = Date.now();
  for (let i = 90; i >= 0; i--) {
    const dailyChange = (Math.random() - 0.46) * 2800;
    value = Math.max(value + dailyChange, 100000);
    data.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      value: Math.round(value),
      change: +(dailyChange / value * 100).toFixed(2),
    });
  }
  return data;
})();

// Activity log
export const activityLog = [
  { id: 1, action: 'Logged in', device: 'Chrome · macOS', timestamp: '2026-04-09T14:20:00', ip: '192.168.1.xx' },
  { id: 2, action: 'Ran AI Pipeline', detail: 'Moderate risk · $50,000', timestamp: '2026-04-09T14:23:00' },
  { id: 3, action: 'Executed 3 trades', detail: 'BTC, ETH, SOL', timestamp: '2026-04-09T14:23:30' },
  { id: 4, action: 'Changed settings', detail: 'Enabled auto-rebalance', timestamp: '2026-04-08T18:30:00' },
  { id: 5, action: 'Logged in', device: 'Safari · iPhone', timestamp: '2026-04-08T09:10:00', ip: '10.0.0.xx' },
  { id: 6, action: 'Viewed Risk Report', detail: 'Score: 58/100', timestamp: '2026-04-07T16:45:00' },
  { id: 7, action: 'Updated profile', detail: 'Changed bio', timestamp: '2026-04-06T11:20:00' },
  { id: 8, action: 'Ran AI Pipeline', detail: 'Aggressive risk · $100,000', timestamp: '2026-04-05T10:30:00' },
  { id: 9, action: 'Added price alert', detail: 'BTC > $70,000', timestamp: '2026-04-04T14:15:00' },
  { id: 10, action: 'Logged in', device: 'Firefox · Windows', timestamp: '2026-04-03T08:00:00', ip: '172.16.0.xx' },
];

export const defaultSettings = {
  darkMode: true,
  compactLayout: false,
  animations: true,
  priceAlerts: true,
  agentCompletion: true,
  portfolioUpdates: false,
  maxAllocation: '30%',
  stopLoss: '15%',
  autoRebalance: false,
  autoSave: true,
  cacheData: true,
};

// Financial Goals
export const financialGoals = [
  { id: 1, name: 'Emergency Fund', target: 25000, current: 18750, icon: '🏥', color: '#ef4444', deadline: '2026-06-30' },
  { id: 2, name: 'Retirement Fund', target: 500000, current: 142000, icon: '🏖️', color: '#22c55e', deadline: '2045-01-01' },
  { id: 3, name: 'House Down Payment', target: 100000, current: 67500, icon: '🏠', color: '#4f8cff', deadline: '2027-12-31' },
  { id: 4, name: 'Travel Fund', target: 15000, current: 8200, icon: '✈️', color: '#f59e0b', deadline: '2026-12-31' },
  { id: 5, name: 'Education Fund', target: 50000, current: 12000, icon: '📚', color: '#a78bfa', deadline: '2028-08-01' },
];

// Price alerts
export const priceAlerts = [
  { id: 1, symbol: 'BTC', condition: 'above', price: 70000, active: true, triggered: false },
  { id: 2, symbol: 'ETH', condition: 'below', price: 3200, active: true, triggered: false },
  { id: 3, symbol: 'SOL', condition: 'above', price: 200, active: true, triggered: false },
  { id: 4, symbol: 'NVDA', condition: 'above', price: 900, active: true, triggered: false },
  { id: 5, symbol: 'AAPL', condition: 'below', price: 175, active: false, triggered: true },
  { id: 6, symbol: 'TSLA', condition: 'above', price: 300, active: true, triggered: false },
  { id: 7, symbol: 'DOGE', condition: 'above', price: 0.20, active: true, triggered: false },
  { id: 8, symbol: 'GOLD', condition: 'above', price: 2400, active: true, triggered: false },
];

// Referral data
export const referralData = {
  code: 'ALEXM2024',
  link: 'https://aiinvest.com/ref/ALEXM2024',
  totalReferrals: 7,
  activeReferrals: 5,
  totalEarned: 350,
  pendingRewards: 50,
  tier: 'Silver',
  nextTier: 'Gold',
  nextTierRequirement: 10,
  referrals: [
    { id: 1, name: 'Sarah Chen', joinDate: '2025-11-15', status: 'active', earned: 50, avatar: 'SC' },
    { id: 2, name: 'Mike Johnson', joinDate: '2025-12-02', status: 'active', earned: 50, avatar: 'MJ' },
    { id: 3, name: 'Emma Davis', joinDate: '2026-01-10', status: 'active', earned: 50, avatar: 'ED' },
    { id: 4, name: 'James Wilson', joinDate: '2026-02-05', status: 'active', earned: 50, avatar: 'JW' },
    { id: 5, name: 'Lisa Park', joinDate: '2026-02-28', status: 'active', earned: 50, avatar: 'LP' },
    { id: 6, name: 'Tom Brown', joinDate: '2026-03-15', status: 'inactive', earned: 50, avatar: 'TB' },
    { id: 7, name: 'Ana Martinez', joinDate: '2026-04-01', status: 'pending', earned: 0, avatar: 'AM' },
  ],
  tiers: [
    { name: 'Bronze', minReferrals: 0, bonus: '$25/referral', color: '#cd7f32' },
    { name: 'Silver', minReferrals: 5, bonus: '$50/referral', color: '#c0c0c0' },
    { name: 'Gold', minReferrals: 10, bonus: '$100/referral', color: '#fbbf24' },
    { name: 'Platinum', minReferrals: 25, bonus: '$200/referral + 1% rev share', color: '#e2e8f0' },
  ],
};

// Billing / Subscription data
export const billingData = {
  plan: 'Pro',
  price: '$29/mo',
  billingCycle: 'Monthly',
  nextBillingDate: '2026-05-09',
  paymentMethod: { type: 'card', last4: '4242', brand: 'Visa', expiry: '12/28' },
  invoices: [
    { id: 'INV-2026-04', date: '2026-04-01', amount: 29.00, status: 'paid' },
    { id: 'INV-2026-03', date: '2026-03-01', amount: 29.00, status: 'paid' },
    { id: 'INV-2026-02', date: '2026-02-01', amount: 29.00, status: 'paid' },
    { id: 'INV-2026-01', date: '2026-01-01', amount: 29.00, status: 'paid' },
    { id: 'INV-2025-12', date: '2025-12-01', amount: 29.00, status: 'paid' },
    { id: 'INV-2025-11', date: '2025-11-01', amount: 29.00, status: 'paid' },
  ],
  plans: [
    { name: 'Free', price: '$0', features: ['5 AI simulations/mo', 'Basic market data', '7 assets', 'Email support'] },
    { name: 'Pro', price: '$29/mo', features: ['Unlimited simulations', 'Real-time data', '35+ assets', 'All AI agents', 'Priority support', 'Copy trading'], popular: true },
    { name: 'Enterprise', price: '$99/mo', features: ['Everything in Pro', 'API access', 'Custom agents', 'Dedicated support', 'White-label options', 'Tax reports'] },
  ],
};
