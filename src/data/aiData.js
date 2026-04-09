// ─── AI & Intelligence Data ───

// Sentiment Analysis per asset
export const sentimentData = {
  BTC: { overall: 78, label: 'Bullish', social: 82, news: 74, technical: 77, trend: [65, 70, 68, 72, 75, 78, 82, 80, 78, 74, 76, 78] },
  ETH: { overall: 62, label: 'Slightly Bullish', social: 58, news: 65, technical: 63, trend: [55, 58, 60, 62, 59, 61, 63, 65, 62, 60, 63, 62] },
  SOL: { overall: 85, label: 'Very Bullish', social: 90, news: 80, technical: 84, trend: [70, 72, 75, 78, 80, 82, 85, 88, 86, 84, 85, 85] },
  ADA: { overall: 45, label: 'Neutral', social: 48, news: 42, technical: 44, trend: [50, 48, 46, 44, 42, 45, 48, 46, 44, 45, 46, 45] },
  AVAX: { overall: 72, label: 'Bullish', social: 75, news: 68, technical: 72, trend: [60, 62, 65, 68, 70, 72, 74, 72, 70, 72, 73, 72] },
  DOT: { overall: 38, label: 'Slightly Bearish', social: 35, news: 40, technical: 38, trend: [45, 42, 40, 38, 36, 35, 38, 40, 38, 36, 37, 38] },
  LINK: { overall: 65, label: 'Slightly Bullish', social: 62, news: 68, technical: 64, trend: [58, 60, 62, 64, 66, 65, 63, 64, 66, 65, 64, 65] },
  AAPL: { overall: 70, label: 'Bullish', social: 68, news: 72, technical: 70, trend: [65, 66, 68, 70, 72, 71, 69, 70, 71, 70, 69, 70] },
  NVDA: { overall: 88, label: 'Very Bullish', social: 92, news: 85, technical: 86, trend: [75, 78, 80, 82, 85, 88, 90, 88, 86, 87, 88, 88] },
  TSLA: { overall: 52, label: 'Neutral', social: 60, news: 45, technical: 50, trend: [55, 52, 48, 50, 52, 55, 53, 50, 48, 50, 52, 52] },
  MSFT: { overall: 74, label: 'Bullish', social: 70, news: 78, technical: 74, trend: [68, 70, 72, 74, 75, 74, 72, 73, 74, 75, 74, 74] },
  GOOGL: { overall: 68, label: 'Slightly Bullish', social: 65, news: 70, technical: 68, trend: [62, 64, 66, 68, 70, 68, 66, 67, 68, 69, 68, 68] },
  AMZN: { overall: 72, label: 'Bullish', social: 70, news: 74, technical: 71, trend: [65, 67, 69, 70, 72, 74, 73, 71, 72, 73, 72, 72] },
  META: { overall: 56, label: 'Neutral', social: 52, news: 58, technical: 57, trend: [50, 52, 54, 55, 56, 58, 57, 55, 56, 57, 56, 56] },
  DOGE: { overall: 48, label: 'Neutral', social: 65, news: 30, technical: 48, trend: [55, 50, 45, 48, 52, 55, 50, 45, 48, 50, 48, 48] },
  GOLD: { overall: 75, label: 'Bullish', social: 60, news: 82, technical: 78, trend: [68, 70, 72, 74, 76, 78, 76, 74, 75, 76, 75, 75] },
  SPY: { overall: 70, label: 'Bullish', social: 65, news: 72, technical: 72, trend: [65, 66, 68, 70, 72, 71, 69, 70, 71, 70, 70, 70] },
};

