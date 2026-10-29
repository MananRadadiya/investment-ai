import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { learningPaths } from '../data/curriculumData';
import { formatINR } from '../utils/format';
import {
  ArrowRight, BookOpen, FlaskConical, Bot,
  Flame, Sparkles, Trophy, Target, ChevronRight,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    xp, level, levelProgress, streak,
    completedLessons, completedPaths,
  } = useProgress();

  // Determine current time greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Find next lesson to continue
  const nextLesson = useMemo(() => {
    for (const path of learningPaths) {
      for (const lesson of path.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return { lesson, path };
        }
      }
    }
    return null;
  }, [completedLessons]);

  // Progress stats
  const totalLessons = learningPaths.reduce((sum, p) => sum + p.lessons.length, 0);
  const completionPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── HERO GREETING ── */}
      <motion.div {...fadeInUp} style={{ marginBottom: 'var(--space-10)' }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>
          {greeting}, {user?.name?.split(' ')[0] || 'Learner'}
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          {streak > 0
            ? `Day ${streak} of your financial literacy journey 🔥`
            : 'Start your financial literacy journey today'
          }
        </p>
      </motion.div>

      {/* ── TODAY'S LESSON (Single focal point) ── */}
      {nextLesson && (
        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
          className="panel-interactive"
          onClick={() => navigate('/learn')}
          style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-learning)',
                marginBottom: 'var(--space-2)',
              }}>
                Continue Learning
              </p>
              <h2 className="heading-tight" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-1)' }}>
                {nextLesson.lesson.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {nextLesson.path.title} · {nextLesson.path.icon}
              </p>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-sm)',
              background: 'var(--color-trust-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowRight style={{ width: 18, height: 18, color: 'var(--color-trust)' }} />
            </div>
          </div>

          {/* Progress within path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.round(
                    (nextLesson.path.lessons.filter((l) => completedLessons.includes(l.id)).length /
                      nextLesson.path.lessons.length) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="mono-number" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {nextLesson.path.lessons.filter((l) => completedLessons.includes(l.id)).length}/{nextLesson.path.lessons.length} lessons
            </span>
          </div>
        </motion.div>
      )}

      {/* ── PROGRESS ROW ── */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)', marginBottom: 'var(--space-8)',
        }}
      >
        {/* Level & XP */}
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
            Your Level
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xl)' }}>{level.icon}</span>
            <div>
              <p className="heading-tight" style={{ fontSize: 'var(--text-md)' }}>{level.name}</p>
              <p className="mono-number" style={{ fontSize: '12px', color: 'var(--color-trust)' }}>
                {xp} XP
              </p>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${levelProgress.percent}%` }} />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-1)' }}>
            {levelProgress.current}/{levelProgress.max} XP to next level
          </p>
        </div>

        {/* Streak */}
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
            Learning Streak
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <Flame style={{ width: 20, height: 20, color: 'var(--color-learning)' }} />
            <span className="heading-tight mono-number" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-learning)' }}>
              {streak}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-2)' }}>
            {streak >= 7 ? 'Amazing consistency! Keep it up.' : streak > 0 ? 'Great start! Build the habit.' : 'Complete a lesson today to start.'}
          </p>
        </div>

        {/* Completion */}
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
            Lessons Completed
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span className="heading-tight mono-number" style={{ fontSize: 'var(--text-2xl)' }}>
              {completedLessons.length}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              / {totalLessons}
            </span>
          </div>
          <div className="progress-bar" style={{ marginTop: 'var(--space-2)' }}>
            <div className="progress-bar-fill" style={{ width: `${completionPercent}%`, background: 'var(--color-growth)' }} />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-1)' }}>
            {completionPercent}% complete
          </p>
        </div>
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.15 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <p style={{
          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: 'var(--text-tertiary)',
          marginBottom: 'var(--space-4)',
        }}>
          Quick Actions
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {[
            { icon: FlaskConical, label: 'SIP Calculator', desc: 'Plan your monthly investment', path: '/simulator', color: 'var(--color-learning)' },
            { icon: Bot, label: 'Ask AI Mentor', desc: 'Get answers to any question', path: '/ai-chat', color: 'var(--color-ai)' },
            { icon: Target, label: 'Goal Planner', desc: 'Plan for life milestones', path: '/goals', color: 'var(--color-growth)' },
          ].map((action) => (
            <div
              key={action.path}
              className="panel-interactive"
              onClick={() => navigate(action.path)}
              style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: `${action.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <action.icon style={{ width: 18, height: 18, color: action.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 1 }}>
                  {action.label}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── LEARNING PATHS PREVIEW ── */}
      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--text-tertiary)',
          }}>
            Learning Paths
          </p>
          <button
            onClick={() => navigate('/learn')}
            className="btn-ghost"
            style={{ height: 32, fontSize: '12px', padding: '0 12px' }}
          >
            View All <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--space-3)',
        }}>
          {learningPaths.slice(0, 4).map((path) => {
            const completed = path.lessons.filter((l) => completedLessons.includes(l.id)).length;
            const percent = Math.round((completed / path.lessons.length) * 100);
            const isComplete = completedPaths.includes(path.id);

            return (
              <div
                key={path.id}
                className="panel-interactive"
                onClick={() => navigate('/learn')}
                style={{ padding: 'var(--space-4)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-lg)' }}>{path.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 1 }}>
                      {path.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {path.lessonCount} lessons · {path.level}
                    </p>
                  </div>
                  {isComplete && (
                    <span style={{ marginLeft: 'auto', fontSize: '14px' }}>✅</span>
                  )}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%`, background: path.color }}
                  />
                </div>
                <p className="mono-number" style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-1)' }}>
                  {completed}/{path.lessons.length} complete
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
