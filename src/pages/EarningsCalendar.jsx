import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { earningsCalendarData } from '../data/educationData';
import { Calendar, TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';

export default function EarningsCalendar() {
  const [view, setView] = useState('upcoming');

  const upcoming = useMemo(() => earningsCalendarData.filter(e => !e.actual).sort((a, b) => new Date(a.date) - new Date(b.date)), []);
  const reported = useMemo(() => earningsCalendarData.filter(e => e.actual).sort((a, b) => new Date(b.date) - new Date(a.date)), []);
  const displayed = view === 'upcoming' ? upcoming : reported;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earnings Calendar</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Track upcoming and past earnings reports</p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['upcoming', 'reported'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: view === v ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: view === v ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
            {v} ({v === 'upcoming' ? upcoming.length : reported.length})
          </button>
        ))}
      </div>

      {/* Earnings List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
        {displayed.map((e, idx) => {
          const surpriseColor = e.surprise ? (e.surprise.startsWith('+') ? '#22c55e' : '#ef4444') : '#4f8cff';
          return (
            <motion.div key={e.symbol + e.date} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 200ms' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>{e.symbol.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{e.symbol}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{e.name}</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)' }}>{e.marketCap}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Calendar style={{ width: '12px', height: '12px', color: 'var(--color-text-dim)' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-dim)' }}>{e.time}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Estimate</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#4f8cff' }}>{e.estimate}</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', background: e.actual ? `${surpriseColor}08` : 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Actual</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: e.actual ? surpriseColor : 'var(--color-text-dim)' }}>{e.actual || '—'}</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Surprise</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: e.surprise ? surpriseColor : 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {e.surprise ? (e.surprise.startsWith('+') ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : <TrendingDown style={{ width: '12px', height: '12px' }} />) : null}
                    {e.surprise || '—'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--color-text-dim)' }}>Previous: {e.previousEPS} ({e.previousSurprise})</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
