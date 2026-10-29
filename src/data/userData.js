// ─── User Data — Indian persona, ₹ currency, learning-focused ───

export const demoUser = {
  name: 'Manan Radadiya',
  email: 'manan@bharatinvestai.in',
  plan: 'Free', // Educational platform — no paywall
  memberSince: 'August 2026',
  avatar: null,
  phone: '+91 98765 43210',
  location: 'Ahmedabad, Gujarat',
  persona: 'student',
  bio: 'Computer science student passionate about financial literacy and building wealth through knowledge. Learning to invest wisely with Bharat InvestAI.',
  stats: {
    lessonsCompleted: 12,
    quizzesPassed: 4,
    streak: 7,
    simulationsRun: 15,
    aiConversations: 23,
    literacyScore: 68,
    schemesExplored: 5,
    certificatesEarned: 1,
  },
  badges: [
    { id: 1, name: 'First Step', icon: '👋', earned: '2026-08-01', description: 'Logged in for the first time' },
    { id: 2, name: 'Self-Aware', icon: '🪞', earned: '2026-08-01', description: 'Completed the Financial Literacy Assessment' },
    { id: 3, name: 'Knowledge Begins', icon: '📚', earned: '2026-08-02', description: 'Completed your first lesson' },
    { id: 4, name: 'Quick Learner', icon: '⚡', earned: '2026-08-03', description: 'Completed 5 lessons' },
    { id: 5, name: 'Dedicated Student', icon: '🎒', earned: '2026-08-05', description: 'Completed 10 lessons' },
    { id: 6, name: 'Curious Mind', icon: '💬', earned: '2026-08-02', description: 'Had your first AI Mentor conversation' },
    { id: 7, name: 'Week Warrior', icon: '🔥', earned: '2026-08-08', description: 'Maintained a 7-day streak' },
    { id: 8, name: 'Foundations Laid', icon: '🧱', earned: '2026-08-04', description: 'Completed Money Basics learning path' },
    { id: 9, name: 'Scheme Explorer', icon: '🏛️', earned: '2026-08-06', description: 'Explored 5 government schemes' },
    { id: 10, name: 'SIP Master', icon: '💰', earned: '2026-08-05', description: 'Used SIP calculator for 3 goals' },
  ],
};

export const fakeNotifications = [
  { id: 1, type: 'learning', title: 'New Lesson Available', message: 'Tax Planning & Insurance path is now unlocked! Start learning about Section 80C.', time: '2 min ago', read: false, icon: '📚' },
  { id: 2, type: 'achievement', title: 'Achievement Unlocked!', message: 'You earned "Quick Learner" — completed 5 lessons!', time: '15 min ago', read: false, icon: '🏆' },
  { id: 3, type: 'streak', title: 'Streak Update', message: 'Day 7 of your learning streak! Keep it going 🔥', time: '1 hour ago', read: false, icon: '🔥' },
  { id: 4, type: 'market', title: 'NIFTY 50 Update', message: 'NIFTY crossed 24,500. Learn what this means for your SIP in today\'s lesson.', time: '2 hours ago', read: true, icon: '📈' },
  { id: 5, type: 'ai', title: 'AI Mentor Insight', message: 'Based on your quiz results, try the "Compound Interest" lesson for a deeper understanding.', time: '5 hours ago', read: true, icon: '🤖' },
  { id: 6, type: 'scheme', title: 'Scheme Alert', message: 'PPF interest rate reviewed — still at 7.1%. Learn why PPF is a must-have in your portfolio.', time: '1 day ago', read: true, icon: '🏛️' },
  { id: 7, type: 'simulation', title: 'Simulation Complete', message: 'Your retirement simulation shows ₹3.24 Cr corpus with ₹5,000/month SIP starting now.', time: '1 day ago', read: true, icon: '🧪' },
  { id: 8, type: 'quiz', title: 'Quiz Available', message: 'New quiz unlocked for "Mutual Funds & SIP" path. Test your knowledge!', time: '1 day ago', read: true, icon: '✏️' },
  { id: 9, type: 'learning', title: 'Recommended Lesson', message: 'You haven\'t started "Stock Market Fundamentals" yet. It builds on what you\'ve learned!', time: '2 days ago', read: true, icon: '💡' },
  { id: 10, type: 'sdg', title: 'SDG Impact', message: 'Your learning has contributed to SDG 4 (Quality Education) — 12 lessons completed!', time: '3 days ago', read: true, icon: '🌍' },
];

