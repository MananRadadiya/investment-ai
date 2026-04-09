import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Bell, Shield, Database, Check, Sun, Moon } from 'lucide-react';
import { defaultSettings } from '../data/userData';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ai-invest-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai-invest-settings', JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
      setSettings((prev) => ({ ...prev, darkMode: theme === 'light' }));
    } else {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    }
    flashSaved();
  };

  const updateText = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    flashSaved();
  };

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // Keep darkMode setting in sync with theme context
  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode: theme === 'dark' }));
  }, [theme]);

  const settingGroups = [
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme, colors, and display preferences',
      color: '#4f8cff',
      items: [
        { label: 'Dark Mode', key: 'darkMode', type: 'toggle', description: theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme' },
        { label: 'Compact Layout', key: 'compactLayout', type: 'toggle' },
        { label: 'Animations', key: 'animations', type: 'toggle' },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Alert preferences and push notifications',
      color: '#f59e0b',
      items: [
        { label: 'Price Alerts', key: 'priceAlerts', type: 'toggle' },
        { label: 'Agent Completion', key: 'agentCompletion', type: 'toggle' },
        { label: 'Portfolio Updates', key: 'portfolioUpdates', type: 'toggle' },
      ],
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Default risk parameters and safety limits',
      color: '#22c55e',
      items: [
        { label: 'Max Single Asset Allocation', key: 'maxAllocation', type: 'text' },
        { label: 'Stop Loss Threshold', key: 'stopLoss', type: 'text' },
        { label: 'Auto-rebalance', key: 'autoRebalance', type: 'toggle' },
      ],
    },
    {
      icon: Database,
      title: 'Data & Storage',
      description: 'Portfolio data and cache management',
      color: '#a78bfa',
      items: [
        { label: 'Auto-save Portfolio', key: 'autoSave', type: 'toggle' },
        { label: 'Cache Market Data', key: 'cacheData', type: 'toggle' },
      ],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '48px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Settings</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Configure your dashboard experience</p>
        </div>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-xs font-semibold"
            style={{ gap: '6px', color: '#22c55e' }}
          >
            <Check style={{ width: '14px', height: '14px' }} />
            Saved
          </motion.div>
        )}
      </div>

      {/* Theme Preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel"
        style={{ padding: '24px 32px', marginBottom: '20px', maxWidth: '720px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div className="flex items-center justify-center"
              style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #1a1d23, #2d3748)'
                  : 'linear-gradient(135deg, #e2e8f0, #ffffff)',
                border: '2px solid var(--color-accent)',
              }}>
              {theme === 'dark'
                ? <Moon style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
                : <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              }
            </div>
            <div>
              <h3 className="text-sm font-semibold">Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>
                {theme === 'dark' ? 'Optimized for low-light environments' : 'Clean and bright for daytime use'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className="flex items-center text-xs font-semibold cursor-pointer"
            style={{
              gap: '8px', padding: '10px 20px', borderRadius: '12px',
              background: 'var(--color-accent)', color: '#ffffff',
              border: 'none', transition: 'all 200ms',
            }}
          >
            {theme === 'dark' ? <Sun style={{ width: '14px', height: '14px' }} /> : <Moon style={{ width: '14px', height: '14px' }} />}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </motion.button>
        </div>
      </motion.div>

      <div style={{ maxWidth: '720px' }}>
        {settingGroups.map((group, gIdx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.06 }}
            className="panel"
            style={{ padding: '28px 32px', marginBottom: '20px' }}
          >
            <div className="flex items-center" style={{ gap: '16px', marginBottom: '24px' }}>
              <div className="flex items-center justify-center"
                style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${group.color}18` }}>
                <group.icon style={{ width: '18px', height: '18px', color: group.color }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>{group.description}</p>
              </div>
            </div>

            <div>
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between"
                  style={{
                    padding: '14px 12px', margin: '0 -12px', borderRadius: '12px',
                    transition: 'background 150ms',
                  }}>
                  <div>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                    {item.description && (
                      <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>{item.description}</p>
                    )}
                  </div>
                  {item.type === 'toggle' ? (
                    <button
                      onClick={() => toggle(item.key)}
                      className="relative cursor-pointer"
                      style={{
                        width: '44px', height: '24px', borderRadius: '999px',
                        background: (item.key === 'darkMode' ? theme === 'dark' : settings[item.key]) ? 'var(--color-accent)' : 'var(--color-surface-active)',
                        transition: 'background 200ms',
                        border: 'none', padding: 0, flexShrink: 0,
                      }}
                      id={`setting-${item.key}`}
                    >
                      <div style={{
                        position: 'absolute', top: '3px',
                        left: (item.key === 'darkMode' ? theme === 'dark' : settings[item.key]) ? '23px' : '3px',
                        width: '18px', height: '18px', borderRadius: '999px',
                        background: '#ffffff', transition: 'left 200ms',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  ) : (
                    <input
                      value={settings[item.key]}
                      onChange={(e) => updateText(item.key, e.target.value)}
                      className="text-sm font-medium text-right focus:outline-none"
                      style={{
                        width: '80px', padding: '6px 12px', borderRadius: '8px',
                        background: 'var(--color-input-bg)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums',
                      }}
                      id={`setting-${item.key}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Reset */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => {
            setSettings(defaultSettings);
            flashSaved();
          }}
          className="text-xs font-medium cursor-pointer"
          style={{
            padding: '10px 20px', borderRadius: '12px',
            background: 'var(--color-red-soft)', border: 'none',
            color: 'var(--color-red)', transition: 'all 150ms',
          }}
          id="settings-reset"
        >
          Reset to Defaults
        </motion.button>
      </div>
    </motion.div>
  );
}
