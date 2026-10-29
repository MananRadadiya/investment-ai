import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, BookOpen, Lightbulb } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

// ─── Educational responses — NEVER gives buy/sell advice ───
const educationalResponses = [
  {
    q: 'What is SIP?',
    a: "**Systematic Investment Plan (SIP)** lets you invest a fixed amount every month in mutual funds — like ₹500 or ₹5,000.\n\n**Why SIP works:**\n• **Rupee Cost Averaging** — You buy more units when prices are low, fewer when high\n• **Discipline** — Automates your investing, removes emotional decisions\n• **Compounding** — ₹5,000/month for 20 years at 12% = **₹49,95,740** (you invested only ₹12,00,000)\n\n**Key insight:** SIP removes the need to \"time the market.\" Even experts can't consistently predict market movements.\n\n💡 **What did you learn?** SIP is the simplest way to build long-term wealth. Start with any amount — even ₹500/month matters if you start early.",
    lesson: 'mutual-funds',
  },
  {
    q: 'What should I invest in?',
    a: "Great question! But I'm an **educational mentor**, not a financial advisor — I won't tell you *what* to buy, but I'll teach you *how to think about it*.\n\n**The framework:**\n1. **Define your goal** — What are you saving for? (Emergency fund, wedding, house, retirement)\n2. **Set your timeline** — When do you need the money?\n3. **Match the instrument:**\n   • Under 3 years → **FD, RD, Liquid Funds** (safe)\n   • 3-5 years → **Hybrid Funds, PPF** (balanced)\n   • 5+ years → **Index Funds, ELSS, NPS** (growth)\n4. **Start a SIP** — ₹500/month in a NIFTY 50 Index Fund is a great first step\n\n⚠️ **SEBI Disclaimer:** No one can guarantee returns. Past performance ≠ future results.\n\n💡 **What did you learn?** The right investment depends on YOUR timeline and goals, not what's trending on social media.",
    lesson: 'money-basics',
  },
  {
    q: 'How to save tax?',
    a: "**Section 80C** is your primary tax-saving toolkit — up to **₹1,50,000/year** in deductions.\n\n**Best instruments (ranked by returns + flexibility):**\n1. **ELSS Mutual Funds** — 12-15% returns, only 3-year lock-in, shortest among 80C options\n2. **PPF** — 7.1% guaranteed, tax-free (EEE), 15-year lock-in\n3. **NPS** — Extra ₹50,000 deduction under 80CCD(1B), equity exposure for higher returns\n4. **EPF/VPF** — 8.25%, employer matches your contribution (free money!)\n5. **5-year FD** — 6-7.5%, simple and safe\n\n**Beyond 80C:**\n• **80D** — Health insurance premium (up to ₹25,000)\n• **80CCD(1B)** — Additional ₹50,000 for NPS\n• **80E** — Education loan interest (no limit)\n\n**Pro tip:** Don't invest just to save tax. Choose instruments that also match your financial goals.\n\n💡 **What did you learn?** Tax planning is a powerful way to keep more of your money. ₹1,50,000 in 80C at 30% bracket saves you ₹46,800 every year.",
    lesson: 'tax-planning',
  },
  {
    q: 'What is compound interest?',
    a: "**Compound interest** is earning interest on your interest. It's what Albert Einstein reportedly called \"the eighth wonder of the world.\"\n\n**Simple vs Compound:**\n• **Simple:** ₹1,00,000 at 12% for 20 years = ₹3,40,000\n• **Compound:** ₹1,00,000 at 12% for 20 years = **₹9,64,629**\n\nThe difference? **₹6,24,629** — just from letting interest earn interest!\n\n**The Indian idli test 🍽️:**\nIf a plate of idli costs ₹40 today and inflation is 6%, in 10 years it'll cost ₹72. Your savings must beat inflation to maintain purchasing power.\n\n**The real magic — starting early:**\n• Age 22, investing ₹3,000/month → ₹3.24 Cr at 60\n• Age 35, investing ₹10,000/month → ₹94 Lakh at 60\n• 10 years of delay costs ₹2.3 Crore!\n\n💡 **What did you learn?** Time is your greatest asset in investing. The best time to start was yesterday. The second-best time is today.",
    lesson: 'money-basics',
  },
  {
    q: 'PPF vs NPS - which is better?',
    a: "**It's not either/or — they serve different purposes:**\n\n| Feature | PPF | NPS |\n|---------|-----|-----|\n| Returns | 7.1% (guaranteed) | 8-10% (market-linked) |\n| Tax benefit | Section 80C | 80C + extra ₹50,000 (80CCD1B) |\n| Lock-in | 15 years | Till age 60 |\n| Risk | Zero | Low to Moderate |\n| Withdrawal | Partial from year 7 | Limited before 60 |\n| Tax on maturity | Fully exempt (EEE) | 60% exempt, 40% annuity |\n\n**Use PPF when:** You want guaranteed, completely tax-free returns and don't need the money for 15 years.\n\n**Use NPS when:** You want higher returns through equity exposure and need the extra ₹50,000 tax deduction.\n\n**Best strategy for most people:** **Do both!** Max out PPF at ₹1,50,000/year + invest in NPS for the extra ₹50,000 deduction.\n\n💡 **What did you learn?** PPF and NPS complement each other. PPF is your safe pillar, NPS adds growth. Together, they form a strong retirement foundation.",
    lesson: 'govt-schemes',
  },
  {
    q: 'Is the stock market risky?',
    a: "**The stock market is volatile, but \"risk\" depends on your time horizon.**\n\n**Historical NIFTY 50 data:**\n• Any 1-day period: Could gain or lose 5-10%\n• Any 1-year period: Returns ranged from -52% to +76%\n• Any 5-year period: Returns ranged from -3% to +44%\n• **Any 15-year period: NEVER gave negative returns** (since inception)\n\n**Every major crash recovered:**\n• 1992 Harshad Mehta → recovered\n• 2008 Global Crisis → NIFTY went from 6,000 to 21,000+ in 10 years\n• 2020 COVID crash → NIFTY fell 38%, recovered 100% in 14 months\n\n**The real risk is NOT investing:**\n₹1,00,000 in savings account at 3.5% for 20 years = ₹2,00,000\n₹1,00,000 in NIFTY 50 at 12% for 20 years = ₹9,64,629\nThe \"safe\" choice costs you ₹7.6 lakh in opportunity.\n\n**Rule of thumb:** Never invest money you'll need within 5 years in equity.\n\n💡 **What did you learn?** Risk is not about market crashes — it's about time. With a 15+ year horizon, equity has historically been the safest long-term wealth builder.",
    lesson: 'stock-market',
  },
  {
    q: 'How much to save for retirement?',
    a: "**The 25x Rule:** Your retirement corpus should be **25 times your annual expenses** (adjusted for inflation).\n\n**Example for a 25-year-old:**\n• Monthly expenses today: ₹40,000\n• At 6% inflation, in 35 years: ₹3,08,000/month\n• Annual expenses at retirement: ₹36,96,000\n• Required corpus: **₹36,96,000 × 25 = ₹9.24 Crore**\n\n**How to get there:**\n₹10,000/month SIP starting at age 25 at 12% returns:\n• At 40: ₹50 Lakh\n• At 50: ₹2.6 Crore\n• At 60: **₹10.8 Crore** ✅\n\n**Your retirement pillars:**\n1. **EPF** — 8.25%, employer matches (free money)\n2. **NPS** — Equity exposure + extra ₹50K tax deduction\n3. **PPF** — Tax-free guaranteed returns\n4. **Index Fund SIP** — Market-linked growth\n\n💡 **What did you learn?** Retirement seems far away, but every year you delay costs lakhs. ₹10,000/month from age 25 beats ₹30,000/month from age 35.",
    lesson: 'retirement',
  },
  {
    q: 'What is mutual fund?',
    a: "**A Mutual Fund pools money from thousands of investors** and invests it in stocks, bonds, or both. A professional fund manager handles all the decisions.\n\n**Think of it like a thali 🍽️:**\nBuying individual stocks = ordering single dishes (risky if one is bad)\nMutual fund = ordering a thali (instant diversification)\n\n**Types you should know:**\n• **Index Fund** — Mirrors NIFTY 50. Lowest cost (0.1-0.5%). Beats 80% of actively managed funds over 10 years.\n• **ELSS** — Tax-saving fund. 3-year lock-in. Section 80C benefit.\n• **Large Cap** — Top 100 companies. Stable returns.\n• **Mid/Small Cap** — Higher returns but more volatile.\n• **Debt Fund** — Invests in bonds. Lower risk, lower returns.\n\n**How to start:**\n1. Open a free account on any MF platform (Groww, Zerodha, Paytm Money)\n2. Start a SIP of ₹500/month in UTI Nifty 50 Index Fund\n3. That's it. Seriously. You're now an investor.\n\n💡 **What did you learn?** Mutual funds are the easiest way to start investing. You don't need to pick stocks — a ₹500/month SIP in an index fund is a great first step.",
    lesson: 'mutual-funds',
  },
];

