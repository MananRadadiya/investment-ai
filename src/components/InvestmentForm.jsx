import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, DollarSign, Shield, Clock, Rocket, Sparkles, ChevronRight, Gauge } from 'lucide-react';

/* ─── Animated Ring Gauge ─── */
function RiskGauge({ level }) {
  const levels = { conservative: 0.25, moderate: 0.55, aggressive: 0.85 };
  const colors = { conservative: '#22c55e', moderate: '#f59e0b', aggressive: '#ef4444' };
  const pct = levels[level] || 0.5;
  const color = colors[level] || '#f59e0b';
  const circumference = 2 * Math.PI * 36;
  const offset = circumference * (1 - pct);

  return (
    <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto' }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
        <motion.circle
          cx="44" cy="44" r="36"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.span
          key={level}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ fontSize: '18px', fontWeight: 800, color, lineHeight: 1 }}
        >
          {Math.round(pct * 100)}
        </motion.span>
        <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', marginTop: '2px', fontWeight: 600 }}>
          RISK
        </span>
      </div>
    </div>
  );
}

/* ─── Animated Amount Display ─── */
function AmountDisplay({ amount }) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <motion.div
      key={amount}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '32px',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center',
        lineHeight: 1,
      }}
    >
      {formatted}
    </motion.div>
  );
}

export default function InvestmentForm({ onSubmit, isRunning }) {
  const [amount, setAmount] = useState(50000);
  const [risk, setRisk] = useState('moderate');
  const [duration, setDuration] = useState('6m');
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, risk, duration });
  };

  const riskLevels = [
    { key: 'conservative', label: 'Conservative', icon: Shield, color: '#22c55e', desc: 'Stable returns' },
    { key: 'moderate', label: 'Moderate', icon: Gauge, color: '#f59e0b', desc: 'Balanced risk' },
    { key: 'aggressive', label: 'Aggressive', icon: Rocket, color: '#ef4444', desc: 'High growth' },
  ];

  const durations = [
    { key: '1m', label: '1M' },
    { key: '3m', label: '3M' },
    { key: '6m', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: '3y', label: '3Y' },
  ];

  const amountPresets = [
    { value: 10000, label: '$10K' },
    { value: 25000, label: '$25K' },
    { value: 50000, label: '$50K' },
    { value: 100000, label: '$100K' },
    { value: 250000, label: '$250K' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '36px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.3), transparent)',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(79,140,255,0.1)',
            border: '1px solid rgba(79,140,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#4f8cff' }} />
          </div>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}>
              Configure
            </span>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
              Simulation Parameters
            </div>
          </div>
        </div>
        <RiskGauge level={risk} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* ─── Investment Amount ─── */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}>
            <DollarSign style={{ width: '14px', height: '14px' }} /> Investment Amount
          </label>

          <AmountDisplay amount={amount} />

          {/* Slider */}
          <div style={{ margin: '20px 0 16px', position: 'relative' }}>
            <input
              type="range"
              min={1000}
              max={500000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                appearance: 'none',
                WebkitAppearance: 'none',
                borderRadius: '999px',
                background: `linear-gradient(to right, #4f8cff ${(amount / 500000) * 100}%, rgba(255,255,255,0.06) ${(amount / 500000) * 100}%)`,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Preset chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {amountPresets.map((p) => (
              <motion.button
                key={p.value}
                type="button"
                onClick={() => setAmount(p.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  flex: '1 1 0',
                  minWidth: '56px',
                  padding: '10px 0',
                  borderRadius: '12px',
                  border: amount === p.value ? '1px solid rgba(79,140,255,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  background: amount === p.value ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.03)',
                  color: amount === p.value ? '#4f8cff' : 'var(--color-text-dim)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ─── Risk Level ─── */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}>
            <Shield style={{ width: '14px', height: '14px' }} /> Risk Profile
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {riskLevels.map((r) => {
              const isSelected = risk === r.key;
              const Icon = r.icon;
              return (
                <motion.button
                  key={r.key}
                  type="button"
                  onClick={() => setRisk(r.key)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '16px',
                    border: isSelected ? `1px solid ${r.color}40` : '1px solid rgba(255,255,255,0.04)',
                    background: isSelected ? `${r.color}10` : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: isSelected ? `${r.color}18` : 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 200ms',
                  }}>
                    <Icon style={{
                      width: '15px',
                      height: '15px',
                      color: isSelected ? r.color : 'var(--color-text-dim)',
                      transition: 'color 200ms',
                    }} />
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isSelected ? r.color : 'var(--color-text-muted)',
                    transition: 'color 200ms',
                  }}>
                    {r.label}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'var(--color-text-dim)',
                    fontWeight: 500,
                  }}>
                    {r.desc}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ─── Duration ─── */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}>
            <Clock style={{ width: '14px', height: '14px' }} /> Investment Horizon
          </label>

          <div style={{
            display: 'flex',
            gap: '0',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '14px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            {durations.map((d) => {
              const isSelected = duration === d.key;
              return (
                <motion.button
                  key={d.key}
                  type="button"
                  onClick={() => setDuration(d.key)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '10px',
                    border: 'none',
                    background: isSelected ? 'rgba(79,140,255,0.15)' : 'transparent',
                    color: isSelected ? '#4f8cff' : 'var(--color-text-dim)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    position: 'relative',
                  }}
                >
                  {d.label}
                  {isSelected && (
                    <motion.div
                      layoutId="duration-indicator"
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '12px',
                        height: '2px',
                        borderRadius: '999px',
                        background: '#4f8cff',
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ─── Submit Button ─── */}
        <motion.button
          type="submit"
          disabled={isRunning}
          whileHover={{ scale: isRunning ? 1 : 1.015, y: isRunning ? 0 : -1 }}
          whileTap={{ scale: isRunning ? 1 : 0.98 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: '16px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: isRunning ? 'wait' : 'pointer',
            position: 'relative',
            overflow: 'hidden',
            background: isRunning
              ? 'rgba(255,255,255,0.04)'
              : 'linear-gradient(135deg, #4f8cff 0%, #6366f1 100%)',
            color: isRunning ? 'var(--color-text-dim)' : '#ffffff',
            boxShadow: isRunning ? 'none' : '0 8px 32px rgba(79,140,255,0.2)',
            transition: 'all 300ms ease',
          }}
        >
          {/* Shimmer effect on hover */}
          {!isRunning && (
            <motion.div
              animate={isHovering ? { x: ['120%', '-120%'] } : {}}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                transform: 'translateX(120%)',
              }}
            />
          )}

          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid var(--color-text-dim)',
                  borderTopColor: 'var(--color-accent)',
                  borderRadius: '50%',
                }}
              />
              <span>Agents Processing...</span>
            </>
          ) : (
            <>
              <Play style={{ width: '16px', height: '16px' }} />
              <span>Launch Simulation</span>
              <ChevronRight style={{
                width: '16px',
                height: '16px',
                opacity: 0.6,
              }} />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
