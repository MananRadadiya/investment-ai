import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useProgress } from '../context/ProgressContext';
import { Trophy } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { recentAchievement } = useProgress();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <motion.main
        animate={{ marginLeft: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar />

        <div className="page-content" style={{ flex: 1, paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
          <Outlet />
        </div>
      </motion.main>

      {/* Achievement Toast */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', bottom: 32, right: 32, zIndex: 100,
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: '12px 20px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--color-achievement-soft)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              background: 'var(--color-achievement-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>
              {recentAchievement.icon}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-achievement)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Achievement Unlocked
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {recentAchievement.name}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                +{recentAchievement.xpReward} XP
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