// Word cloud data for sentiment
export const wordCloudData = {
  BTC: [
    { text: 'halving', weight: 95 }, { text: 'bullish', weight: 88 }, { text: 'institutional', weight: 82 },
    { text: 'ETF', weight: 78 }, { text: 'adoption', weight: 75 }, { text: 'rally', weight: 72 },
    { text: 'support', weight: 68 }, { text: 'breakout', weight: 65 }, { text: 'whale', weight: 60 },
    { text: 'accumulation', weight: 58 }, { text: 'moon', weight: 55 }, { text: 'diamond', weight: 52 },
    { text: 'hodl', weight: 50 }, { text: 'defi', weight: 48 }, { text: 'mining', weight: 45 },
    { text: 'regulation', weight: 42 }, { text: 'store-of-value', weight: 40 }, { text: 'volatile', weight: 38 },
    { text: 'pump', weight: 35 }, { text: 'resistance', weight: 32 },
  ],
  ETH: [
    { text: 'staking', weight: 90 }, { text: 'layer2', weight: 85 }, { text: 'dApps', weight: 80 },
    { text: 'smart-contracts', weight: 78 }, { text: 'gas-fees', weight: 72 }, { text: 'merge', weight: 68 },
    { text: 'DeFi', weight: 65 }, { text: 'NFT', weight: 60 }, { text: 'scalability', weight: 55 },
    { text: 'burn', weight: 52 }, { text: 'validators', weight: 48 }, { text: 'Vitalik', weight: 45 },
    { text: 'upgrade', weight: 42 }, { text: 'rollups', weight: 40 }, { text: 'ecosystem', weight: 38 },
  ],
  SOL: [
    { text: 'speed', weight: 92 }, { text: 'NFTs', weight: 88 }, { text: 'ecosystem', weight: 82 },
    { text: 'DeFi', weight: 78 }, { text: 'memecoins', weight: 75 }, { text: 'breakout', weight: 70 },
    { text: 'TVL', weight: 65 }, { text: 'developer', weight: 60 }, { text: 'Solana-Pay', weight: 55 },
    { text: 'Phantom', weight: 50 }, { text: 'Jupiter', weight: 48 }, { text: 'bullish', weight: 45 },
  ],
  NVDA: [
    { text: 'AI', weight: 95 }, { text: 'GPU', weight: 90 }, { text: 'earnings', weight: 85 },
    { text: 'datacenter', weight: 80 }, { text: 'Jensen', weight: 75 }, { text: 'demand', weight: 70 },
    { text: 'chips', weight: 68 }, { text: 'revenue', weight: 65 }, { text: 'growth', weight: 62 },
    { text: 'CUDA', weight: 58 }, { text: 'H100', weight: 55 }, { text: 'Blackwell', weight: 52 },
  ],
};

// fallback for assets without specific word clouds
export const defaultWordCloud = [
  { text: 'bullish', weight: 70 }, { text: 'support', weight: 65 }, { text: 'momentum', weight: 60 },
  { text: 'volume', weight: 55 }, { text: 'trend', weight: 50 }, { text: 'breakout', weight: 48 },
  { text: 'resistance', weight: 45 }, { text: 'rally', weight: 42 }, { text: 'consolidation', weight: 40 },
  { text: 'market', weight: 38 }, { text: 'growth', weight: 35 }, { text: 'value', weight: 32 },
];

// Chart Pattern Definitions
export const chartPatterns = [
  {
    id: 'head-shoulders',
    name: 'Head & Shoulders',
    type: 'reversal',
    direction: 'bearish',
    reliability: 83,
    description: 'A reversal pattern with three peaks, the middle (head) being highest. Signals trend reversal from bullish to bearish.',
    points: [20, 35, 28, 50, 30, 38, 22],
    detected: ['BTC', 'AAPL'],
    color: '#ef4444',
  },
  {
    id: 'double-top',
    name: 'Double Top',
    type: 'reversal',
    direction: 'bearish',
    reliability: 75,
    description: 'Two consecutive peaks at roughly the same price level, indicating a potential bearish reversal.',
    points: [20, 45, 30, 44, 25],
    detected: ['ETH', 'META'],
    color: '#f59e0b',
  },
  {
    id: 'double-bottom',
    name: 'Double Bottom',
    type: 'reversal',
    direction: 'bullish',
    reliability: 78,
    description: 'Two consecutive troughs at roughly the same price, signaling a potential bullish reversal.',
    points: [45, 20, 35, 21, 42],
    detected: ['SOL', 'LINK'],
    color: '#22c55e',
  },
  {
    id: 'ascending-triangle',
    name: 'Ascending Triangle',
    type: 'continuation',
    direction: 'bullish',
    reliability: 72,
    description: 'Flat upper resistance with rising lower support. Usually breaks upward.',
    points: [25, 40, 30, 40, 34, 40, 37],
    detected: ['NVDA', 'SOL'],
    color: '#22c55e',
  },
  {
    id: 'descending-triangle',
    name: 'Descending Triangle',
    type: 'continuation',
    direction: 'bearish',
    reliability: 70,
    description: 'Flat lower support with declining upper resistance. Usually breaks downward.',
    points: [45, 20, 40, 20, 35, 20, 30],
    detected: ['TSLA', 'INTC'],
    color: '#ef4444',
  },
  {
    id: 'bull-flag',
    name: 'Bull Flag',
    type: 'continuation',
    direction: 'bullish',
    reliability: 68,
    description: 'Sharp rise followed by a slight downward channel. Signals continuation of uptrend.',
    points: [15, 40, 38, 36, 34, 50],
    detected: ['BTC', 'NVDA'],
    color: '#22c55e',
  },
  {
    id: 'cup-handle',
    name: 'Cup & Handle',
    type: 'continuation',
    direction: 'bullish',
    reliability: 80,
    description: 'Rounded bottom (cup) followed by a slight pullback (handle). Strong bullish signal.',
    points: [40, 30, 22, 18, 22, 30, 40, 36, 42],
    detected: ['MSFT', 'GOOGL'],
    color: '#4f8cff',
  },
  {
    id: 'wedge-rising',
    name: 'Rising Wedge',
    type: 'reversal',
    direction: 'bearish',
    reliability: 65,
    description: 'Both support and resistance rise, but converge. Typically leads to a downward breakout.',
    points: [20, 30, 25, 35, 30, 38, 34],
    detected: ['DOGE'],
    color: '#f59e0b',
  },
];

