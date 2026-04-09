import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glossaryTerms } from '../data/educationData';
import { BookOpen, Search, Hash } from 'lucide-react';

const CATEGORY_COLORS = { trading: '#4f8cff', technical: '#f59e0b', portfolio: '#22c55e', stocks: '#a78bfa', crypto: '#ec4899', market: '#14b8a6', performance: '#6366f1', strategy: '#ef4444', tax: '#f97316' };

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const categories = useMemo(() => ['all', ...new Set(glossaryTerms.map(t => t.category))], []);

  const filtered = useMemo(() => {
    let result = glossaryTerms;
    if (filterCat !== 'all') result = result.filter(t => t.category === filterCat);
    if (search) result = result.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [search, filterCat]);

  const alphabet = useMemo(() => {
    const letters = {};
    filtered.forEach(t => { const l = t.term[0].toUpperCase(); if (!letters[l]) letters[l] = []; letters[l].push(t); });
    return Object.entries(letters).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a78bfa, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Investment Glossary</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>{glossaryTerms.length}+ financial terms explained</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ width: '14px', height: '14px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms..."
            style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: filterCat === c ? (CATEGORY_COLORS[c] || 'var(--color-accent)') + '15' : 'rgba(255,255,255,0.04)', color: filterCat === c ? (CATEGORY_COLORS[c] || 'var(--color-accent)') : 'var(--color-text-dim)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Terms */}
      {alphabet.map(([letter, terms]) => (
        <div key={letter} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Hash style={{ width: '12px', height: '12px', color: '#a78bfa' }} />
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#a78bfa' }}>{letter}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
            {terms.map((term, idx) => (
              <motion.div key={term.term} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                onClick={() => setExpanded(expanded === term.term ? null : term.term)}
                style={{ padding: '16px', borderRadius: '14px', background: expanded === term.term ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${expanded === term.term ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: 'all 200ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{term.term}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: `${CATEGORY_COLORS[term.category] || '#4f8cff'}15`, color: CATEGORY_COLORS[term.category] || '#4f8cff', textTransform: 'capitalize' }}>{term.category}</span>
                </div>
                <AnimatePresence>
                  {expanded === term.term && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: '10px', overflow: 'hidden' }}>
                      {term.definition}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-dim)' }}>
          <BookOpen style={{ width: '32px', height: '32px', margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No terms found matching "{search}"</p>
        </div>
      )}
    </motion.div>
  );
}
