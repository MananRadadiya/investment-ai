import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, PieChart, Bot, BarChart3,
  FlaskConical, Settings, ChevronLeft, ChevronRight,
  LogOut, User, Receipt, Sun, Moon, Newspaper,
  TrendingUp, GraduationCap, Gift, HelpCircle,
  Target, CalendarDays, MessageSquare, BellRing,
  CreditCard, Users, FileText, Key,
  Sparkles, Eye, AlertTriangle, Shield,
  Grid, Layers, GitBranch, CandlestickChart,
  ShoppingCart, History, Calculator, Scissors, DollarSign,
  BookOpen, Award, Download, Clock, Mic,
} from 'lucide-react';

const navSections = [
  {
    label: 'Main',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
      { path: '/market', icon: BarChart3, label: 'Market' },
      { path: '/transactions', icon: Receipt, label: 'Transactions' },
    ],
  },
  {
    label: 'AI Intelligence',
    items: [
      { path: '/portfolio-optimizer', icon: Sparkles, label: 'AI Optimizer' },
      { path: '/sentiment', icon: MessageSquare, label: 'Sentiment' },
      { path: '/pattern-recognition', icon: Eye, label: 'Patterns' },
      { path: '/risk-simulator', icon: AlertTriangle, label: 'Risk Simulator' },
      { path: '/smart-alerts', icon: BellRing, label: 'Smart Alerts' },
    ],
  },
  {
    label: 'Trading',
    items: [
      { path: '/paper-trading', icon: ShoppingCart, label: 'Paper Trading' },
      { path: '/backtester', icon: History, label: 'Backtester' },
      { path: '/dca-calculator', icon: Calculator, label: 'DCA Calculator' },
      { path: '/tax-harvesting', icon: Scissors, label: 'Tax Harvesting' },
      { path: '/dividends', icon: DollarSign, label: 'Dividends' },
    ],
  },
  {
    label: 'Visualizations',
    items: [
      { path: '/heatmap', icon: Grid, label: 'Heatmap' },
      { path: '/portfolio-xray', icon: Layers, label: 'Portfolio X-Ray' },
      { path: '/correlation-matrix', icon: GitBranch, label: 'Correlation' },
      { path: '/candlestick-chart', icon: CandlestickChart, label: 'Candlestick' },
      { path: '/earnings-calendar', icon: CalendarDays, label: 'Earnings' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { path: '/agents', icon: Bot, label: 'AI Agents' },
      { path: '/simulator', icon: FlaskConical, label: 'Simulator' },
      { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
      { path: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { path: '/tutorials', icon: GraduationCap, label: 'Tutorials' },
      { path: '/glossary', icon: BookOpen, label: 'Glossary' },
      { path: '/strategy-builder', icon: GitBranch, label: 'Strategy Builder' },
      { path: '/market-replay', icon: Clock, label: 'Market Replay' },
    ],
  },
  {
    label: 'Discover',
    items: [
      { path: '/news', icon: Newspaper, label: 'News' },
      { path: '/learn', icon: GraduationCap, label: 'Learn' },
      { path: '/copy-trading', icon: Users, label: 'Copy Trading' },
      { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/export-import', icon: Download, label: 'Export / Import' },
      { path: '/performance-score', icon: Award, label: 'Score' },
      { path: '/collaboration', icon: Users, label: 'Collaborate' },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/profile', icon: User, label: 'Profile' },
      { path: '/alerts', icon: BellRing, label: 'Alerts' },
      { path: '/goals', icon: Target, label: 'Goals' },
      { path: '/referrals', icon: Gift, label: 'Referrals' },
      { path: '/billing', icon: CreditCard, label: 'Billing' },
      { path: '/settings', icon: Settings, label: 'Settings' },
      { path: '/help', icon: HelpCircle, label: 'Help' },
    ],
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
      style={{ background: 'transparent' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-20">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-accent)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 6V10L8 14L2 10V6L8 2Z" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="text-base font-semibold tracking-tight whitespace-nowrap overflow-hidden"
            >
              AI Invest
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
        {navSections.map((section, sIdx) => (
          <div key={section.label} style={{ marginBottom: '16px' }}>
            {/* Section Label */}
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold uppercase"
                  style={{
                    color: 'var(--color-text-dim)',
                    letterSpacing: '0.08em',
                    padding: '4px 12px',
                    marginBottom: '4px',
                    fontSize: '10px',
                  }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            {!isOpen && sIdx > 0 && (
              <div style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '8px 12px 12px',
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-10 rounded-xl text-sm font-medium
                    transition-all duration-150 no-underline relative
                    ${isOpen ? 'px-3' : 'px-0 justify-center'}
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-400'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  })}
                >
                  <item.icon style={{ width: '17px', height: '17px', flexShrink: 0 }} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden text-[13px]"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="px-3 pb-4" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center h-10 rounded-xl text-sm font-medium
            transition-all duration-150 cursor-pointer no-underline
            ${isOpen ? 'px-3 gap-3 w-full' : 'w-full justify-center'}`}
          style={{
            background: 'var(--color-surface)', border: 'none',
            color: 'var(--color-text-muted)',
          }}
          id="sidebar-theme-toggle"
        >
          {theme === 'dark'
            ? <Sun style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
            : <Moon style={{ width: '16px', height: '16px', color: '#6366f1' }} />
          }
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px]"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User card */}
        {user && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
            style={{
              gap: '10px', padding: '8px 10px', borderRadius: '12px',
              background: 'var(--color-surface)',
            }}
          >
            <div className="flex items-center justify-center flex-shrink-0"
              style={{
                width: '30px', height: '30px', borderRadius: '999px',
                background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
                fontSize: '11px', fontWeight: 700, color: 'white',
              }}>
              {user.name?.charAt(0) || 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="text-xs font-semibold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '10px' }}>
                {user.plan || 'Pro'} Plan
              </p>
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center h-10 rounded-xl text-sm font-medium
            transition-all duration-150 cursor-pointer no-underline
            ${isOpen ? 'px-3 gap-3 w-full' : 'w-full justify-center'}`}
          style={{
            background: 'none', border: 'none',
            color: 'var(--color-red)',
          }}
          id="sidebar-logout"
        >
          <LogOut style={{ width: '15px', height: '15px' }} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px]"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center h-10 rounded-xl
            transition-all duration-150 cursor-pointer
            ${isOpen ? 'px-3 gap-3 w-full' : 'w-full justify-center'}`}
          style={{
            background: 'none', border: 'none',
            color: 'var(--color-text-dim)',
          }}
          id="sidebar-toggle"
        >
          {isOpen ? <ChevronLeft style={{ width: '15px', height: '15px' }} /> : <ChevronRight style={{ width: '15px', height: '15px' }} />}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px]"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