// Risk Scenario Templates
export const riskScenarios = [
  {
    id: 'btc-crash-40',
    name: 'BTC Drops 40%',
    description: 'Bitcoin experiences a major correction of 40%',
    icon: '₿',
    impacts: { BTC: -40, ETH: -30, SOL: -35, ADA: -38, DOT: -32, AVAX: -34, LINK: -28, DOGE: -42, XRP: -30, AAPL: -5, NVDA: -8, MSFT: -4, GOOGL: -3, AMZN: -4, GOLD: 5, SPY: -6 },
    severity: 'critical',
    probability: 15,
  },
  {
    id: 'market-crash',
    name: 'Market-Wide Crash',
    description: 'Global recession triggers 30% decline across all markets',
    icon: '📉',
    impacts: { BTC: -35, ETH: -38, SOL: -45, ADA: -42, AAPL: -30, NVDA: -35, MSFT: -28, GOOGL: -32, AMZN: -33, META: -36, TSLA: -40, GOLD: 12, SPY: -30, QQQ: -35 },
    severity: 'critical',
    probability: 8,
  },
  {
    id: 'tech-selloff',
    name: 'Tech Sector Selloff',
    description: 'Tech sector drops 25% due to regulation fears',
    icon: '💻',
    impacts: { AAPL: -25, NVDA: -30, MSFT: -22, GOOGL: -28, AMZN: -24, META: -32, TSLA: -28, AMD: -26, INTC: -18, CRM: -20, BTC: -10, ETH: -12, GOLD: 3, SPY: -12 },
    severity: 'high',
    probability: 20,
  },
  {
    id: 'crypto-winter',
    name: 'Crypto Winter',
    description: 'Extended bear market in crypto lasting 6+ months',
    icon: '❄️',
    impacts: { BTC: -55, ETH: -60, SOL: -70, ADA: -65, DOT: -62, AVAX: -68, LINK: -58, DOGE: -72, XRP: -55, UNI: -65, ATOM: -60, AAPL: 0, GOLD: 2, SPY: -3 },
    severity: 'critical',
    probability: 12,
  },
  {
    id: 'inflation-spike',
    name: 'Inflation Surge',
    description: 'CPI jumps to 8%+, Fed hikes rates aggressively',
    icon: '📊',
    impacts: { BTC: -15, ETH: -18, AAPL: -12, NVDA: -15, MSFT: -10, TSLA: -20, GOLD: 15, SPY: -10, QQQ: -14, JPM: 5, BAC: 4, V: -3 },
    severity: 'high',
    probability: 18,
  },
  {
    id: 'ai-bubble-pop',
    name: 'AI Bubble Pops',
    description: 'AI stocks correct 40% as hype fades',
    icon: '🤖',
    impacts: { NVDA: -45, AMD: -35, MSFT: -20, GOOGL: -18, META: -25, CRM: -22, AAPL: -8, BTC: -5, ETH: -5, GOLD: 3, SPY: -10 },
    severity: 'high',
    probability: 22,
  },
  {
    id: 'bull-run',
    name: 'Crypto Bull Run',
    description: 'Bitcoin breaks $100K, alt season follows',
    icon: '🚀',
    impacts: { BTC: 60, ETH: 80, SOL: 120, ADA: 90, DOT: 70, AVAX: 100, LINK: 75, DOGE: 150, XRP: 65, AAPL: 5, NVDA: 10, GOLD: -3, SPY: 5 },
    severity: 'positive',
    probability: 25,
  },
  {
    id: 'geopolitical',
    name: 'Geopolitical Crisis',
    description: 'Major geopolitical event causes market uncertainty',
    icon: '🌍',
    impacts: { BTC: -10, ETH: -12, AAPL: -8, NVDA: -10, SPY: -12, QQQ: -14, GOLD: 18, USO: 25, NG: 30, JPM: -8, DIS: -10 },
    severity: 'high',
    probability: 15,
  },
];

