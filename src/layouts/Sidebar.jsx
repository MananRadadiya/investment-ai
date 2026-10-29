import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen, FlaskConical, Bot, BarChart3,
  Settings, ChevronLeft, ChevronRight,
  LogOut, Trophy, Sun, Moon,
} from 'lucide-react';

const navSections = [
  {
    label: 'Learn',
    items: [
      { path: '/dashboard', icon: BookOpen, label: 'Home' },
      { path: '/learn', icon: BookOpen, label: 'Learning Paths' },
      { path: '/glossary', icon: BookOpen, label: 'Glossary' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { path: '/simulator', icon: FlaskConical, label: 'SIP Calculator' },
      { path: '/goals', icon: FlaskConical, label: 'Goal Planner' },
      { path: '/portfolio', icon: FlaskConical, label: 'Virtual Portfolio' },
    ],
  },
  {
    label: 'AI Mentor',
    items: [
      { path: '/ai-chat', icon: Bot, label: 'Ask Guru' },
      { path: '/agents', icon: Bot, label: 'AI Insights' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { path: '/market', icon: BarChart3, label: 'Indian Markets' },
      { path: '/schemes', icon: BarChart3, label: 'Govt Schemes' },
      { path: '/mutual-funds', icon: BarChart3, label: 'Mutual Funds' },
      { path: '/news', icon: BarChart3, label: 'Market News' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { path: '/progress', icon: Trophy, label: 'My Journey' },
      { path: '/achievements', icon: Trophy, label: 'Achievements' },
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
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Brand Mark */}
      <div className="flex items-center gap-3 h-16" style={{ padding: '0 20px' }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-trust), var(--color-ai))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '18px', fontWeight: 700, color: '#fff',
          }}
        >
          ◇
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <span style={{
                fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}>
                Bharat InvestAI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 mt-2 overflow-y-auto overflow-x-hidden" style={{ padding: '0 8px', scrollbarWidth: 'none' }}>
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
        {navSections.map((section, sIdx) => (
          <div key={section.label} style={{ marginBottom: '16px' }}>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.06em', color: 'var(--text-tertiary)',
                    padding: '4px 12px', marginBottom: '4px',
                  }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            {!isOpen && sIdx > 0 && (
              <div style={{
                height: '1px', background: 'var(--border-subtle)',
                margin: '8px 12px 12px',
              }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className="no-underline"
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '12px',
                    height: '38px', borderRadius: 'var(--radius-sm)',
                    fontSize: '13px', fontWeight: isActive ? 500 : 400,
                    padding: isOpen ? '0 12px' : '0',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    background: isActive ? 'var(--surface-3)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 150ms',
                    textDecoration: 'none',
                  })}
                >
                  <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
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
      <div style={{ padding: '0 8px 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            height: 38, borderRadius: 'var(--radius-sm)',
            padding: isOpen ? '0 12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: 'none', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'var(--font-sans)',
            width: '100%',
          }}
        >
          {theme === 'dark'
            ? <Sun style={{ width: 16, height: 16, color: 'var(--color-learning)' }} />
            : <Moon style={{ width: 16, height: 16, color: 'var(--color-ai)' }} />
          }
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Settings */}
        <NavLink
          to="/settings"
          className="no-underline"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            height: 38, borderRadius: 'var(--radius-sm)',
            padding: isOpen ? '0 12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: isActive ? 'var(--surface-3)' : 'transparent',
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '13px', textDecoration: 'none',
          })}
        >
          <Settings style={{ width: 16, height: 16 }} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* User */}
        {user && isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-1)', marginTop: '4px',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-trust), var(--color-ai))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                {user.location}
              </p>
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            height: 38, borderRadius: 'var(--radius-sm)',
            padding: isOpen ? '0 12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: 'none', border: 'none',
            color: 'var(--color-danger)', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'var(--font-sans)',
            width: '100%',
          }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse */}
        <button
          onClick={onToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            height: 38, borderRadius: 'var(--radius-sm)',
            padding: isOpen ? '0 12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center',
            background: 'none', border: 'none',
            color: 'var(--text-tertiary)', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'var(--font-sans)',
            width: '100%',
          }}
        >
          {isOpen ? <ChevronLeft style={{ width: 15, height: 15 }} /> : <ChevronRight style={{ width: 15, height: 15 }} />}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
