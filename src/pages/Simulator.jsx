import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { runAgentPipeline } from '../agents';
import InvestmentForm from '../components/InvestmentForm';
import AgentActivityPanel from '../components/AgentActivityPanel';
import AIRecommendationPanel from '../components/AIRecommendationPanel';
import AllocationChart from '../components/AllocationChart';
import {
  FlaskConical, Cpu, Zap, Shield, TrendingUp,
  Sparkles, Activity, BrainCircuit, Atom
} from 'lucide-react';

/* ─── Animated Particle Field (Canvas) ─── */
function ParticleConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 140, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(79, 140, 255, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ─── Floating Orb ─── */
function FloatingOrb({ color, size, top, left, delay }) {
  return (
    <motion.div
      animate={{
        y: [0, -25, 10, 0],
        x: [0, 10, -10, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 8 + delay,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${parseInt(size) * 0.6}px)`,
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ─── Animated Stat Chip ─── */
function StatChip({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        flex: 1,
        minWidth: '160px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon style={{ width: '16px', height: '16px', color }} />
      </div>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', fontWeight: 500, letterSpacing: '0.03em' }}>
          {label}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Pipeline Step Indicator ─── */
function PipelineSteps({ isRunning, agentLogs }) {
  const steps = [
    { name: 'Market', icon: TrendingUp, color: '#4f8cff' },
    { name: 'Risk', icon: Shield, color: '#f59e0b' },
    { name: 'Strategy', icon: BrainCircuit, color: '#a78bfa' },
    { name: 'Execute', icon: Zap, color: '#22c55e' },
  ];

  const getStepStatus = (stepName) => {
    const agentName = `${stepName} Agent`;
    const hasStarted = agentLogs.some((l) => l.agent === agentName || l.text?.includes(stepName));
    const nextStep = steps[steps.findIndex((s) => s.name === stepName) + 1];
    const nextStarted = nextStep && agentLogs.some((l) => l.agent === `${nextStep.name} Agent` || l.text?.includes(nextStep.name));
    const allDone = agentLogs.some((l) => l.agent === 'done');

    if (allDone) return 'done';
    if (hasStarted && (nextStarted || (!nextStep && allDone))) return 'done';
    if (hasStarted) return 'active';
    return 'pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: '28px',
      }}
    >
      {steps.map((step, idx) => {
        const status = isRunning || agentLogs.length > 0 ? getStepStatus(step.name) : 'pending';
        const Icon = step.icon;

        return (
          <div key={step.name} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
              }}
            >
              <motion.div
                animate={
                  status === 'active'
                    ? { boxShadow: [`0 0 0 0 ${step.color}00`, `0 0 20px 4px ${step.color}30`, `0 0 0 0 ${step.color}00`] }
                    : {}
                }
                transition={status === 'active' ? { repeat: Infinity, duration: 1.5 } : {}}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    status === 'done' ? `${step.color}20` :
                    status === 'active' ? `${step.color}15` : 'rgba(255,255,255,0.03)',
                  border:
                    status === 'done' ? `1px solid ${step.color}40` :
                    status === 'active' ? `1px solid ${step.color}30` : '1px solid rgba(255,255,255,0.04)',
                  transition: 'all 300ms ease',
                }}
              >
                <Icon
                  style={{
                    width: '14px',
                    height: '14px',
                    color: status !== 'pending' ? step.color : 'var(--color-text-dim)',
                    transition: 'color 300ms ease',
                  }}
                />
              </motion.div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: status !== 'pending' ? step.color : 'var(--color-text-dim)',
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>
                  {status === 'done' ? '✓ Complete' : status === 'active' ? 'Processing...' : 'Waiting'}
                </div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: '0 0 auto',
                  width: '32px',
                  height: '2px',
                  margin: '0 4px',
                  borderRadius: '999px',
                  background: status === 'done' ? `${step.color}40` : 'rgba(255,255,255,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {status === 'active' && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '50%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                      borderRadius: '999px',
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Rotating Atom Logo ─── */
function AtomLogo() {
  return (
    <div style={{ position: 'relative', width: '56px', height: '56px' }}>
      {/* Core */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #4f8cff, #6366f1)',
          boxShadow: '0 0 24px 8px rgba(79,140,255,0.3)',
        }}
      />
      {/* Orbits */}
      {[0, 60, 120].map((rot, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.7,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(79,140,255,0.15)',
            borderRadius: '50%',
            transform: `rotateX(${60 + i * 10}deg) rotateZ(${rot}deg)`,
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: i === 0 ? '#4f8cff' : i === 1 ? '#a78bfa' : '#22c55e',
              boxShadow: `0 0 8px 2px ${i === 0 ? 'rgba(79,140,255,0.5)' : i === 1 ? 'rgba(167,139,250,0.5)' : 'rgba(34,197,94,0.5)'}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Simulation Counter ─── */
function SimulationCounter() {
  const [count, setCount] = useState(14329);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={count}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--color-accent)',
        fontWeight: 600,
        tabularNums: true,
      }}
    >
      {count.toLocaleString()} simulations run
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIMULATOR PAGE — Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function Simulator() {
  const assets = useMarketData();
  const { savePortfolio } = usePortfolio();
  const [agentResult, setAgentResult] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleRunSimulation = useCallback(async ({ amount, risk }) => {
    setIsRunning(true);
    setAgentLogs([]);
    setAgentResult(null);
    setShowResults(false);

    const result = await runAgentPipeline(amount, risk, (log) => {
      setAgentLogs((prev) => [...prev, log]);
    });

    setAgentResult(result);
    setIsRunning(false);
    // Stagger reveal of results
    setTimeout(() => setShowResults(true), 300);
  }, []);

  const handleSavePortfolio = useCallback(() => {
    if (!agentResult) return;
    const { execution } = agentResult;
    savePortfolio({
      totalInvestment: execution.totalInvestment,
      assets: execution.trades.map((t) => ({
        symbol: t.symbol,
        name: t.name,
        allocation: t.allocation,
        amount: t.amount,
        buyPrice: assets.find((a) => a.symbol === t.symbol)?.price || 0,
        color: t.color,
      })),
    });
  }, [agentResult, assets, savePortfolio]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* ─── Background Effects ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <ParticleConstellation />
        <FloatingOrb color="#4f8cff" size="300px" top="-5%" left="60%" delay={0} />
        <FloatingOrb color="#a78bfa" size="250px" top="40%" left="-10%" delay={2} />
        <FloatingOrb color="#22c55e" size="200px" top="70%" left="80%" delay={4} />
      </div>

      {/* ─── Content ─── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ Hero Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            padding: '40px 36px 36px',
            marginBottom: '32px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(79,140,255,0.06) 0%, rgba(99,102,241,0.04) 50%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(79,140,255,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Grid pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />

          {/* Shimmer line */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '30%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.4), transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ perspective: '200px' }}>
                <AtomLogo />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    AI Simulator
                  </h1>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#22c55e',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Live
                  </motion.div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--color-text-muted)',
                  maxWidth: '440px',
                  lineHeight: 1.5,
                }}>
                  Configure your parameters and unleash a multi-agent AI pipeline that analyzes markets,
                  evaluates risk, and optimizes your portfolio in real-time.
                </p>
              </div>
            </div>

            {/* Counter badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <Activity style={{ width: '14px', height: '14px', color: 'var(--color-accent)' }} />
                <SimulationCounter />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>
                Powered by 4 AI Agents
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══ Live Stats Row ═══ */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <StatChip icon={Cpu} label="AI Agents" value="4 Active" color="#4f8cff" delay={0.15} />
          <StatChip icon={Zap} label="Avg. Speed" value="< 2.1s" color="#f59e0b" delay={0.25} />
          <StatChip icon={Shield} label="Risk Models" value="3 Profiles" color="#a78bfa" delay={0.35} />
          <StatChip icon={Sparkles} label="Accuracy" value="94.7%" color="#22c55e" delay={0.45} />
        </div>

        {/* ═══ Pipeline Steps ═══ */}
        <PipelineSteps isRunning={isRunning} agentLogs={agentLogs} />

        {/* ═══ Main Grid: Form + Terminal ═══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '24px',
          }}
        >
          <InvestmentForm onSubmit={handleRunSimulation} isRunning={isRunning} />
          <AgentActivityPanel logs={agentLogs} isRunning={isRunning} />
        </div>

        {/* ═══ Results Section ═══ */}
        <AnimatePresence>
          {agentResult && showResults && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                margin: '48px 0 32px',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.2), transparent)' }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  background: 'rgba(79,140,255,0.08)',
                  border: '1px solid rgba(79,140,255,0.12)',
                }}>
                  <Sparkles style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f8cff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Simulation Results
                  </span>
                </div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(79,140,255,0.2), transparent)' }} />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                  gap: '24px',
                }}
              >
                <AIRecommendationPanel result={agentResult} onInvest={handleSavePortfolio} />
                <AllocationChart allocation={agentResult.strategy.allocation} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
