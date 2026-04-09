import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export default function AgentActivityPanel({ logs = [], isRunning = false }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="panel relative overflow-hidden"
      style={{ padding: '32px' }}
    >
      {/* Processing bar */}
      {isRunning && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
        <span className="section-label flex items-center" style={{ gap: '10px' }}>
          <Terminal className="w-3.5 h-3.5" />
          Agent Activity
        </span>
        {isRunning && (
          <div className="flex items-center" style={{ gap: '8px' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse-soft" />
            <span className="text-xs text-[var(--color-accent)] font-medium">Processing</span>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="overflow-y-auto font-mono text-xs leading-loose"
        style={{ height: '280px', paddingRight: '8px' }}
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-dim)]">
            <Terminal className="w-7 h-7 opacity-20" style={{ marginBottom: '12px' }} />
            <p className="text-sm">Waiting for agent pipeline</p>
          </div>
        ) : (
          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{ padding: '6px 8px', borderRadius: '8px', marginTop: log.isHeader && idx > 0 ? '16px' : '2px' }}
                className={log.isHeader
                  ? 'text-[var(--color-accent)] font-semibold terminal-glow'
                  : 'text-[var(--color-text-muted)]'}
              >
                <span className="text-[var(--color-text-dim)] select-none" style={{ marginRight: '12px', fontSize: '10px' }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
                {log.text}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isRunning && (
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ padding: '6px 8px' }}
            className="text-[var(--color-accent)]"
          >
            ▋
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
