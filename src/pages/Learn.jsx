import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, CheckCircle, Circle, Search, BookOpen } from 'lucide-react';
import { learningModules, learningCategories } from '../data/learnData';

const difficultyColors = {
  Beginner: '#22c55e',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

export default function Learn() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('ai-invest-learn-progress');
    return saved ? JSON.parse(saved) : learningModules.filter((m) => m.completed).map((m) => m.id);
  });
  const [expanded, setExpanded] = useState(null);

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      localStorage.setItem('ai-invest-learn-progress', JSON.stringify(next));
      return next;
    });
  };

  const filtered = learningModules.filter((m) => {
    const matchCat = category === 'All' || m.category === category;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const progress = Math.round((completed.length / learningModules.length) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Learning Center</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Master investing with AI-curated lessons</p>
        </div>
        <div className="relative">
          <Search className="absolute w-4 h-4" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lessons..."
            className="text-sm focus:outline-none" style={{ paddingLeft: '38px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text)', width: '220px' }} />
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <span className="text-sm font-semibold">Your Progress</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{progress}%</span>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', background: 'var(--color-surface-active)', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #4f8cff, #a78bfa)' }} />
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '8px' }}>
          {completed.length} of {learningModules.length} lessons completed
        </p>
      </motion.div>

      {/* Category Filters */}
      <div className="flex items-center flex-wrap" style={{ gap: '6px', marginBottom: '24px' }}>
        {learningCategories.map((c) => (
          <button key={c.name} onClick={() => setCategory(c.name)} className="text-xs font-semibold cursor-pointer"
            style={{ padding: '6px 14px', borderRadius: '999px', border: 'none', background: category === c.name ? c.color : 'var(--color-surface)', color: category === c.name ? '#fff' : 'var(--color-text-muted)', transition: 'all 150ms' }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Lesson Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filtered.map((module, idx) => {
          const isCompleted = completed.includes(module.id);
          const isExpanded = expanded === module.id;
          return (
            <motion.div key={module.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              className="panel" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setExpanded(isExpanded ? null : module.id)}>
              <div className="flex items-start" style={{ gap: '16px' }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-surface-active)', fontSize: '22px' }}>
                  {module.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center" style={{ gap: '8px', marginBottom: '6px' }}>
                    <span className="text-xs font-semibold" style={{ padding: '2px 8px', borderRadius: '6px', background: `${difficultyColors[module.difficulty]}15`, color: difficultyColors[module.difficulty] }}>
                      {module.difficulty}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{module.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold" style={{ marginBottom: '4px' }}>{module.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{module.summary}</p>

                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{module.content}</p>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between" style={{ marginTop: '16px' }}>
                    <div className="flex items-center" style={{ gap: '12px' }}>
                      <span className="flex items-center text-xs" style={{ gap: '4px', color: 'var(--color-text-dim)' }}>
                        <Clock style={{ width: '12px', height: '12px' }} /> {module.readTime}
                      </span>
                      <span className="flex items-center text-xs" style={{ gap: '4px', color: 'var(--color-text-dim)' }}>
                        <BookOpen style={{ width: '12px', height: '12px' }} /> Article
                      </span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleComplete(module.id); }}
                      className="flex items-center text-xs font-semibold cursor-pointer"
                      style={{ gap: '4px', padding: '4px 12px', borderRadius: '8px', border: 'none', background: isCompleted ? 'var(--color-green-soft)' : 'var(--color-surface-active)', color: isCompleted ? 'var(--color-green)' : 'var(--color-text-dim)', transition: 'all 150ms' }}>
                      {isCompleted ? <CheckCircle style={{ width: '12px', height: '12px' }} /> : <Circle style={{ width: '12px', height: '12px' }} />}
                      {isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
