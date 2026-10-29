// ─── Concept Agent — Explains financial concepts with Indian examples ───
// Replaces the old Market Agent (which gave trading signals)

const conceptExplanations = {
  sip: {
    concept: 'Systematic Investment Plan (SIP)',
    explanation: 'SIP lets you invest a fixed amount every month in mutual funds. It removes the need to time the market and builds investing discipline.',
    analogy: 'Think of SIP like planting a seed every month. Some months the soil is dry (market is down), some months it rains (market is up). But because you plant consistently, your garden grows over time.',
    indianExample: '₹5,000/month SIP in NIFTY 50 Index Fund for 20 years at 12% historical return = ₹49,95,740. You invested only ₹12,00,000.',
    whatDidYouLearn: 'SIP works because of rupee cost averaging — you buy more units when prices are low and fewer when prices are high.',
  },
  compoundInterest: {
    concept: 'Compound Interest',
    explanation: 'Compound interest means earning interest on your interest. It turns small, regular investments into large wealth over time.',
    analogy: 'Imagine a snowball rolling downhill. It starts small, but as it rolls, it picks up more snow and grows faster and faster. That is compounding.',
    indianExample: '₹1,00,000 at 12% compound interest for 20 years becomes ₹9,64,629. Simple interest would only give ₹3,40,000.',
    whatDidYouLearn: 'The key to compounding is TIME. Starting at 25 beats starting at 35, even with a smaller amount.',
  },
  inflation: {
    concept: 'Inflation',
    explanation: 'Inflation is the gradual increase in prices over time, which reduces the purchasing power of your money.',
    analogy: 'If a plate of idli costs ₹40 today and inflation is 6%, the same plate will cost ₹72 in 10 years. Your ₹40 will only buy half a plate.',
    indianExample: 'India\'s average inflation has been 5-7% over the past decade. A savings account earning 3.5% actually LOSES purchasing power.',
    whatDidYouLearn: 'Your investments must earn MORE than inflation (currently ~6%) to create real wealth. This is called "real return."',
  },
};

export async function runConceptAgent(input) {
  const steps = [];

  // Step 1: Identify the concept
  steps.push({
    agent: '📚 Concept Agent',
    action: 'Identifying financial concept',
    status: 'processing',
    detail: `Analyzing query: "${input.query || 'financial concept'}"`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 800));

  // Step 2: Build explanation with Indian context
  const conceptKey = Object.keys(conceptExplanations).find(
    (k) => (input.query || '').toLowerCase().includes(k.toLowerCase())
  ) || 'compoundInterest';

  const concept = conceptExplanations[conceptKey];

  steps.push({
    agent: '📚 Concept Agent',
    action: 'Building educational explanation',
    status: 'processing',
    detail: `Concept: ${concept.concept}`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 600));

  // Step 3: Generate output
  steps.push({
    agent: '📚 Concept Agent',
    action: 'Explanation ready',
    status: 'complete',
    detail: concept.explanation,
    timestamp: Date.now(),
  });

  return {
    steps,
    result: {
      concept: concept.concept,
      explanation: concept.explanation,
      analogy: concept.analogy,
      indianExample: concept.indianExample,
      whatDidYouLearn: concept.whatDidYouLearn,
      relatedLesson: 'money-basics',
    },
  };
}