const suggestions = [
  'What is SIP?',
  'What should I invest in?',
  'How to save tax?',
  'What is compound interest?',
  'PPF vs NPS - which is better?',
  'Is the stock market risky?',
  'What is mutual fund?',
  'How much to save for retirement?',
];

// ─── COMPONENT ───
export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Namaste! 🙏 I'm your **AI Guru** — your personal financial literacy mentor.\n\nI'll help you **understand** investing concepts, government schemes, tax planning, and more — using simple Indian examples.\n\n⚠️ **Important:** I teach financial concepts. I do NOT give buy/sell advice or recommend specific investments. For investment decisions, always consult a SEBI-registered advisor.\n\nWhat would you like to learn today?",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef(null);
  const { incrementStat } = useProgress();

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Find matching educational response
    const match = educationalResponses.find(
      (r) => r.q.toLowerCase() === text.toLowerCase()
    );

    const response = match?.a ||
      `That's a great question! Let me explain in simple terms.\n\nFinancial literacy is about understanding how money works — earning, saving, investing, and protecting it. Every concept connects to your real life.\n\n**Here's what I'd recommend:**\n1. Start with the **Learning Paths** — they cover everything from savings basics to portfolio theory\n2. Use the **SIP Calculator** to see how small monthly investments grow\n3. Explore **Government Schemes** — PPF, NPS, and SSY are powerful tools\n\nTry asking me about specific topics like "What is SIP?", "How to save tax?", or "What is compound interest?"\n\n💡 **What did you learn?** The journey of financial literacy starts with one question. Keep asking!`;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: response,
          time: 'Just now',
          lesson: match?.lesson,
        },
      ]);
      incrementStat('aiConversations');
    }, 1000 + Math.random() * 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
          Ask Guru 🙏
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Your AI financial literacy mentor — teaches concepts, never gives investment advice
        </p>
      </div>

      {/* Chat Area */}
      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: 'var(--color-ai-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot style={{ width: 16, height: 16, color: 'var(--color-ai)' }} />
                </div>
              )}
              <div style={{
                maxWidth: '75%', padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? 'var(--color-trust)' : 'var(--bg-tertiary)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </div>
                {msg.lesson && (
                  <div style={{
                    marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  }}>
                    <BookOpen style={{ width: 13, height: 13, color: 'var(--color-learning)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--color-learning)', fontWeight: 500 }}>
                      Related lesson available in Learning Paths
                    </span>
                  </div>
                )}
                <p style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-2)' }}>{msg.time}</p>
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--color-trust), var(--color-ai))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User style={{ width: 14, height: 14, color: '#fff' }} />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-ai-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot style={{ width: 16, height: 16, color: 'var(--color-ai)' }} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg-tertiary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--text-tertiary)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Suggestion Pills */}
        {messages.length <= 2 && (
          <div style={{
            padding: '0 var(--space-6) var(--space-3)',
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)',
          }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all 150ms',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', gap: 'var(--space-3)',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SIP, mutual funds, tax saving, compound interest..."
            disabled={isTyping}
            className="input"
            style={{ flex: 1, height: 44, borderRadius: 'var(--radius-sm)' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary"
            style={{
              width: 44, height: 44, padding: 0,
              borderRadius: 'var(--radius-sm)',
              opacity: input.trim() ? 1 : 0.4,
            }}
          >
            <Send style={{ width: 16, height: 16 }} />
          </motion.button>
        </form>

        {/* SEBI Disclaimer */}
        <div style={{
          padding: '8px var(--space-6)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        }}>
          <Lightbulb style={{ width: 12, height: 12, color: 'var(--text-ghost)' }} />
          <p style={{ fontSize: '10px', color: 'var(--text-ghost)' }}>
            Educational content only. Not SEBI-registered investment advice. Consult a qualified financial advisor for personal investment decisions.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
