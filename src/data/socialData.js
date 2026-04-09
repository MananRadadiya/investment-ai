// Social / Community fake data

export const leaderboard = [
  { rank: 1, name: 'AlphaTrader', avatar: 'AT', returns: 187.4, winRate: 82.1, trades: 1243, strategy: 'Momentum', badge: '🏆', following: false },
  { rank: 2, name: 'CryptoWhale99', avatar: 'CW', returns: 156.8, winRate: 78.5, trades: 892, strategy: 'Swing', badge: '🥈', following: true },
  { rank: 3, name: 'QuantMaster', avatar: 'QM', returns: 142.3, winRate: 85.2, trades: 2157, strategy: 'Algorithmic', badge: '🥉', following: false },
  { rank: 4, name: 'DeFiDegen', avatar: 'DD', returns: 134.7, winRate: 71.3, trades: 3421, strategy: 'DeFi Yield', badge: '', following: false },
  { rank: 5, name: 'ValueHunter', avatar: 'VH', returns: 128.9, winRate: 76.8, trades: 456, strategy: 'Value', badge: '', following: true },
  { rank: 6, name: 'TechBull', avatar: 'TB', returns: 121.5, winRate: 74.2, trades: 788, strategy: 'Growth', badge: '', following: false },
  { rank: 7, name: 'GoldBug2024', avatar: 'GB', returns: 115.2, winRate: 80.4, trades: 234, strategy: 'Commodities', badge: '', following: false },
  { rank: 8, name: 'AITraderPro', avatar: 'AI', returns: 108.7, winRate: 77.9, trades: 1567, strategy: 'AI-Driven', badge: '', following: false },
  { rank: 9, name: 'DiamondHands', avatar: 'DH', returns: 102.3, winRate: 69.8, trades: 156, strategy: 'HODL', badge: '', following: true },
  { rank: 10, name: 'SwingKing', avatar: 'SK', returns: 98.6, winRate: 73.5, trades: 945, strategy: 'Swing', badge: '', following: false },
  { rank: 11, name: 'MacroView', avatar: 'MV', returns: 94.1, winRate: 81.2, trades: 312, strategy: 'Macro', badge: '', following: false },
  { rank: 12, name: 'NightOwlTrader', avatar: 'NO', returns: 91.8, winRate: 72.4, trades: 678, strategy: 'After Hours', badge: '', following: false },
  { rank: 13, name: 'ETFWizard', avatar: 'EW', returns: 87.5, winRate: 79.1, trades: 198, strategy: 'Passive+', badge: '', following: false },
  { rank: 14, name: 'RiskManager_X', avatar: 'RM', returns: 84.2, winRate: 86.3, trades: 534, strategy: 'Risk Parity', badge: '', following: false },
  { rank: 15, name: 'MomentumPro', avatar: 'MP', returns: 81.6, winRate: 70.8, trades: 1122, strategy: 'Momentum', badge: '', following: false },
  { rank: 16, name: 'AlexMorgan', avatar: 'AM', returns: 73.2, winRate: 73.2, trades: 847, strategy: 'AI-Driven', badge: '⭐', following: false, isCurrentUser: true },
  { rank: 17, name: 'DipBuyer', avatar: 'DB', returns: 69.4, winRate: 67.5, trades: 423, strategy: 'Contrarian', badge: '', following: false },
  { rank: 18, name: 'StealthWealth', avatar: 'SW', returns: 65.8, winRate: 75.2, trades: 267, strategy: 'Dividend', badge: '', following: false },
  { rank: 19, name: 'ChartNinja', avatar: 'CN', returns: 62.1, winRate: 71.9, trades: 891, strategy: 'Technical', badge: '', following: false },
  { rank: 20, name: 'NewbieBull', avatar: 'NB', returns: 58.3, winRate: 64.2, trades: 89, strategy: 'Learning', badge: '', following: false },
];

