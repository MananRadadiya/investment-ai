import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

const initialMessages = [
  { id: 1, role: 'assistant', content: "Hello! I'm your AI Investment Assistant. I can help you analyze markets, review your portfolio, explain strategies, and provide insights. What would you like to know?", time: 'Just now' },
];

const canned = [
  { q: 'How is the market doing today?', a: "Today's market shows mixed signals. The S&P 500 is up 0.89% with tech leading gains. NVIDIA (+3.47%) continues its AI rally. Bitcoin holds above $67K despite ETF outflows. Overall sentiment is moderately bullish with a Fear & Greed index of 68 (Greed). Key risk: upcoming Fed minutes could shift rate expectations." },
  { q: 'What should I invest in?', a: "Based on current market conditions and moderate risk tolerance, I'd suggest:\n\n• **Tech Stocks (40%)**: NVDA, MSFT, GOOGL — strong AI tailwinds\n• **Crypto (15%)**: BTC, SOL — institutional adoption growing\n• **ETFs (25%)**: SPY, QQQ — broad market exposure\n• **Commodities (20%)**: GOLD — hedge against uncertainty\n\nAlways diversify and never invest more than you can afford to lose. Want me to run the AI simulator?" },
  { q: 'Explain my portfolio risk', a: "Your current portfolio has a **risk score of 58/100** (moderate). Here's the breakdown:\n\n• **Sharpe Ratio**: 1.84 — good risk-adjusted returns\n• **Max Drawdown**: -12.4% — acceptable for moderate risk\n• **Beta**: 0.87 — slightly less volatile than the market\n• **Concentration Risk**: SOL allocation at 28% is near your 30% limit\n\n**Recommendation**: Consider rebalancing SOL to reduce concentration risk. Your overall risk-return profile is healthy." },
  { q: 'What is Bitcoin halving?', a: "**Bitcoin Halving** is an event that occurs approximately every 4 years, where the reward for mining new blocks is cut in half.\n\n• **Purpose**: Controls Bitcoin's supply inflation\n• **Last Halving**: April 2024 (reward went from 6.25 to 3.125 BTC)\n• **Historical Impact**: Historically followed by significant price increases within 12-18 months\n• **Current Status**: We're 1 year post-halving, historically a bullish period\n\nThe halvings make Bitcoin increasingly scarce over time, which is a key part of its value proposition." },
  { q: 'Best crypto to buy now?', a: "Based on my analysis of fundamentals, technicals, and sentiment:\n\n1. **Bitcoin (BTC)** — Confidence: 92%\n   Institutional adoption, ETF inflows, post-halving momentum\n\n2. **Solana (SOL)** — Confidence: 88%\n   $12B DeFi TVL, fastest growing ecosystem, Visa partnership\n\n3. **Chainlink (LINK)** — Confidence: 82%\n   SWIFT integration, essential infrastructure\n\n4. **Ethereum (ETH)** — Confidence: 80%\n   Dencun upgrade benefits, L2 expansion\n\n⚠️ This is AI analysis, not financial advice. Always do your own research." },
];

const suggestions = [
  'How is the market doing today?',
  'What should I invest in?',
  'Explain my portfolio risk',
  'What is Bitcoin halving?',
  'Best crypto to buy now?',
];

export default function AIChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const match = canned.find((c) => c.q.toLowerCase() === text.toLowerCase());
    const response = match?.a || "That's a great question! Based on my analysis of current market data, your portfolio composition, and prevailing economic conditions, I'd recommend reviewing the Analytics page for detailed insights. You can also run the AI Agent pipeline from the Simulator for personalized recommendations.\n\nWould you like me to help with something more specific?";

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: response, time: 'Just now' }]);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>AI Chat Assistant</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Ask anything about markets, portfolios, and investing</p>
      </div>

      {/* Chat Area */}
      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex" style={{ gap: '12px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--color-accent-soft)' }}>
                  <Bot style={{ width: '16px', height: '16px', color: 'var(--color-accent)' }} />
                </div>
              )}
              <div style={{
                maxWidth: '70%', padding: '14px 18px', borderRadius: '16px',
                background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
              }}>
                <div className="text-sm" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </div>
                <p className="text-xs" style={{ opacity: 0.5, marginTop: '8px' }}>{msg.time}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex items-center justify-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)' }}>
                  <User style={{ width: '14px', height: '14px', color: '#fff' }} />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--color-accent-soft)' }}>
                <Bot style={{ width: '16px', height: '16px', color: 'var(--color-accent)' }} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '16px', background: 'var(--color-surface)' }}>
                <div className="flex items-center" style={{ gap: '4px' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      style={{ width: '6px', height: '6px', borderRadius: '999px', background: 'var(--color-text-dim)' }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ padding: '0 24px 12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} className="text-xs font-medium cursor-pointer"
                style={{ padding: '8px 14px', borderRadius: '999px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', transition: 'all 150ms' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '12px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about markets, portfolio, or strategies..."
            className="text-sm focus:outline-none" style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} disabled={isTyping} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={!input.trim() || isTyping}
            className="flex items-center justify-center cursor-pointer"
            style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-accent)', border: 'none', color: '#fff', opacity: input.trim() ? 1 : 0.4 }}>
            <Send style={{ width: '16px', height: '16px' }} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