// Smart Alert Templates
export const smartAlertTemplates = [
  { id: 1, name: 'RSI Overbought', condition: 'RSI > 70', description: 'Alert when Relative Strength Index exceeds 70 (overbought)', icon: '📈', category: 'technical' },
  { id: 2, name: 'RSI Oversold', condition: 'RSI < 30', description: 'Alert when RSI drops below 30 (oversold)', icon: '📉', category: 'technical' },
  { id: 3, name: 'MACD Cross Up', condition: 'MACD crosses above Signal', description: 'Bullish MACD crossover detected', icon: '↗️', category: 'technical' },
  { id: 4, name: 'MACD Cross Down', condition: 'MACD crosses below Signal', description: 'Bearish MACD crossover detected', icon: '↘️', category: 'technical' },
  { id: 5, name: 'Golden Cross', condition: '50 SMA crosses above 200 SMA', description: 'Major bullish signal: 50-day MA crosses above 200-day MA', icon: '✨', category: 'technical' },
  { id: 6, name: 'Death Cross', condition: '50 SMA crosses below 200 SMA', description: 'Major bearish signal: 50-day MA crosses below 200-day MA', icon: '💀', category: 'technical' },
  { id: 7, name: 'Portfolio Risk High', condition: 'Risk Score > 80', description: 'Portfolio risk exceeds acceptable threshold', icon: '🛡️', category: 'portfolio' },
  { id: 8, name: 'Max Drawdown Alert', condition: 'Drawdown > 15%', description: 'Portfolio drawdown exceeds 15%', icon: '⚠️', category: 'portfolio' },
  { id: 9, name: 'Concentration Risk', condition: 'Single asset > 30%', description: 'One asset dominates over 30% of portfolio', icon: '⚖️', category: 'portfolio' },
  { id: 10, name: 'Volatility Spike', condition: 'Volatility > 2x average', description: 'Market volatility is abnormally high', icon: '🌊', category: 'market' },
  { id: 11, name: 'Volume Surge', condition: 'Volume > 3x average', description: 'Unusual trading volume detected', icon: '📊', category: 'market' },
  { id: 12, name: 'Price Target Hit', condition: 'Price reaches target', description: 'Asset price reaches your target level', icon: '🎯', category: 'price' },
  { id: 13, name: 'Bollinger Squeeze', condition: 'BB width < threshold', description: 'Bollinger Band squeeze indicates imminent breakout', icon: '🔄', category: 'technical' },
  { id: 14, name: 'Sentiment Shift', condition: 'Sentiment drops > 20pts', description: 'Sudden shift in market sentiment detected', icon: '😰', category: 'ai' },
  { id: 15, name: 'Correlation Break', condition: 'Correlation deviation > 0.3', description: 'Asset correlation deviates from historical norm', icon: '🔗', category: 'ai' },
];

// Generate simulated RSI/MACD values for assets
export function generateTechnicalIndicators(symbol) {
  const rsi = 30 + Math.random() * 50;
  const macd = (Math.random() - 0.5) * 4;
  const signal = macd + (Math.random() - 0.5) * 1;
  const sma20 = 100 + Math.random() * 50;
  const sma50 = sma20 + (Math.random() - 0.5) * 10;
  const sma200 = sma50 + (Math.random() - 0.5) * 20;
  const bbUpper = sma20 * 1.05;
  const bbLower = sma20 * 0.95;
  return { rsi: +rsi.toFixed(1), macd: +macd.toFixed(2), signal: +signal.toFixed(2), sma20: +sma20.toFixed(2), sma50: +sma50.toFixed(2), sma200: +sma200.toFixed(2), bbUpper: +bbUpper.toFixed(2), bbLower: +bbLower.toFixed(2) };
}

// Portfolio grading algorithm
export function gradePortfolio(assets) {
  if (!assets || assets.length === 0) return { grade: 'N/A', score: 0, breakdown: {} };
  const diversification = Math.min(assets.length / 8, 1) * 100;
  const maxAlloc = Math.max(...assets.map(a => a.allocation || 0));
  const concentration = Math.max(0, 100 - maxAlloc * 200);
  const categories = new Set(assets.map(a => a.category || 'unknown'));
  const sectorDiv = Math.min(categories.size / 4, 1) * 100;
  const score = Math.round(diversification * 0.3 + concentration * 0.3 + sectorDiv * 0.4);
  let grade;
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B+';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C+';
  else if (score >= 40) grade = 'C';
  else if (score >= 30) grade = 'D';
  else grade = 'F';
  return { grade, score, breakdown: { diversification: Math.round(diversification), concentration: Math.round(concentration), sectorDiversification: Math.round(sectorDiv) } };
}
