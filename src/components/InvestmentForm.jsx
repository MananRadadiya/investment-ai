import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, DollarSign, Shield, Clock } from 'lucide-react';

export default function InvestmentForm({ onSubmit, isRunning }) {
  const [amount, setAmount] = useState(50000);
  const [risk, setRisk] = useState('moderate');
  const [duration, setDuration] = useState('6m');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, risk, duration });
  };

  const riskLevels = ['conservative', 'moderate', 'aggressive'];
  const durations = ['1m', '3m', '6m', '1y', '3y'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="panel"
      style={{ padding: '32px' }}
    >
      <span className="section-label">AI Simulator</span>

      <form onSubmit={handleSubmit} style={{ marginTop: '28px' }}>
        {/* Amount */}
        <div style={{ marginBottom: '28px' }}>
          <label className="flex items-center text-xs text-[var(--color-text-muted)] font-medium"
            style={{ gap: '8px', marginBottom: '12px' }}>
            <DollarSign className="w-3.5 h-3.5" /> Investment Amount
          </label>
          <div className="relative">
            <span className="absolute text-[var(--color-text-dim)] text-sm"
              style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              step={1000}
              className="w-full text-sm font-medium text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-soft)]"
              style={{
                paddingLeft: '32px', paddingRight: '20px', paddingTop: '14px', paddingBottom: '14px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: 'none',
                transition: 'all 150ms'
              }}
            />
          </div>
          <div className="flex" style={{ gap: '8px', marginTop: '12px' }}>
            {[10000, 25000, 50000, 100000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(v)}
                className="flex-1 text-xs font-semibold cursor-pointer"
                style={{
                  padding: '10px 0',
                  borderRadius: '12px',
                  border: 'none',
                  transition: 'all 150ms',
                  background: amount === v ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.04)',
                  color: amount === v ? '#4f8cff' : '#484f58',
                }}
              >
                ${(v / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Risk */}
        <div style={{ marginBottom: '28px' }}>
          <label className="flex items-center text-xs text-[var(--color-text-muted)] font-medium"
            style={{ gap: '8px', marginBottom: '12px' }}>
            <Shield className="w-3.5 h-3.5" /> Risk Level
          </label>
          <div className="grid grid-cols-3" style={{ gap: '8px' }}>
            {riskLevels.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRisk(r)}
                className="text-xs font-semibold capitalize cursor-pointer"
                style={{
                  padding: '12px 0',
                  borderRadius: '12px',
                  border: 'none',
                  transition: 'all 150ms',
                  background: risk === r ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.04)',
                  color: risk === r ? '#4f8cff' : '#484f58',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: '28px' }}>
          <label className="flex items-center text-xs text-[var(--color-text-muted)] font-medium"
            style={{ gap: '8px', marginBottom: '12px' }}>
            <Clock className="w-3.5 h-3.5" /> Duration
          </label>
          <div className="flex" style={{ gap: '8px' }}>
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className="flex-1 text-xs font-semibold cursor-pointer"
                style={{
                  padding: '12px 0',
                  borderRadius: '12px',
                  border: 'none',
                  transition: 'all 150ms',
                  background: duration === d ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.04)',
                  color: duration === d ? '#4f8cff' : '#484f58',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isRunning}
          whileHover={{ scale: isRunning ? 1 : 1.01 }}
          whileTap={{ scale: isRunning ? 1 : 0.98 }}
          className="w-full text-sm font-semibold flex items-center justify-center cursor-pointer"
          style={{
            padding: '14px 0',
            borderRadius: '12px',
            border: 'none',
            gap: '10px',
            transition: 'all 200ms',
            background: isRunning ? 'rgba(255,255,255,0.06)' : '#4f8cff',
            color: isRunning ? '#484f58' : '#ffffff',
            cursor: isRunning ? 'wait' : 'pointer',
          }}
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-[var(--color-text-dim)] border-t-[var(--color-accent)] rounded-full"
              />
              Running agents...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
