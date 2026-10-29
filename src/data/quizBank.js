// ─── Quiz Bank — Questions for each learning path ───

export const quizzes = {
  'money-basics': [
    {
      id: 'q-mb-1',
      question: 'If inflation is 6% per year, what will ₹100 be worth in purchasing power after 10 years?',
      options: ['₹100', '₹94', '₹55.84', '₹60'],
      correct: 2,
      explanation: 'At 6% annual inflation, ₹100 today = ₹100 / (1.06)^10 ≈ ₹55.84 in real purchasing power. Inflation silently erodes your money every year.',
      xpReward: 10,
    },
    {
      id: 'q-mb-2',
      question: 'What is the 50-30-20 rule?',
      options: [
        '50% stocks, 30% bonds, 20% cash',
        '50% needs, 30% wants, 20% savings',
        '50% salary, 30% bonus, 20% side income',
        '50% FD, 30% gold, 20% mutual funds',
      ],
      correct: 1,
      explanation: 'The 50-30-20 rule is a budgeting framework: 50% of income for needs (rent, food), 30% for wants (entertainment), and 20% for savings and investments.',
      xpReward: 10,
    },
    {
      id: 'q-mb-3',
      question: '₹1,00,000 invested at 12% compound interest for 20 years becomes approximately:',
      options: ['₹3,40,000', '₹5,00,000', '₹9,64,629', '₹12,00,000'],
      correct: 2,
      explanation: '₹1,00,000 × (1.12)^20 = ₹9,64,629. The magic of compound interest — your interest earns interest, creating exponential growth over time.',
      xpReward: 10,
    },
    {
      id: 'q-mb-4',
      question: 'How many months of expenses should your emergency fund cover?',
      options: ['1 month', '3-6 months', '12 months', 'No need for emergency fund'],
      correct: 1,
      explanation: 'An emergency fund of 3-6 months of living expenses provides a safety net against job loss, medical emergencies, or unexpected expenses without breaking your investments.',
      xpReward: 10,
    },
    {
      id: 'q-mb-5',
      question: 'A savings account earning 3.5% when inflation is 6% means:',
      options: [
        'You are earning 3.5% real returns',
        'You are losing 2.5% in purchasing power every year',
        'Your money is growing',
        'Inflation does not affect savings accounts',
      ],
      correct: 1,
      explanation: 'Real return = Nominal return - Inflation = 3.5% - 6% = -2.5%. Your money is actually losing purchasing power, even though the number in your account is growing.',
      xpReward: 10,
    },
  ],

  'govt-schemes': [
    {
      id: 'q-gs-1',
      question: 'What does EEE (Exempt-Exempt-Exempt) mean for PPF?',
      options: [
        'You pay no fees, no taxes, no penalties',
        'Investment, interest, and maturity are all tax-free',
        'You get 3x returns',
        'The account never expires',
      ],
      correct: 1,
      explanation: 'EEE means your contribution (Exempt under 80C), interest earned (Exempt), and maturity amount (Exempt) are all completely tax-free. PPF is one of the few instruments with this triple exemption.',
      xpReward: 10,
    },
    {
      id: 'q-gs-2',
      question: 'NPS gives an additional tax deduction of ₹50,000 under which section?',
      options: ['Section 80C', 'Section 80CCD(1B)', 'Section 80D', 'Section 10'],
      correct: 1,
      explanation: 'NPS contributions qualify for an additional ₹50,000 deduction under Section 80CCD(1B), over and above the ₹1,50,000 limit of Section 80C. This makes NPS uniquely tax-efficient.',
      xpReward: 10,
    },
    {
      id: 'q-gs-3',
      question: 'Sukanya Samriddhi Yojana can be opened for:',
      options: [
        'Any Indian citizen',
        'Girl child below 10 years of age',
        'Women above 18 years',
        'Senior citizens only',
      ],
      correct: 1,
      explanation: 'SSY is specifically designed for the girl child and can only be opened by parents/guardians of girls below 10 years of age, with a maximum of two accounts per family.',
      xpReward: 10,
    },
  ],

  'mutual-funds': [
    {
      id: 'q-mf-1',
      question: 'What does SIP stand for?',
      options: [
        'Standard Investment Protocol',
        'Systematic Investment Plan',
        'Stock Investment Portfolio',
        'Savings Interest Plan',
      ],
      correct: 1,
      explanation: 'SIP (Systematic Investment Plan) allows you to invest a fixed amount in mutual funds at regular intervals (usually monthly). It removes the need to time the market.',
      xpReward: 10,
    },
    {
      id: 'q-mf-2',
      question: '₹5,000/month SIP in NIFTY 50 Index Fund for 20 years at 12% average return creates approximately:',
      options: ['₹12,00,000', '₹24,00,000', '₹49,95,000', '₹1,00,00,000'],
      correct: 2,
      explanation: 'SIP of ₹5,000/month for 20 years = ₹12,00,000 invested. At 12% CAGR, this grows to approximately ₹49,95,740. You earn nearly ₹38 lakh purely from compounding.',
      xpReward: 10,
    },
    {
      id: 'q-mf-3',
      question: 'Which type of mutual fund has the lowest expense ratio?',
      options: ['Large Cap Fund', 'Small Cap Fund', 'Index Fund', 'ELSS Fund'],
      correct: 2,
      explanation: 'Index funds have the lowest expense ratios (0.1-0.5%) because they simply mirror an index like NIFTY 50 without active stock picking. Lower fees = more of your money stays invested.',
      xpReward: 10,
    },
    {
      id: 'q-mf-4',
      question: 'What is the lock-in period for ELSS mutual funds?',
      options: ['1 year', '3 years', '5 years', 'No lock-in'],
      correct: 1,
      explanation: 'ELSS has the shortest lock-in period (3 years) among all Section 80C tax-saving investments. Compare: PPF is 15 years, NPS is till 60, tax-saving FD is 5 years.',
      xpReward: 10,
    },
  ],

  'stock-market': [
    {
      id: 'q-sm-1',
      question: 'NIFTY 50 tracks the performance of:',
      options: [
        'Top 50 companies on BSE',
        'Top 50 companies on NSE',
        'Top 50 mutual funds',
        'Top 50 government bonds',
      ],
      correct: 1,
      explanation: 'NIFTY 50 is the benchmark index of the National Stock Exchange (NSE), tracking the 50 largest and most liquid companies listed on it.',
      xpReward: 10,
    },
    {
      id: 'q-sm-2',
      question: 'A P/E ratio of 30 means:',
      options: [
        'The stock costs ₹30',
        'Investors pay ₹30 for every ₹1 of the company\'s earnings',
        'The company has 30 employees',
        'The stock will grow 30% this year',
      ],
      correct: 1,
      explanation: 'P/E (Price-to-Earnings) ratio shows how much investors are willing to pay for each rupee of earnings. P/E of 30 means the stock is priced at 30 times its annual earnings.',
      xpReward: 10,
    },
  ],

  'tax-planning': [
    {
      id: 'q-tp-1',
      question: 'Maximum deduction allowed under Section 80C is:',
      options: ['₹1,00,000', '₹1,50,000', '₹2,00,000', '₹2,50,000'],
      correct: 1,
      explanation: 'Section 80C allows a maximum deduction of ₹1,50,000 per financial year. This includes investments in PPF, ELSS, EPF, NSC, 5-year FD, SSY, and life insurance premiums.',
      xpReward: 10,
    },
    {
      id: 'q-tp-2',
      question: 'Which type of insurance should you buy first?',
      options: ['Endowment plan', 'ULIP', 'Term insurance', 'Money-back policy'],
      correct: 2,
      explanation: 'Term insurance provides the highest cover at the lowest cost. A 25-year-old can get ₹1 crore cover for ₹600-800/month. Never mix insurance with investment.',
      xpReward: 10,
    },
  ],

  'retirement': [
    {
      id: 'q-rp-1',
      question: 'The 25x rule for retirement means:',
      options: [
        'Save 25% of your salary',
        'Your corpus should be 25 times your annual expenses',
        'Invest for 25 years',
        'Retire at age 25 × your savings rate',
      ],
      correct: 1,
      explanation: 'The 25x rule says your retirement corpus should be 25 times your annual expenses. If you spend ₹6 lakh/year (adjusted for inflation), you need ₹1.5 crore at retirement.',
      xpReward: 10,
    },
  ],

  'advanced-portfolio': [
    {
      id: 'q-ap-1',
      question: 'Asset allocation (how you split between equity, debt, gold) determines what percentage of portfolio returns?',
      options: ['30%', '50%', '70%', '90%'],
      correct: 3,
      explanation: 'Academic studies show that asset allocation determines approximately 90% of portfolio returns over time. Individual stock selection and market timing matter far less than most people think.',
      xpReward: 10,
    },
    {
      id: 'q-ap-2',
      question: 'What is FOMO in investing?',
      options: [
        'A type of mutual fund',
        'Fear Of Missing Out — buying because others are buying',
        'A technical chart pattern',
        'A government regulation',
      ],
      correct: 1,
      explanation: 'FOMO (Fear Of Missing Out) is a behavioral bias where investors buy assets simply because everyone else is buying, without doing their own research. It often leads to buying at market peaks.',
      xpReward: 10,
    },
  ],
};

// Get quiz for a path
export function getQuizByPathId(pathId) {
  return quizzes[pathId] || [];
}

// Calculate quiz score
export function calculateQuizScore(pathId, answers) {
  const quiz = quizzes[pathId] || [];
  let correct = 0;
  let totalXP = 0;
  const results = quiz.map((q, i) => {
    const isCorrect = answers[i] === q.correct;
    if (isCorrect) {
      correct++;
      totalXP += q.xpReward;
    }
    return { ...q, userAnswer: answers[i], isCorrect };
  });
  return {
    correct,
    total: quiz.length,
    percentage: Math.round((correct / quiz.length) * 100),
    xpEarned: totalXP,
    results,
  };
}
