import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'ai-agent-history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function saveToHistory(result) {
  const history = loadHistory();
  history.unshift({
    id: Date.now(),
    timestamp: Date.now(),
    params: result.params || {},
    summary: {
      sentiment: result.market?.sentiment,
      riskScore: result.risk?.riskScore,
      diversification: result.strategy?.diversificationScore,
      trades: result.execution?.totalTrades,
      totalAllocated: result.execution?.totalAllocated,
      fillRate: result.execution?.fillRate,
      executionTime: result.execution?.executionTime,
    },
  });
  // Keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export default function AgentHistory() {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div style={{ padding: '32px', borderRadius: '16px', background: 'var(--color-surface)', textAlign: 'center' }}>
        <Clock style={{ width: '24px', height: '24px', color: 'var(--color-text-dim)', margin: '0 auto 12px', opacity: 0.4 }} />
        <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>No agent runs yet. Run the pipeline to build history.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          <Clock style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
          Run History ({history.length})
        </span>
        <button onClick={clearHistory} style={{
          display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
          border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-dim)',
          fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 150ms'
        }}>
          <Trash2 style={{ width: '10px', height: '10px' }} /> Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {history.map((run, i) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{ borderRadius: '14px', background: 'var(--color-surface)', overflow: 'hidden', border: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setExpanded(expanded === run.id ? null : run.id)}
                style={{
                  width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  color: 'var(--color-text)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '999px',
                    background: run.summary.sentiment === 'bullish' ? '#22c55e' : run.summary.sentiment === 'bearish' ? '#ef4444' : '#f59e0b',
                  }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>
                    {new Date(run.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>
                    {run.params.riskLevel} · ${(run.params.investmentAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Risk {run.summary.riskScore}/100
                  </span>
                  {expanded === run.id ? <ChevronUp style={{ width: '14px', height: '14px', color: 'var(--color-text-dim)' }} /> : <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--color-text-dim)' }} />}
                </div>
              </button>

              <AnimatePresence>
                {expanded === run.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {[
                        { label: 'Sentiment', value: run.summary.sentiment?.toUpperCase(), color: run.summary.sentiment === 'bullish' ? '#22c55e' : '#ef4444' },
                        { label: 'Risk Score', value: `${run.summary.riskScore}/100`, color: run.summary.riskScore > 70 ? '#ef4444' : '#f59e0b' },
                        { label: 'Diversity', value: `${run.summary.diversification}/100`, color: '#22c55e' },
                        { label: 'Trades', value: run.summary.trades, color: '#4f8cff' },
                        { label: 'Fill Rate', value: `${run.summary.fillRate}%`, color: '#a78bfa' },
                        { label: 'Exec Time', value: run.summary.executionTime, color: '#f59e0b' },
                      ].map((item) => (
                        <div key={item.label} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.value || '—'}</p>
                          <p style={{ fontSize: '9px', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
