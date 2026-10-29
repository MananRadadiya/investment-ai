import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { Flame, Sparkles } from 'lucide-react';

// Map paths to human-readable page titles
const pageTitles = {
  '/dashboard': 'Home',
  '/learn': 'Learning Paths',
  '/glossary': 'Glossary',
  '/simulator': 'SIP Calculator',
  '/goals': 'Goal Planner',
  '/portfolio': 'Virtual Portfolio',
  '/ai-chat': 'AI Mentor',
  '/agents': 'AI Insights',
  '/market': 'Indian Markets',
  '/schemes': 'Government Schemes',
  '/mutual-funds': 'Mutual Funds',
  '/news': 'Market News',
  '/progress': 'My Journey',
  '/achievements': 'Achievements',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export default function Navbar() {
  const location = useLocation();
  const { xp, level, streak } = useProgress();

  const currentTitle = pageTitles[location.pathname] || '';

  return (
    <header
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-8)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Page Title */}
      <div>
        <h1
          className="heading-tight"
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--text-primary)',
          }}
        >
          {currentTitle}
        </h1>
      </div>

      {/* Right: Streak + Level + XP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Streak */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'var(--color-learning-soft)',
            }}
          >
            <Flame style={{ width: 14, height: 14, color: 'var(--color-learning)' }} />
            <span style={{
              fontSize: '12px', fontWeight: 600,
              color: 'var(--color-learning)',
              fontFamily: 'var(--font-mono)',
            }}>
              {streak}
            </span>
          </motion.div>
        )}

        {/* Level Badge */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--color-ai-soft)',
          }}
        >
          <span style={{ fontSize: '13px' }}>{level.icon}</span>
          <span style={{
            fontSize: '12px', fontWeight: 500,
            color: 'var(--color-ai)',
          }}>
            {level.name}
          </span>
        </div>

        {/* XP */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--color-trust-muted)',
          }}
        >
          <Sparkles style={{ width: 13, height: 13, color: 'var(--color-trust)' }} />
          <span
            className="mono-number"
            style={{
              fontSize: '12px', fontWeight: 600,
              color: 'var(--color-trust)',
            }}
          >
            {xp} XP
          </span>
        </div>
      </div>
    </header>
  );
}
