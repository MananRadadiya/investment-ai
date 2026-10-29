// ─── Mutual Fund Data — Top Indian MFs by category ───

export const mutualFunds = [
  // ──── LARGE CAP ────
  { id: 'hdfc-top100', name: 'HDFC Top 100 Fund', category: 'Large Cap', amc: 'HDFC', returns1y: 18.5, returns3y: 15.2, returns5y: 14.8, expenseRatio: 1.62, aum: '₹32,450 Cr', riskLevel: 'Moderate', rating: 4, sipMin: 500, lumpSumMin: 5000 },
  { id: 'sbi-bluechip', name: 'SBI Blue Chip Fund', category: 'Large Cap', amc: 'SBI', returns1y: 16.8, returns3y: 14.5, returns5y: 14.2, expenseRatio: 1.54, aum: '₹45,230 Cr', riskLevel: 'Moderate', rating: 4, sipMin: 500, lumpSumMin: 5000 },
  { id: 'icici-bluechip', name: 'ICICI Pru Bluechip Fund', category: 'Large Cap', amc: 'ICICI', returns1y: 17.2, returns3y: 15.8, returns5y: 15.1, expenseRatio: 1.58, aum: '₹51,890 Cr', riskLevel: 'Moderate', rating: 5, sipMin: 500, lumpSumMin: 5000 },

  // ──── MID CAP ────
  { id: 'axis-midcap', name: 'Axis Midcap Fund', category: 'Mid Cap', amc: 'Axis', returns1y: 22.4, returns3y: 18.6, returns5y: 17.8, expenseRatio: 1.72, aum: '₹24,560 Cr', riskLevel: 'Moderately High', rating: 5, sipMin: 500, lumpSumMin: 5000 },
  { id: 'kotak-emerging', name: 'Kotak Emerging Equity Fund', category: 'Mid Cap', amc: 'Kotak', returns1y: 24.1, returns3y: 19.2, returns5y: 18.4, expenseRatio: 1.68, aum: '₹38,920 Cr', riskLevel: 'Moderately High', rating: 5, sipMin: 1000, lumpSumMin: 5000 },
  { id: 'hdfc-midcap', name: 'HDFC Mid-Cap Opportunities', category: 'Mid Cap', amc: 'HDFC', returns1y: 25.6, returns3y: 20.1, returns5y: 17.2, expenseRatio: 1.74, aum: '₹55,670 Cr', riskLevel: 'Moderately High', rating: 4, sipMin: 500, lumpSumMin: 5000 },

  // ──── SMALL CAP ────
  { id: 'sbi-smallcap', name: 'SBI Small Cap Fund', category: 'Small Cap', amc: 'SBI', returns1y: 28.3, returns3y: 22.4, returns5y: 21.8, expenseRatio: 1.78, aum: '₹26,340 Cr', riskLevel: 'High', rating: 5, sipMin: 500, lumpSumMin: 5000 },
  { id: 'nippon-smallcap', name: 'Nippon India Small Cap', category: 'Small Cap', amc: 'Nippon', returns1y: 30.2, returns3y: 24.8, returns5y: 23.5, expenseRatio: 1.82, aum: '₹48,230 Cr', riskLevel: 'High', rating: 4, sipMin: 500, lumpSumMin: 5000 },

  // ──── INDEX FUNDS ────
  { id: 'uti-nifty50', name: 'UTI Nifty 50 Index Fund', category: 'Index Fund', amc: 'UTI', returns1y: 15.4, returns3y: 13.8, returns5y: 13.2, expenseRatio: 0.18, aum: '₹18,450 Cr', riskLevel: 'Moderate', rating: 5, sipMin: 500, lumpSumMin: 1000 },
  { id: 'hdfc-sensex', name: 'HDFC Index Fund – Sensex', category: 'Index Fund', amc: 'HDFC', returns1y: 14.8, returns3y: 13.2, returns5y: 12.8, expenseRatio: 0.20, aum: '₹8,920 Cr', riskLevel: 'Moderate', rating: 4, sipMin: 500, lumpSumMin: 1000 },
  { id: 'motilal-sp500', name: 'Motilal Oswal S&P 500 Index', category: 'Index Fund', amc: 'Motilal', returns1y: 20.2, returns3y: 16.5, returns5y: 15.8, expenseRatio: 0.49, aum: '₹9,120 Cr', riskLevel: 'Moderate', rating: 4, sipMin: 500, lumpSumMin: 500 },

  // ──── ELSS (TAX SAVING) ────
  { id: 'axis-elss', name: 'Axis Long Term Equity Fund', category: 'ELSS', amc: 'Axis', returns1y: 19.2, returns3y: 14.8, returns5y: 14.1, expenseRatio: 1.56, aum: '₹37,890 Cr', riskLevel: 'Moderately High', rating: 4, sipMin: 500, lumpSumMin: 500, taxBenefit: 'Section 80C — up to ₹1,50,000', lockIn: '3 years' },
  { id: 'mirae-elss', name: 'Mirae Asset Tax Saver Fund', category: 'ELSS', amc: 'Mirae', returns1y: 21.4, returns3y: 17.2, returns5y: 16.8, expenseRatio: 1.64, aum: '₹22,340 Cr', riskLevel: 'Moderately High', rating: 5, sipMin: 500, lumpSumMin: 500, taxBenefit: 'Section 80C — up to ₹1,50,000', lockIn: '3 years' },

  // ──── DEBT FUNDS ────
  { id: 'hdfc-shortterm', name: 'HDFC Short Term Debt Fund', category: 'Debt', amc: 'HDFC', returns1y: 7.8, returns3y: 6.9, returns5y: 7.2, expenseRatio: 0.38, aum: '₹14,560 Cr', riskLevel: 'Low', rating: 4, sipMin: 1000, lumpSumMin: 5000 },
  { id: 'sbi-magnum', name: 'SBI Magnum Medium Duration', category: 'Debt', amc: 'SBI', returns1y: 8.2, returns3y: 7.4, returns5y: 7.8, expenseRatio: 0.68, aum: '₹9,870 Cr', riskLevel: 'Low to Moderate', rating: 4, sipMin: 1000, lumpSumMin: 5000 },

  // ──── HYBRID ────
  { id: 'icici-balanced', name: 'ICICI Pru Equity & Debt Fund', category: 'Hybrid', amc: 'ICICI', returns1y: 14.6, returns3y: 13.2, returns5y: 13.8, expenseRatio: 1.56, aum: '₹38,450 Cr', riskLevel: 'Moderate', rating: 4, sipMin: 500, lumpSumMin: 5000 },
  { id: 'hdfc-balanced', name: 'HDFC Balanced Advantage Fund', category: 'Hybrid', amc: 'HDFC', returns1y: 16.2, returns3y: 14.8, returns5y: 13.5, expenseRatio: 1.48, aum: '₹72,340 Cr', riskLevel: 'Moderate', rating: 5, sipMin: 500, lumpSumMin: 5000 },
];

