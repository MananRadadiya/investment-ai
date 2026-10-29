// ─── Curriculum Data — 7 structured learning paths for financial literacy ───

export const learningPaths = [
  {
    id: 'money-basics',
    title: 'Money Basics',
    description: 'Understand savings, budgeting, inflation, and the power of compound interest.',
    icon: '💰',
    level: 'Beginner',
    lessonCount: 6,
    estimatedTime: '40 min',
    color: '#10b981',
    sdg: ['SDG 4', 'SDG 8'],
    prerequisites: [],
    lessons: [
      {
        id: 'mb-1',
        title: 'Why Money Matters',
        content: 'Money is not just about buying things — it is a tool for freedom, security, and opportunity. In India, where 27% of the population is financially literate, understanding money is a superpower.\n\nFinancial literacy means knowing how to earn, save, invest, and protect your money. It does not require a finance degree — it requires curiosity and practice.\n\nThink of it this way: you would not drive a car without learning how. Why would you manage your money without learning how?',
        keyTakeaway: 'Financial literacy is the foundation of every life decision — from buying a phone to planning retirement.',
        xpReward: 10,
      },
      {
        id: 'mb-2',
        title: 'The Savings Habit',
        content: 'The first rule of personal finance is simple: spend less than you earn. The gap between income and expenses is your savings.\n\nThe 50-30-20 rule is a popular framework:\n• 50% for needs (rent, food, bills)\n• 30% for wants (entertainment, dining out)\n• 20% for savings and investments\n\nFor someone earning ₹30,000/month, this means saving ₹6,000 every month. Over 10 years, even without investing, that is ₹7,20,000. But if invested wisely, it could become ₹13,00,000 or more.\n\nThe key is consistency. ₹500 saved every month from age 22 is worth more than ₹5,000/month starting at age 35.',
        keyTakeaway: 'Pay yourself first. Automate your savings. Even ₹500/month matters if you start early.',
        xpReward: 10,
      },
      {
        id: 'mb-3',
        title: 'Understanding Inflation',
        content: 'Inflation is the silent thief that erodes your money\'s purchasing power every year.\n\nIf a plate of idli costs ₹40 today and inflation is 6%, the same plate will cost ₹72 in 10 years. Your ₹40 will only buy half a plate.\n\nIndia\'s average inflation has been around 5-7% over the past decade. This means:\n• ₹1,00,000 today = ₹55,839 in purchasing power after 10 years (at 6% inflation)\n• A savings account earning 3.5% actually LOSES money in real terms\n• Your investments must earn MORE than inflation to grow wealth\n\nThis is why keeping all your money in a savings account is actually risky — you are guaranteed to lose purchasing power.',
        keyTakeaway: 'Inflation at 6% halves your money\'s value in 12 years. Your returns must beat inflation to create real wealth.',
        xpReward: 15,
      },
      {
        id: 'mb-4',
        title: 'The Magic of Compound Interest',
        content: 'Albert Einstein reportedly called compound interest "the eighth wonder of the world." Here is why.\n\nSimple interest: You earn interest only on your original amount.\nCompound interest: You earn interest on your interest.\n\nExample with ₹1,00,000 at 12% for 20 years:\n• Simple interest: ₹1,00,000 + (₹12,000 × 20) = ₹3,40,000\n• Compound interest: ₹1,00,000 × (1.12)^20 = ₹9,64,629\n\nThe difference is ₹6,24,629 — more than 6 times your original investment — just from letting interest earn interest.\n\nThis is why starting early matters more than starting big. A 22-year-old investing ₹3,000/month will have more at 60 than a 35-year-old investing ₹10,000/month.',
        keyTakeaway: 'Compound interest turns ₹1 lakh into ₹9.6 lakh in 20 years at 12%. Time is your greatest asset.',
        xpReward: 15,
      },
      {
        id: 'mb-5',
        title: 'Emergency Fund: Your Financial Airbag',
        content: 'Before you invest a single rupee, build an emergency fund. This is non-negotiable.\n\nAn emergency fund is 3-6 months of your living expenses kept in a liquid, accessible account. If your monthly expenses are ₹25,000, your emergency fund should be ₹75,000 to ₹1,50,000.\n\nWhere to keep it:\n• Savings account (instant access, low returns)\n• Liquid mutual fund (1-day withdrawal, slightly better returns)\n• Fixed deposit with premature withdrawal facility\n\nNever invest this money in stocks, mutual funds, or any market-linked instrument. The purpose is safety, not growth.\n\nWithout an emergency fund, a single medical bill, job loss, or unexpected expense can force you to break your investments at the worst possible time.',
        keyTakeaway: 'Save 3-6 months of expenses in an emergency fund before investing. This protects your investments from life\'s surprises.',
        xpReward: 10,
      },
      {
        id: 'mb-6',
        title: 'Setting Financial Goals',
        content: 'Goals give your money direction. Without goals, investing is guessing.\n\nEvery financial goal has three components:\n1. What: What do you want? (House, car, education, retirement)\n2. When: When do you need it? (3 years, 10 years, 30 years)\n3. How much: What will it cost in future rupees? (Include inflation)\n\nExample goals for a 25-year-old:\n• Emergency fund: ₹1,50,000 in 6 months (short-term)\n• Bike purchase: ₹1,20,000 in 2 years (short-term)\n• Wedding: ₹10,00,000 in 5 years (medium-term)\n• House down payment: ₹20,00,000 in 10 years (medium-term)\n• Retirement: ₹3,00,00,000 in 35 years (long-term)\n\nEach goal requires a different investment strategy. Short-term goals need safe instruments (FD, RD). Long-term goals can use equity (stocks, mutual funds) because you have time to ride out market volatility.',
        keyTakeaway: 'Define your goals with a specific amount and timeline. The timeline determines which investment instrument to use.',
        xpReward: 15,
      },
    ],
  },
  {
    id: 'govt-schemes',
    title: 'Banking & Government Schemes',
    description: 'Navigate India\'s banking system and government savings schemes for maximum benefit.',
    icon: '🏛️',
    level: 'Beginner',
    lessonCount: 5,
    estimatedTime: '35 min',
    color: '#3b82f6',
    sdg: ['SDG 4', 'SDG 10'],
    prerequisites: ['money-basics'],
    lessons: [
      { id: 'gs-1', title: 'Your Bank Account: More Than a Locker', content: 'Understanding savings accounts, current accounts, and how banking works in Digital India. From Jan Dhan Yojana to UPI, India\'s banking revolution has brought 50 crore people into the financial system.', keyTakeaway: 'A bank account is your first step into the formal financial system. UPI has made India a global leader in digital payments.', xpReward: 10 },
      { id: 'gs-2', title: 'Fixed Deposits & Recurring Deposits', content: 'FDs and RDs are India\'s most popular savings instruments. Learn when to use them, how interest is calculated, and why they may not beat inflation long-term.', keyTakeaway: 'FDs are safe but may not beat inflation. Use them for short-term goals and emergency funds, not long-term wealth building.', xpReward: 10 },
      { id: 'gs-3', title: 'PPF: India\'s Best Tax-Free Investment', content: 'Public Provident Fund offers 7.1% returns, complete tax exemption (EEE), and government backing. Learn how to maximize this 15-year instrument.', keyTakeaway: 'PPF is the gold standard for risk-free, tax-free long-term savings in India. Start one as early as possible.', xpReward: 15 },
      { id: 'gs-4', title: 'NPS & EPF: Securing Your Retirement', content: 'National Pension System and Employee Provident Fund are your retirement pillars. Learn how they work, their tax benefits, and how to optimize contributions.', keyTakeaway: 'NPS gives an extra ₹50,000 tax deduction beyond Section 80C. EPF is free money from your employer — never skip it.', xpReward: 15 },
      { id: 'gs-5', title: 'Sukanya Samriddhi & Atal Pension', content: 'Special schemes for the girl child and unorganized sector workers. Learn about India\'s social security net and how to benefit from government co-contributions.', keyTakeaway: 'SSY offers 8.2% for your daughter\'s future. APY guarantees pension starting at just ₹42/month. Government schemes are powerful tools.', xpReward: 10 },
    ],
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & SIP',
    description: 'Learn how mutual funds work, what SIP is, and how to choose the right fund for your goals.',
    icon: '📈',
    level: 'Beginner',
    lessonCount: 6,
    estimatedTime: '45 min',
    color: '#8b5cf6',
    sdg: ['SDG 4', 'SDG 8'],
    prerequisites: ['money-basics'],
    lessons: [
      { id: 'mf-1', title: 'What is a Mutual Fund?', content: 'A mutual fund pools money from thousands of investors and invests it in stocks, bonds, or other securities. A professional fund manager makes the investment decisions for you.', keyTakeaway: 'Mutual funds let you invest in the stock market without needing to pick individual stocks. Professional management, instant diversification.', xpReward: 10 },
      { id: 'mf-2', title: 'Types of Mutual Funds', content: 'Equity funds, debt funds, hybrid funds, index funds, ELSS — each serves a different purpose. Learn which type matches your goals and risk tolerance.', keyTakeaway: 'Match your fund type to your goal timeline: Equity for 5+ years, Hybrid for 3-5 years, Debt for under 3 years.', xpReward: 10 },
      { id: 'mf-3', title: 'SIP: The Power of Regular Investing', content: 'Systematic Investment Plan (SIP) lets you invest a fixed amount every month. ₹5,000/month in NIFTY 50 for 20 years at 12% average return = ₹49,95,740. You invested only ₹12,00,000.', keyTakeaway: '₹5,000/month SIP for 20 years creates nearly ₹50 lakh. SIP removes the need to time the market and builds discipline.', xpReward: 15 },
      { id: 'mf-4', title: 'NAV, Expense Ratio & Fund Selection', content: 'NAV (Net Asset Value) is the price per unit of a mutual fund. Expense ratio is the annual fee charged by the fund. Lower expense ratio = more money stays invested for you.', keyTakeaway: 'Choose funds with consistent 5-year+ returns, low expense ratios (under 1% for index funds), and 4-5 star ratings.', xpReward: 10 },
      { id: 'mf-5', title: 'ELSS: Invest and Save Tax', content: 'Equity Linked Savings Scheme is the only mutual fund with a tax benefit. ₹1,50,000 invested in ELSS saves up to ₹46,800 in tax (30% bracket) while growing your wealth.', keyTakeaway: 'ELSS has the shortest lock-in (3 years) among Section 80C options, and historically delivers 12-15% returns.', xpReward: 15 },
      { id: 'mf-6', title: 'Index Funds: The Simplest Strategy', content: 'Warren Buffett recommends index funds for most investors. An index fund mirrors the NIFTY 50 or Sensex at extremely low cost. No fund manager bias, no stock picking — just pure market returns.', keyTakeaway: 'Index funds beat 80% of actively managed funds over 10+ years. UTI Nifty 50 Index Fund charges just 0.18% — one of the cheapest ways to invest.', xpReward: 10 },
    ],
  },
  {
    id: 'stock-market',
    title: 'Stock Market Fundamentals',
    description: 'Understand how the stock market works, what NIFTY and SENSEX mean, and how to evaluate companies.',
    icon: '📊',
    level: 'Intermediate',
    lessonCount: 5,
    estimatedTime: '40 min',
    color: '#f59e0b',
    sdg: ['SDG 4', 'SDG 9'],
    prerequisites: ['mutual-funds'],
    lessons: [
      { id: 'sm-1', title: 'How the Stock Market Works', content: 'The stock market is where companies sell ownership stakes (shares) to raise capital, and investors buy/sell these shares. NSE and BSE are India\'s two major exchanges.', keyTakeaway: 'When you buy a share, you become a part-owner of that company. Stock prices reflect what people believe the company is worth.', xpReward: 15 },
      { id: 'sm-2', title: 'NIFTY 50 & SENSEX Explained', content: 'NIFTY 50 tracks the top 50 companies on NSE. SENSEX tracks the top 30 on BSE. They are barometers of the Indian economy.', keyTakeaway: 'When people say "market is up," they usually mean NIFTY or SENSEX is up. These indices represent India\'s largest, most stable companies.', xpReward: 10 },
      { id: 'sm-3', title: 'Reading a Stock Quote', content: 'Price, volume, market cap, P/E ratio, 52-week high/low — learn to read the key numbers that tell a stock\'s story.', keyTakeaway: 'P/E ratio tells you how expensive a stock is relative to its earnings. Lower P/E = potentially undervalued, but always check why.', xpReward: 15 },
      { id: 'sm-4', title: 'IPOs and How Companies Go Public', content: 'When a company wants to raise money from the public for the first time, it launches an Initial Public Offering (IPO). Learn how to evaluate IPOs.', keyTakeaway: 'Not all IPOs are good investments. Check the company\'s financials, business model, and promoter history before applying.', xpReward: 10 },
      { id: 'sm-5', title: 'Bull Markets, Bear Markets & Corrections', content: 'Markets move in cycles. Bull markets rise 20%+, bear markets fall 20%+, and corrections are temporary 10%+ drops. Understanding cycles prevents panic.', keyTakeaway: 'Bear markets are temporary. Every major crash in Indian history (1992, 2008, 2020) was followed by recovery. Patience beats panic.', xpReward: 15 },
    ],
  },
  {
    id: 'tax-planning',
    title: 'Tax Planning & Insurance',
    description: 'Learn to legally minimize your taxes and protect your family with the right insurance.',
    icon: '🧾',
    level: 'Intermediate',
    lessonCount: 4,
    estimatedTime: '30 min',
    color: '#ef4444',
    sdg: ['SDG 4', 'SDG 8'],
    prerequisites: ['govt-schemes'],
    lessons: [
      { id: 'tp-1', title: 'Section 80C: Your Tax-Saving Toolkit', content: 'Section 80C allows deductions up to ₹1,50,000 per year. PPF, ELSS, EPF, SSY, NSC, 5-year FD, life insurance premium, and tuition fees all qualify.', keyTakeaway: 'Maximize 80C every year. If you\'re in the 30% bracket, ₹1,50,000 in 80C saves you ₹46,800 in tax.', xpReward: 15 },
      { id: 'tp-2', title: 'New Tax Regime vs Old Tax Regime', content: 'India offers two tax regimes. The old regime allows deductions (80C, HRA, etc.). The new regime offers lower rates but no deductions. Learn which is better for you.', keyTakeaway: 'If your total deductions exceed ₹3,75,000, the old regime is better. Otherwise, the new regime with lower slabs wins.', xpReward: 15 },
      { id: 'tp-3', title: 'Term Insurance: The Most Important Policy', content: 'Term insurance is pure life cover — no investment component. A 25-year-old can get ₹1 crore cover for just ₹600-800/month. It is the cheapest way to protect your family.', keyTakeaway: 'Buy term insurance early (lower premiums), cover = 10-15x annual income, and never mix insurance with investment.', xpReward: 10 },
      { id: 'tp-4', title: 'Health Insurance: Protecting Your Wealth', content: 'A single hospitalization can cost ₹5-10 lakh. Health insurance (₹5-10 lakh cover) costs ₹5,000-15,000/year. Without it, medical expenses can destroy decades of savings.', keyTakeaway: 'Health insurance is not optional. Get at least ₹5 lakh family floater cover. Premium is deductible under Section 80D.', xpReward: 10 },
    ],
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for a financially independent retirement — because your future self deserves it.',
    icon: '🌅',
    level: 'Intermediate',
    lessonCount: 4,
    estimatedTime: '30 min',
    color: '#14b8a6',
    sdg: ['SDG 4', 'SDG 8', 'SDG 10'],
    prerequisites: ['tax-planning'],
    lessons: [
      { id: 'rp-1', title: 'How Much Do You Need to Retire?', content: 'If you spend ₹40,000/month today, at 6% inflation you\'ll need ₹2,15,000/month in 30 years. That requires a corpus of approximately ₹4.5 crore.', keyTakeaway: 'Use the 25x rule: your retirement corpus should be 25 times your annual expenses (adjusted for inflation).', xpReward: 15 },
      { id: 'rp-2', title: 'EPF + NPS: Your Retirement Pillars', content: 'EPF at 8.25% is automatically deducted. NPS lets you choose equity exposure for higher returns. Together, they form your retirement foundation.', keyTakeaway: 'Increase your VPF (Voluntary Provident Fund) contribution and add NPS for the extra ₹50,000 tax benefit.', xpReward: 10 },
      { id: 'rp-3', title: 'The Power of Starting Early', content: 'Starting at 25 with ₹5,000/month at 12% gives you ₹3.24 crore by 60. Starting at 35 with the same amount gives only ₹94 lakh. 10 years of delay costs ₹2.3 crore.', keyTakeaway: 'Delay costs exponentially. Every year you wait to start investing for retirement costs you lakhs in future wealth.', xpReward: 15 },
      { id: 'rp-4', title: 'Creating Passive Income Streams', content: 'Dividends, rental income, SWP (Systematic Withdrawal Plan) from mutual funds, and pension from NPS/APY — diversify your retirement income sources.', keyTakeaway: 'Don\'t depend on a single income source in retirement. Build multiple streams: pension + dividends + SWP + rental.', xpReward: 10 },
    ],
  },
  {
    id: 'advanced-portfolio',
    title: 'Advanced Portfolio Theory',
    description: 'Master diversification, asset allocation, risk management, and rebalancing strategies.',
    icon: '🎓',
    level: 'Advanced',
    lessonCount: 4,
    estimatedTime: '35 min',
    color: '#6366f1',
    sdg: ['SDG 4', 'SDG 9'],
    prerequisites: ['stock-market', 'retirement'],
    lessons: [
      { id: 'ap-1', title: 'Asset Allocation: The Most Important Decision', content: 'Studies show that asset allocation — how you split between equity, debt, and gold — determines 90% of your portfolio returns. Individual stock selection matters far less.', keyTakeaway: 'The rule of thumb: 100 minus your age = equity percentage. A 25-year-old: 75% equity, 20% debt, 5% gold.', xpReward: 15 },
      { id: 'ap-2', title: 'Diversification: Don\'t Put All Eggs in One Basket', content: 'Diversification means spreading investments across different asset classes, sectors, and geographies so that no single failure can destroy your portfolio.', keyTakeaway: 'True diversification requires assets that don\'t move together. Stocks + Gold + Debt = better protection than 10 different stocks.', xpReward: 15 },
      { id: 'ap-3', title: 'Rebalancing: Keeping Your Portfolio Healthy', content: 'Markets move your allocation away from targets. If stocks surge, your 60% equity might become 75%. Rebalancing means selling some stocks and buying debt to restore balance.', keyTakeaway: 'Rebalance once a year or when any asset class drifts more than 5% from target. This forces you to buy low and sell high.', xpReward: 15 },
      { id: 'ap-4', title: 'Behavioral Traps: Your Biggest Investment Enemy', content: 'FOMO (buying because others are), panic selling (exiting during crashes), anchoring (fixating on purchase price), and overconfidence — your brain is not built for investing.', keyTakeaway: 'Automate your investments via SIP. Remove emotions from the equation. The best investors are often the most boring ones.', xpReward: 20 },
    ],
  },
];

// Get path by ID
export function getPathById(id) {
  return learningPaths.find((p) => p.id === id);
}

// Get lesson by ID
export function getLessonById(lessonId) {
  for (const path of learningPaths) {
    const lesson = path.lessons.find((l) => l.id === lessonId);
    if (lesson) return { ...lesson, pathId: path.id, pathTitle: path.title };
  }
  return null;
}

// Get total lesson count
export function getTotalLessonCount() {
  return learningPaths.reduce((sum, p) => sum + p.lessons.length, 0);
}

// Get total XP available
export function getTotalXPAvailable() {
  return learningPaths.reduce((sum, p) => sum + p.lessons.reduce((s, l) => s + l.xpReward, 0), 0);
}
