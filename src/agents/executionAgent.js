// ─── Simulation Agent — Runs forward-looking investment simulations ───
// Replaces the old Execution Agent (which simulated trade execution)

import { calculateSIP, calculateLumpSum } from '../data/mutualFundData';

export async function runSimulationAgent(input) {
  const steps = [];

  const monthlyAmount = input.monthlyAmount || 5000;
  const years = input.years || 20;
  const scenarios = [
    { name: 'Conservative (FD)', returnRate: 7, color: '#6b7280' },
    { name: 'Moderate (Hybrid Fund)', returnRate: 10, color: '#3b82f6' },
    { name: 'Growth (Index Fund)', returnRate: 12, color: '#10b981' },
    { name: 'Aggressive (Mid Cap)', returnRate: 15, color: '#f59e0b' },
  ];

  steps.push({
    agent: '🧪 Simulation Agent',
    action: 'Setting up simulation',
    status: 'processing',
    detail: `Simulating ₹${monthlyAmount.toLocaleString('en-IN')}/month SIP for ${years} years across 4 scenarios`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 700));

  // Run simulations
  const results = scenarios.map((s) => {
    const sipResult = calculateSIP(monthlyAmount, years, s.returnRate);
    return {
      ...s,
      ...sipResult,
    };
  });

  steps.push({
    agent: '🧪 Simulation Agent',
    action: 'Computing compounding projections',
    status: 'processing',
    detail: `At ${scenarios[2].returnRate}% (NIFTY 50 historical): ₹${monthlyAmount.toLocaleString('en-IN')}/month → ₹${results[2].futureValue.toLocaleString('en-IN')}`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 600));

  // Generate year-by-year projection for primary scenario
  const yearlyProjection = [];
  for (let y = 1; y <= years; y++) {
    const sipResult = calculateSIP(monthlyAmount, y, 12);
    const fdResult = calculateSIP(monthlyAmount, y, 7);
    yearlyProjection.push({
      year: y,
      invested: sipResult.totalInvested,
      indexFund: sipResult.futureValue,
      fd: fdResult.futureValue,
      gap: sipResult.futureValue - fdResult.futureValue,
    });
  }

  steps.push({
    agent: '🧪 Simulation Agent',
    action: 'Simulation complete',
    status: 'complete',
    detail: `The difference between FD and Index Fund over ${years} years: ₹${(results[2].futureValue - results[0].futureValue).toLocaleString('en-IN')}`,
    timestamp: Date.now(),
  });

  return {
    steps,
    result: {
      monthlyAmount,
      years,
      totalInvested: results[0].totalInvested,
      scenarios: results,
      yearlyProjection,
      insight: `By investing ₹${monthlyAmount.toLocaleString('en-IN')}/month for ${years} years, you invest ₹${results[0].totalInvested.toLocaleString('en-IN')} total. In an Index Fund at 12%, this becomes ₹${results[2].futureValue.toLocaleString('en-IN')}. In an FD at 7%, only ₹${results[0].futureValue.toLocaleString('en-IN')}. The gap of ₹${(results[2].futureValue - results[0].futureValue).toLocaleString('en-IN')} is the cost of not investing in equity.`,
      whatDidYouLearn: 'The biggest risk is not market volatility — it\'s keeping all your money in low-return instruments and losing to inflation. Time in the market beats timing the market.',
      relatedLesson: 'mutual-funds',
    },
  };
}
