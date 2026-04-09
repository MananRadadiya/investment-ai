import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/agents', label: 'AI Strategy' },
  { path: '/market', label: 'Market' },
  { path: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-strong border-b border-[var(--color-border)] rounded-none">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
            AI Invest
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 no-underline ${
                  isActive
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-[var(--color-accent-muted)] rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)]
              hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all cursor-pointer"
            id="notification-btn"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-purple-500
              flex items-center justify-center cursor-pointer"
            id="profile-btn"
          >
            <User className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