export const communityPosts = [
  {
    id: 1, author: 'AlphaTrader', avatar: 'AT', time: '30 min ago',
    content: 'Just closed my NVDA position at $885 — locked in 32% gains since February. AI chip demand is real but valuation is stretched. Taking profits here.',
    likes: 142, comments: 23, tags: ['NVDA', 'Take Profit'],
    sentiment: 'neutral',
  },
  {
    id: 2, author: 'CryptoWhale99', avatar: 'CW', time: '1 hour ago',
    content: 'BTC holding $67K like a champ despite ETF outflows. This is the accumulation phase before the next leg up. Loading more at any dip below $65K.',
    likes: 98, comments: 45, tags: ['BTC', 'Bullish'],
    sentiment: 'bullish',
  },
  {
    id: 3, author: 'QuantMaster', avatar: 'QM', time: '2 hours ago',
    content: 'My algo detected unusual options activity in $AMD — someone bought $12M in June calls at $180 strike. Institutional positioning for earnings?',
    likes: 234, comments: 67, tags: ['AMD', 'Options', 'Alert'],
    sentiment: 'bullish',
  },
  {
    id: 4, author: 'DeFiDegen', avatar: 'DD', time: '3 hours ago',
    content: 'Solana DeFi yields are insane right now — getting 18% APY on SOL-USDC LP on Raydium. Risk? Yes. Worth it? Also yes. 🔥',
    likes: 76, comments: 34, tags: ['SOL', 'DeFi', 'Yield'],
    sentiment: 'bullish',
  },
  {
    id: 5, author: 'ValueHunter', avatar: 'VH', time: '4 hours ago',
    content: 'Intel at $31 is a deep value play. Yeah, they lost the AI chip war to NVDA, but their fab business + government subsidies make this a solid 3-year hold.',
    likes: 56, comments: 89, tags: ['INTC', 'Value', 'Long-term'],
    sentiment: 'bullish',
  },
  {
    id: 6, author: 'GoldBug2024', avatar: 'GB', time: '5 hours ago',
    content: 'Central banks bought more gold in Q1 than any quarter in history. This isn\'t just a trade, it\'s a structural shift away from USD reserves.',
    likes: 112, comments: 28, tags: ['GOLD', 'Macro', 'Central Banks'],
    sentiment: 'bullish',
  },
  {
    id: 7, author: 'TechBull', avatar: 'TB', time: '6 hours ago',
    content: 'META is the most undervalued mega-cap tech stock. Trading at 22x forward PE with 20%+ revenue growth. The AI ad targeting improvements are a game changer.',
    likes: 89, comments: 41, tags: ['META', 'Value', 'AI'],
    sentiment: 'bullish',
  },
  {
    id: 8, author: 'DiamondHands', avatar: 'DH', time: '8 hours ago',
    content: 'Been holding ETH since $1,200. Not selling until $10K. The Dencun upgrade just made L2s 90% cheaper. Ecosystem growth is inevitable. 💎🙌',
    likes: 167, comments: 52, tags: ['ETH', 'HODL'],
    sentiment: 'bullish',
  },
  {
    id: 9, author: 'AITraderPro', avatar: 'AI', time: '10 hours ago',
    content: 'Ran my risk model on the current portfolio: Sharpe ratio 1.8, max drawdown estimate -12.3%. Comfortable with this risk-reward. AI agents >  gut feelings.',
    likes: 45, comments: 15, tags: ['AI', 'Risk', 'Strategy'],
    sentiment: 'neutral',
  },
  {
    id: 10, author: 'MacroView', avatar: 'MV', time: '12 hours ago',
    content: 'The yield curve just un-inverted for the first time in 18 months. Historically, THIS is when recessions start, not when it inverts. Stay cautious.',
    likes: 198, comments: 78, tags: ['Macro', 'Recession', 'Bonds'],
    sentiment: 'bearish',
  },
  {
    id: 11, author: 'SwingKing', avatar: 'SK', time: '1 day ago',
    content: 'TSLA setting up a classic cup-and-handle pattern on the daily chart. Entry at $245, target $290, stop at $232. R:R of 3.5:1.',
    likes: 67, comments: 31, tags: ['TSLA', 'Technical', 'Swing'],
    sentiment: 'bullish',
  },
  {
    id: 12, author: 'NightOwlTrader', avatar: 'NO', time: '1 day ago',
    content: 'After-hours trading tip: most earnings surprises happen in the first 15 minutes. I set limit orders 5% above/below close and catch the move.',
    likes: 123, comments: 56, tags: ['Strategy', 'After Hours', 'Tip'],
    sentiment: 'neutral',
  },
];

export const copyTradingSignals = [
  { id: 1, trader: 'AlphaTrader', action: 'buy', symbol: 'SOL', amount: 5000, price: 178.45, time: '30 min ago', confidence: 92 },
  { id: 2, trader: 'CryptoWhale99', action: 'buy', symbol: 'BTC', amount: 25000, price: 67234.50, time: '1 hour ago', confidence: 88 },
  { id: 3, trader: 'QuantMaster', action: 'sell', symbol: 'TSLA', amount: 8000, price: 248.42, time: '2 hours ago', confidence: 85 },
  { id: 4, trader: 'TechBull', action: 'buy', symbol: 'META', amount: 6000, price: 502.30, time: '3 hours ago', confidence: 90 },
  { id: 5, trader: 'ValueHunter', action: 'buy', symbol: 'INTC', amount: 3000, price: 31.25, time: '4 hours ago', confidence: 78 },
  { id: 6, trader: 'GoldBug2024', action: 'buy', symbol: 'GOLD', amount: 15000, price: 2341.50, time: '5 hours ago', confidence: 94 },
  { id: 7, trader: 'DeFiDegen', action: 'buy', symbol: 'UNI', amount: 2000, price: 12.34, time: '6 hours ago', confidence: 72 },
  { id: 8, trader: 'AlphaTrader', action: 'sell', symbol: 'NVDA', amount: 12000, price: 878.36, time: '8 hours ago', confidence: 86 },
];

// Fear & Greed Index
export const fearGreedIndex = {
  value: 68,
  label: 'Greed',
  history: [
    { date: 'Apr 9', value: 68 },
    { date: 'Apr 8', value: 72 },
    { date: 'Apr 7', value: 65 },
    { date: 'Apr 6', value: 58 },
    { date: 'Apr 5', value: 62 },
    { date: 'Apr 4', value: 55 },
    { date: 'Apr 3', value: 51 },
    { date: 'Apr 2', value: 48 },
    { date: 'Apr 1', value: 45 },
    { date: 'Mar 31', value: 42 },
    { date: 'Mar 30', value: 38 },
    { date: 'Mar 29', value: 44 },
    { date: 'Mar 28', value: 50 },
    { date: 'Mar 27', value: 53 },
  ],
  components: {
    volatility: { value: 62, label: 'Low Volatility' },
    momentum: { value: 74, label: 'Strong Momentum' },
    volume: { value: 58, label: 'Moderate Volume' },
    socialMedia: { value: 71, label: 'Bullish Sentiment' },
    surveys: { value: 65, label: 'Greed' },
  },
};
