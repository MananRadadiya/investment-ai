import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react';
import { financialGoals } from '../data/userData';
import { formatCurrency } from '../utils/format';

export default function Goals() {
  const [goals, setGoals] = useState(financialGoals);
  const [showAdd, setShowAdd] = useState(false);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Financial Goals</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Track your investment milestones</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAdd(!showAdd)}
          className="flex items-center text-xs font-semibold cursor-pointer"
          style={{ gap: '6px', padding: '10px 18px', borderRadius: '12px', background: 'var(--color-accent)', color: '#fff', border: 'none' }}>
          <Plus style={{ width: '14px', height: '14px' }} /> Add Goal
        </motion.button>
      </div>

      {/* Overview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
          <span className="section-label">Overall Progress</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{Math.round((totalCurrent / totalTarget) * 100)}%</span>
        </div>
        <div style={{ height: '12px', borderRadius: '999px', background: 'var(--color-surface-active)', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${(totalCurrent / totalTarget) * 100}%` }} transition={{ duration: 1.2 }}
            style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #4f8cff, #22c55e, #a78bfa)' }} />
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: '12px' }}>
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{formatCurrency(totalCurrent)} saved</span>
          <span className="text-sm" style={{ color: 'var(--color-text-dim)' }}>of {formatCurrency(totalTarget)} total</span>
        </div>
      </motion.div>

      {/* Goal Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {goals.map((goal, idx) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          const deadline = new Date(goal.deadline);
          const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 86400000));
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="panel" style={{ padding: '28px' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                <div className="flex items-center" style={{ gap: '14px' }}>
                  <div className="flex items-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${goal.color}15`, fontSize: '22px' }}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{goal.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>
                      <Calendar style={{ width: '10px', height: '10px', display: 'inline', verticalAlign: 'middle' }} /> {daysLeft > 365 ? `${Math.round(daysLeft / 365)} years left` : `${daysLeft} days left`}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold" style={{ color: goal.color }}>{pct}%</span>
              </div>

              <div style={{ height: '8px', borderRadius: '999px', background: 'var(--color-surface-active)', overflow: 'hidden', marginBottom: '16px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }}
                  style={{ height: '100%', borderRadius: '999px', background: goal.color }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{formatCurrency(goal.current)}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-dim)' }}>of {formatCurrency(goal.target)}</span>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <div className="flex items-center" style={{ gap: '6px' }}>
                  <TrendingUp style={{ width: '12px', height: '12px', color: 'var(--color-green)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                    Need {formatCurrency(Math.round((goal.target - goal.current) / Math.max(1, Math.ceil(daysLeft / 30))))}/mo to reach goal
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
