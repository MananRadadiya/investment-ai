// ─── Goal Planning Agent — Helps define life goals and investment vehicles ───
// Replaces the old Strategy Agent (which built trading portfolios)

import { calculateSIP } from '../data/mutualFundData';

const goalTemplates = {
  emergency: { name: 'Emergency Fund', icon: '🛡️', years: 0.5, inflationAdjust: false, instruments: ['Savings Account', 'Liquid Mutual Fund'], riskLevel: 'Very Low' },
  wedding: { name: 'Wedding', icon: '💒', years: 5, inflationAdjust: true, instruments: ['Hybrid Funds', 'FD', 'RD'], riskLevel: 'Low to Moderate' },
  car: { name: 'Car Purchase', icon: '🚗', years: 3, inflationAdjust: true, instruments: ['Short-term Debt Funds', 'FD'], riskLevel: 'Low' },
  house: { name: 'House Down Payment', icon: '🏠', years: 10, inflationAdjust: true, instruments: ['ELSS', 'Index Funds', 'PPF', 'NPS'], riskLevel: 'Moderate' },
  childEducation: { name: 'Child\'s Education', icon: '🎓', years: 15, inflationAdjust: true, instruments: ['Sukanya Samriddhi', 'ELSS', 'Mid Cap Funds'], riskLevel: 'Moderate to High' },
  retirement: { name: 'Retirement', icon: '🌅', years: 30, inflationAdjust: true, instruments: ['NPS', 'EPF/VPF', 'Index Funds', 'PPF'], riskLevel: 'Aggressive (initially)' },
};

export async function runGoalPlanningAgent(input) {
  const steps = [];

  const goalType = input.goalType || 'retirement';
  const template = goalTemplates[goalType] || goalTemplates.retirement;
  const targetAmount = input.targetAmount || 5000000;
  const years = input.years || template.years;
  const expectedReturn = input.expectedReturn || 12;

  steps.push({
    agent: '🎯 Goal Planning Agent',
    action: 'Understanding your goal',
    status: 'processing',
    detail: `Goal: ${template.name} — Target: ₹${(targetAmount).toLocaleString('en-IN')} in ${years} years`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 700));

  // Calculate required SIP
  const months = years * 12;
  const monthlyRate = expectedReturn / 12 / 100;
  const requiredSIP = Math.round(
    targetAmount / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  );

  steps.push({
    agent: '🎯 Goal Planning Agent',
    action: 'Calculating investment plan',
    status: 'processing',
    detail: `At ${expectedReturn}% annual return, you need ₹${requiredSIP.toLocaleString('en-IN')}/month SIP`,
    timestamp: Date.now(),
  });

  await new Promise((r) => setTimeout(r, 600));

  // Inflation-adjusted target
  const inflationRate = 0.06;
  const inflationAdjusted = template.inflationAdjust
    ? Math.round(targetAmount * Math.pow(1 + inflationRate, years))
    : targetAmount;

  steps.push({
    agent: '🎯 Goal Planning Agent',
    action: 'Goal plan ready',
    status: 'complete',
    detail: `Plan created with ${template.instruments.length} recommended instruments`,
    timestamp: Date.now(),
  });

  return {
    steps,
    result: {
      goal: template.name,
      icon: template.icon,
      targetAmount,
      inflationAdjustedTarget: inflationAdjusted,
      years,
      requiredMonthlySIP: requiredSIP,
      expectedReturn: `${expectedReturn}%`,
      riskLevel: template.riskLevel,
      recommendedInstruments: template.instruments,
      whatDidYouLearn: `To reach ₹${(targetAmount).toLocaleString('en-IN')} in ${years} years, you need just ₹${requiredSIP.toLocaleString('en-IN')}/month. With inflation at 6%, the real cost would be ₹${inflationAdjusted.toLocaleString('en-IN')} — start early to beat inflation.`,
      relatedLesson: 'money-basics',
    },
  };
}
