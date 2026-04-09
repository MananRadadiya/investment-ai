// Educational content for the Learn page

export const learningModules = [
  {
    id: 1, title: 'What is Dollar-Cost Averaging?',
    summary: 'Learn how investing a fixed amount regularly can reduce the impact of volatility on your portfolio.',
    category: 'Basics', difficulty: 'Beginner', readTime: '5 min', icon: '📊',
    completed: true,
    content: 'Dollar-cost averaging (DCA) is an investment strategy where you invest a fixed dollar amount at regular intervals, regardless of the asset price. This approach reduces the impact of volatility by buying more shares when prices are low and fewer when prices are high. Over time, this tends to lower your average cost per share compared to lump-sum investing during volatile markets.',
  },
  {
    id: 2, title: 'Understanding the Sharpe Ratio',
    summary: 'Discover how to measure risk-adjusted returns and compare investment performance.',
    category: 'Risk', difficulty: 'Intermediate', readTime: '7 min', icon: '📐',
    completed: true,
    content: 'The Sharpe ratio measures risk-adjusted return by dividing the excess return (portfolio return minus risk-free rate) by the standard deviation of returns. A Sharpe ratio above 1.0 is considered good, above 2.0 is very good, and above 3.0 is excellent.',
  },
  {
    id: 3, title: 'AI Trading Strategies Explained',
    summary: 'How machine learning and neural networks are revolutionizing financial markets.',
    category: 'AI & Tech', difficulty: 'Advanced', readTime: '10 min', icon: '🤖',
    completed: false,
    content: 'AI trading strategies use machine learning algorithms to analyze vast amounts of market data, identify patterns, and execute trades. Common approaches include sentiment analysis of news and social media, pattern recognition in price charts, and reinforcement learning for optimal execution.',
  },
  {
    id: 4, title: 'Crypto vs Stocks: Risk Comparison',
    summary: 'A detailed comparison of risk profiles between traditional equities and cryptocurrency markets.',
    category: 'Risk', difficulty: 'Beginner', readTime: '6 min', icon: '⚖️',
    completed: false,
    content: 'Cryptocurrencies typically exhibit 3-5x higher volatility than traditional stocks. While the S&P 500 has an annualized volatility of about 15%, Bitcoin often exceeds 60%. However, crypto markets also offer higher potential returns and operate 24/7.',
  },
  {
    id: 5, title: 'Portfolio Diversification Masterclass',
    summary: 'Learn the art and science of building a diversified portfolio that minimizes risk.',
    category: 'Strategy', difficulty: 'Intermediate', readTime: '8 min', icon: '🌈',
    completed: false,
    content: 'True diversification goes beyond owning multiple assets — it requires assets with low or negative correlation. A well-diversified portfolio should include assets from different sectors, geographies, and asset classes (stocks, bonds, commodities, crypto).',
  },
  {
    id: 6, title: 'Reading Candlestick Charts',
    summary: 'Master the fundamentals of candlestick chart patterns for technical analysis.',
    category: 'Technical', difficulty: 'Beginner', readTime: '6 min', icon: '🕯️',
    completed: true,
    content: 'Candlestick charts display four price points: open, high, low, and close. The body represents the range between open and close, while wicks show the high and low. Key patterns include doji, hammer, engulfing, and morning/evening star.',
  },
  {
    id: 7, title: 'Understanding DeFi Yield Farming',
    summary: 'A beginner\'s guide to earning passive income through decentralized finance protocols.',
    category: 'Crypto', difficulty: 'Intermediate', readTime: '9 min', icon: '🌾',
    completed: false,
    content: 'Yield farming involves providing liquidity to DeFi protocols in exchange for rewards. Common strategies include liquidity provision on DEXs, lending on platforms like Aave, and staking governance tokens. Risks include impermanent loss, smart contract bugs, and token devaluation.',
  },
  {
    id: 8, title: 'The Psychology of Trading',
    summary: 'Understanding cognitive biases that affect investment decisions and how to overcome them.',
    category: 'Psychology', difficulty: 'Intermediate', readTime: '7 min', icon: '🧠',
    completed: false,
    content: 'Common cognitive biases in trading include loss aversion (feeling losses 2x more than gains), confirmation bias (seeking information that confirms existing beliefs), and FOMO (fear of missing out). Successful traders develop systematic approaches to counteract these biases.',
  },
  {
    id: 9, title: 'What is a Smart Contract?',
    summary: 'Learn how self-executing code on blockchains is transforming finance and beyond.',
    category: 'Crypto', difficulty: 'Beginner', readTime: '5 min', icon: '📝',
    completed: true,
    content: 'Smart contracts are self-executing programs stored on a blockchain that automatically enforce the terms of an agreement. They remove the need for intermediaries and enable trustless interactions. Ethereum pioneered smart contracts, but many blockchains now support them.',
  },
  {
    id: 10, title: 'Monte Carlo Simulations in Finance',
    summary: 'How random sampling techniques help predict portfolio outcomes and manage risk.',
    category: 'AI & Tech', difficulty: 'Advanced', readTime: '12 min', icon: '🎲',
    completed: false,
    content: 'Monte Carlo simulations generate thousands of possible future scenarios by randomly sampling from historical return distributions. This technique helps estimate the probability of achieving financial goals, calculate Value at Risk (VaR), and stress-test portfolios.',
  },
  {
    id: 11, title: 'ETFs vs Individual Stocks',
    summary: 'Pros and cons of index funds versus stock picking for different investor profiles.',
    category: 'Basics', difficulty: 'Beginner', readTime: '5 min', icon: '📦',
    completed: false,
    content: 'ETFs offer instant diversification, lower fees, and simplicity. Individual stocks offer higher potential returns but require more research and carry more risk. Most financial advisors recommend a core ETF portfolio with optional satellite stock positions.',
  },
  {
    id: 12, title: 'Options Trading Fundamentals',
    summary: 'Understanding calls, puts, and basic options strategies for portfolio management.',
    category: 'Advanced', difficulty: 'Advanced', readTime: '15 min', icon: '🎯',
    completed: false,
    content: 'Options give the right (not obligation) to buy (call) or sell (put) an asset at a specific price by a specific date. Key concepts include strike price, expiration, premium, and the Greeks (delta, gamma, theta, vega). Basic strategies include covered calls, protective puts, and spreads.',
  },
];

// Learning categories with colors
export const learningCategories = [
  { name: 'All', color: '#4f8cff' },
  { name: 'Basics', color: '#22c55e' },
  { name: 'Risk', color: '#f59e0b' },
  { name: 'Strategy', color: '#a78bfa' },
  { name: 'Crypto', color: '#627eea' },
  { name: 'AI & Tech', color: '#ef4444' },
  { name: 'Technical', color: '#ec4899' },
  { name: 'Psychology', color: '#14b8a6' },
  { name: 'Advanced', color: '#f97316' },
];