// Categories for filtering
export const mfCategories = [
  { name: 'All', color: '#3b82f6' },
  { name: 'Large Cap', color: '#10b981', description: 'Top 100 companies by market cap. Lower risk, stable returns.' },
  { name: 'Mid Cap', color: '#f59e0b', description: 'Ranks 101-250 by market cap. Higher growth potential, moderate risk.' },
  { name: 'Small Cap', color: '#ef4444', description: 'Rank 251+ by market cap. Highest risk, highest potential returns.' },
  { name: 'Index Fund', color: '#8b5cf6', description: 'Mirrors a market index (NIFTY 50, Sensex). Lowest expense ratio.' },
  { name: 'ELSS', color: '#ec4899', description: 'Tax-saving funds with 3-year lock-in. Eligible for Section 80C deduction.' },
  { name: 'Debt', color: '#6b7280', description: 'Invests in bonds and fixed-income. Lower returns but much lower risk.' },
  { name: 'Hybrid', color: '#14b8a6', description: 'Mix of equity and debt. Balanced risk-return profile.' },
];

// Get funds by category
export function getFundsByCategory(category) {
  if (category === 'All') return mutualFunds;
  return mutualFunds.filter((f) => f.category === category);
}

// SIP Calculator
export function calculateSIP(monthlyAmount, years, expectedReturn) {
  const months = years * 12;
  const monthlyRate = expectedReturn / 12 / 100;
  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvested = monthlyAmount * months;
  const totalReturns = futureValue - totalInvested;
  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    totalReturns: Math.round(totalReturns),
    returnPercent: +((totalReturns / totalInvested) * 100).toFixed(1),
  };
}

// Lump Sum Calculator
export function calculateLumpSum(amount, years, expectedReturn) {
  const futureValue = amount * Math.pow(1 + expectedReturn / 100, years);
  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(amount),
    totalReturns: Math.round(futureValue - amount),
    returnPercent: +(((futureValue - amount) / amount) * 100).toFixed(1),
  };
}