// Virtual portfolio transactions (educational — not real trades)
export const fakeTransactions = [
  { id: 1, type: 'sip', symbol: 'UTI NIFTY 50', name: 'UTI Nifty 50 Index Fund', amount: 5000, nav: 142.35, units: 35.13, date: '2026-08-01T09:30:00', status: 'completed', category: 'Index Fund' },
  { id: 2, type: 'sip', symbol: 'AXIS MIDCAP', name: 'Axis Midcap Fund', amount: 3000, nav: 78.42, units: 38.25, date: '2026-08-01T09:30:00', status: 'completed', category: 'Mid Cap' },
  { id: 3, type: 'sip', symbol: 'MIRAE ELSS', name: 'Mirae Asset Tax Saver Fund', amount: 2000, nav: 42.18, units: 47.42, date: '2026-08-01T09:30:00', status: 'completed', category: 'ELSS' },
  { id: 4, type: 'buy', symbol: 'RELIANCE', name: 'Reliance Industries', amount: 14728, price: 2945.60, quantity: 5, date: '2026-07-28T10:15:00', status: 'completed', category: 'Stock' },
  { id: 5, type: 'buy', symbol: 'TCS', name: 'Tata Consultancy Services', amount: 7684, price: 3842.15, quantity: 2, date: '2026-07-25T11:30:00', status: 'completed', category: 'Stock' },
  { id: 6, type: 'buy', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', amount: 8427, price: 1685.45, quantity: 5, date: '2026-07-22T09:45:00', status: 'completed', category: 'Stock' },
  { id: 7, type: 'sip', symbol: 'SBI BLUECHIP', name: 'SBI Blue Chip Fund', amount: 5000, nav: 68.92, units: 72.55, date: '2026-07-01T09:30:00', status: 'completed', category: 'Large Cap' },
  { id: 8, type: 'sip', symbol: 'UTI NIFTY 50', name: 'UTI Nifty 50 Index Fund', amount: 5000, nav: 138.90, units: 36.00, date: '2026-07-01T09:30:00', status: 'completed', category: 'Index Fund' },
  { id: 9, type: 'buy', symbol: 'ITC', name: 'ITC Ltd', amount: 4686, price: 468.55, quantity: 10, date: '2026-07-15T14:20:00', status: 'completed', category: 'Stock' },
  { id: 10, type: 'buy', symbol: 'INFY', name: 'Infosys Ltd', amount: 7892, price: 1578.30, quantity: 5, date: '2026-07-10T10:00:00', status: 'completed', category: 'Stock' },
  { id: 11, type: 'sip', symbol: 'AXIS MIDCAP', name: 'Axis Midcap Fund', amount: 3000, nav: 75.60, units: 39.68, date: '2026-07-01T09:30:00', status: 'completed', category: 'Mid Cap' },
  { id: 12, type: 'buy', symbol: 'SBIN', name: 'State Bank of India', amount: 8423, price: 842.30, quantity: 10, date: '2026-07-05T11:15:00', status: 'completed', category: 'Stock' },
  { id: 13, type: 'sip', symbol: 'MIRAE ELSS', name: 'Mirae Asset Tax Saver Fund', amount: 2000, nav: 40.85, units: 48.96, date: '2026-07-01T09:30:00', status: 'completed', category: 'ELSS' },
  { id: 14, type: 'buy', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', amount: 9785, price: 978.45, quantity: 10, date: '2026-06-28T13:30:00', status: 'completed', category: 'Stock' },
  { id: 15, type: 'buy', symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', amount: 7840, price: 1567.90, quantity: 5, date: '2026-06-20T09:30:00', status: 'completed', category: 'Stock' },
];

// Portfolio value snapshots (90 days, in ₹)
export const portfolioSnapshots = (() => {
  const data = [];
  let value = 100000; // Starting virtual portfolio ₹1,00,000
  const now = Date.now();
  for (let i = 90; i >= 0; i--) {
    const dailyChange = (Math.random() - 0.45) * 1800;
    value = Math.max(value + dailyChange, 80000);
    data.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      value: Math.round(value),
      change: +(dailyChange / value * 100).toFixed(2),
    });
  }
  return data;
})();

// Activity log (learning-focused)
export const activityLog = [
  { id: 1, action: 'Completed lesson', detail: 'The Magic of Compound Interest — Money Basics', timestamp: '2026-08-05T14:20:00' },
  { id: 2, action: 'Ran simulation', detail: 'SIP ₹5,000/month for 20 years — Index Fund vs FD', timestamp: '2026-08-05T10:15:00' },
  { id: 3, action: 'Passed quiz', detail: 'Money Basics — Score: 80% (4/5)', timestamp: '2026-08-04T16:30:00' },
  { id: 4, action: 'Asked AI Mentor', detail: '"What is the difference between PPF and NPS?"', timestamp: '2026-08-04T14:00:00' },
  { id: 5, action: 'Explored scheme', detail: 'Sukanya Samriddhi Yojana — 8.2% guaranteed', timestamp: '2026-08-03T11:45:00' },
  { id: 6, action: 'Completed lesson', detail: 'SIP: The Power of Regular Investing — Mutual Funds', timestamp: '2026-08-03T09:30:00' },
  { id: 7, action: 'Earned badge', detail: '⚡ Quick Learner — Completed 5 lessons', timestamp: '2026-08-03T09:35:00' },
  { id: 8, action: 'Virtual trade', detail: 'Bought 5 shares of RELIANCE at ₹2,945.60', timestamp: '2026-08-02T10:15:00' },
  { id: 9, action: 'Completed assessment', detail: 'Financial Literacy Score: 68/100 — Intermediate', timestamp: '2026-08-01T09:00:00' },
  { id: 10, action: 'First login', detail: 'Welcome to Bharat InvestAI! 🇮🇳', timestamp: '2026-08-01T08:55:00' },
];

export const defaultSettings = {
  darkMode: true,
  language: 'en',
  animations: true,
  lessonReminders: true,
  streakReminders: true,
  marketUpdates: false,
  fontSize: 'medium',
  autoPlaySimulations: true,
  showSDGBadges: true,
};

// Financial Goals (in ₹, Indian life milestones)
export const financialGoals = [
  { id: 1, name: 'Emergency Fund', target: 150000, current: 95000, icon: '🛡️', color: '#ef4444', deadline: '2026-12-31', instrument: 'Liquid Fund + Savings Account' },
  { id: 2, name: 'Bike Purchase', target: 120000, current: 45000, icon: '🏍️', color: '#f59e0b', deadline: '2027-06-30', instrument: 'Short-term FD + RD' },
  { id: 3, name: 'Higher Education', target: 1000000, current: 180000, icon: '🎓', color: '#3b82f6', deadline: '2029-07-01', instrument: 'ELSS + Index Fund SIP' },
  { id: 4, name: 'Wedding Fund', target: 1500000, current: 85000, icon: '💒', color: '#ec4899', deadline: '2031-12-31', instrument: 'Hybrid Fund + PPF' },
  { id: 5, name: 'House Down Payment', target: 2500000, current: 120000, icon: '🏠', color: '#8b5cf6', deadline: '2036-01-01', instrument: 'Index Fund + NPS' },
  { id: 6, name: 'Retirement Corpus', target: 30000000, current: 50000, icon: '🌅', color: '#14b8a6', deadline: '2061-01-01', instrument: 'NPS + EPF + Equity MF' },
];
