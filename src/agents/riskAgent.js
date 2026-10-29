// ─── Risk Literacy Agent — Teaches users to understand risk ───
// Replaces the old Risk Agent (which calculated trading risk metrics)

const riskProfiles = {
  conservative: {
    profile: 'Conservative',
    allocation: { equity: 20, debt: 60, gold: 10, fd: 10 },
    description: 'Prioritizes capital preservation over growth. Best for retirees, short-term goals, or risk-averse investors.',
    indianInstruments: ['PPF (7.1%)', 'FD (6-7.5%)', 'Debt Mutual Funds', 'RBI Bonds', 'Sovereign Gold Bond'],
    expectedReturn: '6-8% annually',
    riskExplanation: 'Your money is very safe but grows slowly. Inflation may eat into real returns over long periods.',
  },
  moderate: {
    profile: 'Moderate',
    allocation: { equity: 50, debt: 30, gold: 10, fd: 10 },
    description: 'Balanced approach with growth potential and reasonable protection. Suitable for medium-term goals (5-10 years).',
    indianInstruments: ['Index Funds (NIFTY 50)', 'Balanced/Hybrid Mutual Funds', 'PPF', 'NPS', 'ELSS'],
    expectedReturn: '10-12% annually',
    riskExplanation: 'Your portfolio may drop 15-20% in bad years but historically recovers within 2-3 years.',
  },
  aggressive: {
    profile: 'Aggressive',
    allocation: { equity: 75, debt: 15, gold: 5, fd: 5 },
    description: 'Maximizes long-term growth, accepts short-term volatility. Best for young investors with 15+ year horizons.',
    indianInstruments: ['Mid Cap Funds', 'Small Cap Funds', 'Direct Stock Investing', 'International Index Funds', 'NPS (Equity)'],
    expectedReturn: '12-15% annually',
    riskExplanation: 'Your portfolio could drop 30-40% in crashes (like 2008, 2020) but has the highest long-term growth potential.',
  },
};

export async function runRiskLiteracyAgent(input) {
  const steps = [];

  steps.push({
    agent: '🛡️ Risk Literacy Agent',
    action: 'Assessing risk understanding',
    status: 'processing',
    detail: `Evaluating risk profile for: ${input.riskTolerance || 'moderate'} tolerance, ${input.timeHorizon || '10'} year horizon`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 700));

  const profile = riskProfiles[input.riskTolerance || 'moderate'];

  steps.push({
    agent: '🛡️ Risk Literacy Agent',
    action: 'Building risk education',
    status: 'processing',
    detail: `Profile: ${profile.profile} — ${profile.description}`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 600));

  steps.push({
    agent: '🛡️ Risk Literacy Agent',
    action: 'Risk assessment complete',
    status: 'complete',
    detail: `Recommended allocation: ${profile.allocation.equity}% equity, ${profile.allocation.debt}% debt, ${profile.allocation.gold}% gold`,
    timestamp: Date.now(),
  });

  return {
    steps,
    result: {
      profile: profile.profile,
      allocation: profile.allocation,
      description: profile.description,
      instruments: profile.indianInstruments,
      expectedReturn: profile.expectedReturn,
      riskExplanation: profile.riskExplanation,
      whatDidYouLearn: 'Risk is not about avoiding losses — it\'s about understanding the tradeoff between safety and growth. The right risk level depends on YOUR timeline and goals.',
      relatedLesson: 'advanced-portfolio',
    },
  };
}
