// ─── Bias Detection Agent — Analyzes behavior for cognitive biases ───
// NEW agent — does not exist in the original codebase

const biasDefinitions = {
  fomo: {
    name: 'FOMO (Fear of Missing Out)',
    icon: '😰',
    description: 'Buying an asset because everyone else is buying it, without doing your own research.',
    realWorldExample: 'In 2021, many Indians rushed to buy crypto at all-time highs because social media was buzzing. Those who bought Bitcoin at ₹50 lakh saw it drop to ₹15 lakh within months.',
    howToOvercome: 'Ask yourself: "Would I buy this if nobody else was talking about it?" If not, it\'s FOMO, not conviction.',
    relatedLesson: 'advanced-portfolio',
  },
  panicSelling: {
    name: 'Panic Selling',
    icon: '🏃',
    description: 'Selling investments during a market drop out of fear, locking in losses permanently.',
    realWorldExample: 'During COVID crash in March 2020, NIFTY fell from 12,000 to 7,500. Those who panic-sold lost 37%. Those who held saw NIFTY recover to 15,000 within a year — a 100% gain from the bottom.',
    howToOvercome: 'Remember: every crash in Indian history has been followed by a recovery. If your goal is 10+ years away, a crash is a buying opportunity.',
    relatedLesson: 'stock-market',
  },
  recencyBias: {
    name: 'Recency Bias',
    icon: '📊',
    description: 'Giving too much weight to recent performance and assuming it will continue.',
    realWorldExample: 'Small cap funds returned 40% in 2023. Many investors poured money in expecting 40% again. In reality, long-term average is closer to 15-18%.',
    howToOvercome: 'Always look at 5-year and 10-year returns, not just last year. Past performance (especially recent) does not guarantee future results.',
    relatedLesson: 'mutual-funds',
  },
  anchoringBias: {
    name: 'Anchoring Bias',
    icon: '⚓',
    description: 'Fixating on a specific number (usually your purchase price) and making decisions based on it.',
    realWorldExample: 'You bought TATAMOTORS at ₹500. It drops to ₹300. You refuse to sell because "it was ₹500." The stock\'s past price is irrelevant — what matters is its future value.',
    howToOvercome: 'Ask: "If I didn\'t own this stock and had ₹300, would I buy it today at ₹300?" If no, consider selling.',
    relatedLesson: 'stock-market',
  },
  herdMentality: {
    name: 'Herd Mentality',
    icon: '🐑',
    description: 'Following the crowd without independent analysis. "My neighbor invested, so I should too."',
    realWorldExample: 'During IPO frenzies in India, people borrow money to invest in IPOs because "everyone is making money." When the hype dies, many IPOs trade below listing price.',
    howToOvercome: 'Develop your own investment thesis. If you can\'t explain WHY you\'re investing in something in 2 sentences, you\'re probably following the herd.',
    relatedLesson: 'advanced-portfolio',
  },
  overconfidence: {
    name: 'Overconfidence',
    icon: '🦚',
    description: 'Believing you can consistently beat the market through stock picking or timing.',
    realWorldExample: 'Studies show 80% of actively managed mutual funds in India underperform the NIFTY 50 index over 10 years. Even professionals can\'t consistently beat the market.',
    howToOvercome: 'Invest in index funds for the core of your portfolio. If you want to pick stocks, limit it to 10-20% of your portfolio as a "satellite" strategy.',
    relatedLesson: 'mutual-funds',
  },
};

export async function runBiasDetectionAgent(input) {
  const steps = [];

  steps.push({
    agent: '🧠 Bias Detection Agent',
    action: 'Analyzing investment behavior',
    status: 'processing',
    detail: 'Scanning for cognitive biases in your recent decisions...',
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 800));

  // Simulate detecting biases based on input behavior
  const detectedBiases = [];

  if (input.recentBuys && input.recentBuys.length > 3) {
    detectedBiases.push(biasDefinitions.fomo);
  }
  if (input.soldDuringDip) {
    detectedBiases.push(biasDefinitions.panicSelling);
  }
  if (input.chasedRecentPerformance) {
    detectedBiases.push(biasDefinitions.recencyBias);
  }

  // If no specific behaviors detected, educate on a random bias
  if (detectedBiases.length === 0) {
    const allBiases = Object.values(biasDefinitions);
    detectedBiases.push(allBiases[Math.floor(Math.random() * allBiases.length)]);
  }

  steps.push({
    agent: '🧠 Bias Detection Agent',
    action: `Detected ${detectedBiases.length} potential bias${detectedBiases.length > 1 ? 'es' : ''}`,
    status: 'processing',
    detail: detectedBiases.map((b) => `${b.icon} ${b.name}`).join(', '),
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 600));

  steps.push({
    agent: '🧠 Bias Detection Agent',
    action: 'Bias education ready',
    status: 'complete',
    detail: 'Review the detected biases and learn how to overcome them.',
    timestamp: Date.now(),
  });

  return {
    steps,
    result: {
      detectedBiases: detectedBiases.map((b) => ({
        name: b.name,
        icon: b.icon,
        description: b.description,
        realWorldExample: b.realWorldExample,
        howToOvercome: b.howToOvercome,
      })),
      allBiases: Object.values(biasDefinitions).map((b) => ({ name: b.name, icon: b.icon })),
      whatDidYouLearn: 'Your brain is not built for investing. Biases like FOMO, panic selling, and herd mentality destroy more wealth than market crashes. The best defense is awareness and automation (SIP).',
      relatedLesson: 'advanced-portfolio',
    },
  };
}
