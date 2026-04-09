import { motion } from 'framer-motion';
import { Cpu, Shield, Crosshair, Zap, Check, Loader } from 'lucide-react';

const pipelineSteps = [
  { name: 'Market Agent', icon: Cpu, color: '#4f8cff', short: 'Analyze' },
  { name: 'Risk Agent', icon: Shield, color: '#f59e0b', short: 'Assess' },
  { name: 'Strategy Agent', icon: Crosshair, color: '#22c55e', short: 'Strategize' },
  { name: 'Execution Agent', icon: Zap, color: '#a78bfa', short: 'Execute' },
];

export default function PipelineVisualizer({ activeAgent, completedAgents = [], isRunning = false }) {
  const getStepStatus = (name) => {
    if (completedAgents.includes(name)) return 'completed';
    if (activeAgent === name) return 'active';
    return 'idle';
  };

  return (
    <div style={{ padding: '24px 20px', borderRadius: '16px', background: 'var(--color-surface)', marginBottom: '24px' }}>
      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '20px', textAlign: 'center' }}>
        Agent Pipeline
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative' }}>
        {pipelineSteps.map((step, i) => {
          const status = getStepStatus(step.name);
          const isActive = status === 'active';
          const isDone = status === 'completed';

          return (
            <div key={step.name} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Node */}
              <motion.div
                animate={isActive ? {
                  boxShadow: [`0 0 0 0 ${step.color}00`, `0 0 0 12px ${step.color}00`],
                } : {}}
                transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
                style={{ position: 'relative', cursor: 'default' }}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
                  style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '3px',
                    background: isDone ? `${step.color}20` : isActive ? `${step.color}18` : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${isDone ? step.color : isActive ? step.color : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 300ms ease',
                    position: 'relative',
                  }}
                >
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check style={{ width: '18px', height: '18px', color: step.color }} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    >
                      <Loader style={{ width: '18px', height: '18px', color: step.color }} />
                    </motion.div>
                  ) : (
                    <step.icon style={{ width: '18px', height: '18px', color: isDone ? step.color : 'var(--color-text-dim)' }} />
                  )}
                </motion.div>

                {/* Label */}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: 700,
                    color: isDone ? step.color : isActive ? step.color : 'var(--color-text-dim)',
                    transition: 'color 300ms',
                  }}>{step.short}</p>
                </div>

                {/* Active glow overlay */}
                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.15, 0.4, 0.15] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
                      borderRadius: '18px', border: `2px solid ${step.color}`,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </motion.div>

              {/* Connector */}
              {i < pipelineSteps.length - 1 && (
                <div style={{ width: '48px', height: '2px', position: 'relative', margin: '0 4px' }}>
                  <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '999px' }} />
                  {(isDone || (isActive && getStepStatus(pipelineSteps[i + 1].name) !== 'idle')) && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        background: `linear-gradient(90deg, ${step.color}, ${pipelineSteps[i + 1].color})`,
                        borderRadius: '999px',
                      }}
                    />
                  )}
                  {/* Data flow particles when active */}
                  {isActive && (
                    <motion.div
                      animate={{ left: ['-8px', '56px'] }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{
                        position: 'absolute', top: '-2px', width: '6px', height: '6px',
                        borderRadius: '999px', background: step.color,
                        boxShadow: `0 0 8px ${step.color}`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
