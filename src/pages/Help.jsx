import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, ChevronUp, Mail, MessageCircle, Keyboard, CheckCircle2 } from 'lucide-react';

const faqs = [
  { q: 'How do the AI agents work?', a: 'Our AI agents use machine learning algorithms to analyze market data, assess risk, build strategies, and simulate trade execution. The pipeline runs 4 agents sequentially: Market Agent scans trends, Risk Agent calculates volatility, Strategy Agent creates optimal allocation, and Execution Agent simulates trades.' },
  { q: 'Is this real trading?', a: 'No — AI Invest is a portfolio simulation platform. All trades, balances, and returns are simulated using real-time market data. No actual money is invested or at risk. It\'s designed to help you learn and practice investment strategies.' },
  { q: 'How accurate are the AI recommendations?', a: 'Our AI agents analyze real market data and apply proven financial models. While past performance doesn\'t guarantee future results, our strategy engine has historically aligned with market trends. The simulation is designed for educational purposes.' },
  { q: 'Can I change my risk tolerance?', a: 'Yes! You can adjust your risk level (Conservative, Moderate, Aggressive) in the Simulator page before running the AI pipeline. Each level uses different allocation strategies and risk parameters.' },
  { q: 'How does copy trading work?', a: 'Copy trading lets you follow top-performing traders on our platform. When they make a trade, a similar trade is simulated in your portfolio based on your allocated amount. You can start or stop copying at any time.' },
  { q: 'What data sources do you use?', a: 'We use simulated market data that closely mirrors real market conditions. Price updates occur every 3 seconds to demonstrate real-time portfolio tracking. In a production environment, this would connect to actual market data APIs.' },
  { q: 'How do I change the theme?', a: 'You can switch between Dark and Light mode in Settings > Appearance, or by clicking the Sun/Moon icon at the bottom of the sidebar. Your preference is saved automatically.' },
  { q: 'Can I export my portfolio data?', a: 'Currently, portfolio data is stored in your browser\'s local storage. Export functionality is planned for a future update. You can view all your transaction history on the Transactions page.' },
];

const shortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Open command palette' },
  { keys: ['Ctrl', 'D'], action: 'Go to Dashboard' },
  { keys: ['Ctrl', 'P'], action: 'Go to Portfolio' },
  { keys: ['Ctrl', 'M'], action: 'Go to Market' },
  { keys: ['Ctrl', 'S'], action: 'Go to Settings' },
  { keys: ['Ctrl', 'Shift', 'T'], action: 'Toggle theme' },
];

export default function Help() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const filteredFaqs = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 3000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Help & Support</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Find answers, get support, and learn shortcuts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        <div>
          {/* Search */}
          <div className="relative" style={{ marginBottom: '24px' }}>
            <Search className="absolute w-4 h-4" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search frequently asked questions..."
              className="text-sm focus:outline-none w-full" style={{ paddingLeft: '42px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', background: 'var(--color-input-bg)', borderRadius: '14px', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>

          {/* FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredFaqs.map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="panel" style={{ padding: '20px 24px', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === idx ? null : idx)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold" style={{ flex: 1 }}>{faq.q}</h3>
                  {expanded === idx ? <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--color-text-dim)', flexShrink: 0 }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--color-text-dim)', flexShrink: 0 }} />}
                </div>
                {expanded === idx && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          {/* System Status */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <span className="section-label">System Status</span>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['API Gateway', 'Market Data Feed', 'AI Agent Pipeline', 'Authentication', 'Database'].map((service) => (
                <div key={service} className="flex items-center justify-between" style={{ padding: '6px 0' }}>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{service}</span>
                  <span className="flex items-center text-xs font-semibold" style={{ gap: '4px', color: 'var(--color-green)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '999px', background: 'var(--color-green)' }} /> Operational
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Keyboard Shortcuts */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
              <Keyboard style={{ width: '16px', height: '16px', color: 'var(--color-accent)' }} />
              <span className="section-label" style={{ margin: 0 }}>Keyboard Shortcuts</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {shortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between" style={{ padding: '4px 0' }}>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.action}</span>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    {s.keys.map((k) => (
                      <span key={k} className="text-xs font-mono" style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--color-surface-active)', color: 'var(--color-text-dim)', fontSize: '10px' }}>{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="panel" style={{ padding: '24px' }}>
            <span className="section-label">Contact Support</span>
            <form onSubmit={handleContactSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" required className="text-sm focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
              <input value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email address" type="email" required className="text-sm focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
              <textarea value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} placeholder="Describe your issue..." rows={3} required className="text-sm focus:outline-none" style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', resize: 'none' }} />
              <button type="submit" className="text-xs font-semibold cursor-pointer" style={{ padding: '10px', borderRadius: '10px', background: contactSent ? 'var(--color-green)' : 'var(--color-accent)', border: 'none', color: '#fff' }}>
                {contactSent ? '✓ Message Sent!' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
