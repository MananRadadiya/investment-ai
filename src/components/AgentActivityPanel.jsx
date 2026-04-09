import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Terminal, CircleDot, Cpu, CheckCircle2, Clock } from 'lucide-react';

/* ─── Matrix Rain Effect (lightweight) ─── */
function MatrixRain() {
  const chars = '01';
  const columns = 20;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: 0.03,
        pointerEvents: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        lineHeight: '14px',
      }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -200 }}
          animate={{ y: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 6,
            ease: 'linear',
            delay: Math.random() * 5,
          }}
          style={{
            position: 'absolute',
            left: `${(i / columns) * 100}%`,
            color: '#4f8cff',
            whiteSpace: 'pre',
          }}
        >
          {Array.from({ length: 20 })
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('\n')}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Agent Badge ─── */
function AgentBadge({ name }) {
  const agentColors = {
    'Market Agent': '#4f8cff',
    'Risk Agent': '#f59e0b',
    'Strategy Agent': '#a78bfa',
    'Execution Agent': '#22c55e',
  };
  const color = agentColors[name] || '#4f8cff';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '6px',
        background: `${color}15`,
        border: `1px solid ${color}25`,
        fontSize: '10px',
        fontWeight: 700,
        color,
        marginRight: '8px',
        letterSpacing: '0.02em',
      }}
    >
      <CircleDot style={{ width: '8px', height: '8px' }} />
      {name}
    </span>
  );
}

export default function AgentActivityPanel({ logs = [], isRunning = false }) {
  const scrollRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Elapsed timer when running
  useEffect(() => {
    if (!isRunning) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed((Date.now() - start) / 1000);
    }, 100);
    return () => clearInterval(timer);
  }, [isRunning]);

  const agentCount = new Set(logs.filter((l) => l.isHeader && l.agent && l.agent !== 'done').map((l) => l.agent)).size;
  const isDone = logs.some((l) => l.agent === 'done');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '0',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Matrix background – only while running */}
      {isRunning && <MatrixRain />}

      {/* Processing bar */}
      {isRunning && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #4f8cff, #a78bfa, #22c55e, #4f8cff)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(79,140,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Terminal style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>Agent Terminal</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
              {isRunning ? 'agents executing...' : isDone ? 'pipeline complete' : 'awaiting input'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Agent count */}
          {(isRunning || logs.length > 0) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              <Cpu style={{ width: '12px', height: '12px' }} />
              {agentCount}/4
            </div>
          )}

          {/* Timer */}
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(79,140,255,0.08)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#4f8cff',
                fontWeight: 600,
              }}
            >
              <Clock style={{ width: '12px', height: '12px' }} />
              {elapsed.toFixed(1)}s
            </motion.div>
          )}

          {/* Status */}
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="running"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}
                />
                <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live
                </span>
              </motion.div>
            ) : isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(79,140,255,0.1)',
                  border: '1px solid rgba(79,140,255,0.15)',
                }}
              >
                <CheckCircle2 style={{ width: '12px', height: '12px', color: '#4f8cff' }} />
                <span style={{ fontSize: '10px', color: '#4f8cff', fontWeight: 700 }}>Done</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11.5px',
          lineHeight: 1.9,
          minHeight: '320px',
          maxHeight: '400px',
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-dim)',
              gap: '16px',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Terminal style={{ width: '36px', height: '36px', opacity: 0.15 }} />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                Waiting for agent pipeline
              </p>
              <p style={{ fontSize: '11px', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>
                Configure parameters and hit Launch
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: log.isHeader && idx > 0 ? '16px' : '2px',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                {log.isHeader ? (
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    {log.agent && log.agent !== 'done' && <AgentBadge name={log.agent} />}
                    <span
                      style={{
                        color: log.agent === 'done' ? '#22c55e' : 'var(--color-accent)',
                        fontWeight: 600,
                        textShadow: `0 0 12px ${log.agent === 'done' ? 'rgba(34,197,94,0.3)' : 'rgba(79,140,255,0.25)'}`,
                      }}
                    >
                      {log.text}
                    </span>
                  </div>
                ) : (
                  <>
                    <span
                      style={{
                        color: 'var(--color-text-dim)',
                        marginRight: '12px',
                        fontSize: '10px',
                        userSelect: 'none',
                        minWidth: '64px',
                        flexShrink: 0,
                      }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{log.text}</span>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Blinking cursor */}
        {isRunning && (
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{
              padding: '4px 8px',
              color: 'var(--color-accent)',
              fontSize: '14px',
            }}
          >
            ▋
          </motion.div>
        )}
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: '10px',
          color: 'var(--color-text-dim)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>{logs.length} events</span>
        <span>pipeline v2.4.1</span>
      </div>
    </motion.div>
  );
}
