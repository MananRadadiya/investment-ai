import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuth } from '../context/AuthContext';
import { runAgentPipeline } from '../agents';
import { formatCurrency, formatPercent } from '../utils/format';
import { portfolioSnapshots } from '../data/userData';
import {
  TrendingUp, TrendingDown, Wallet, Activity, BarChart3,
  Zap, Eye, ArrowUpRight, ArrowDownRight, Sparkles,
  BrainCircuit, Shield, Clock, Target, PieChart,
  LineChart, ChevronRight, Flame, Globe2
} from 'lucide-react';

import PerformanceChart from '../components/PerformanceChart';
import InvestmentForm from '../components/InvestmentForm';
import AgentActivityPanel from '../components/AgentActivityPanel';
import MarketMovers from '../components/MarketMovers';
import AIRecommendationPanel from '../components/AIRecommendationPanel';
import NotificationsPanel from '../components/NotificationsPanel';
import Watchlist from '../components/Watchlist';

/* ─── Animated Grid Background ─── */
function GridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      time += 0.003;

      // Flowing grid
      const gridSize = 40;
      for (let x = 0; x < w(); x += gridSize) {
        for (let y = 0; y < h(); y += gridSize) {
          const dist = Math.sqrt((x - w() / 2) ** 2 + (y - h() / 2) ** 2);
          const wave = Math.sin(dist * 0.008 - time * 3) * 0.5 + 0.5;
          const alpha = wave * 0.03;
          ctx.beginPath();
          ctx.fillStyle = `rgba(79, 140, 255, ${alpha})`;
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(time * 0.5 + i * 1.3) * 0.5 + 0.5) * w();
        const py = (Math.cos(time * 0.4 + i * 1.7) * 0.5 + 0.5) * h();
        const alpha = Math.sin(time + i) * 0.15 + 0.1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(79, 140, 255, ${Math.max(0, alpha)})`;
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

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
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ─── Floating Orb ─── */
function FloatingOrb({ color, size, top, left, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 8, 0], x: [0, 8, -8, 0], scale: [1, 1.08, 0.95, 1] }}
      transition={{ repeat: Infinity, duration: 9 + delay, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: '50%', background: color,
        filter: `blur(${parseInt(size) * 0.55}px)`,
        opacity: 0.1, pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ─── Mini Sparkline ─── */
function MiniSparkline({ data, color = '#4f8cff', height = 40, width = 120 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Stat Card with Glow ─── */
function GlowStatCard({ icon: Icon, label, value, subtext, color, delay, sparkData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        position: 'relative',
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        cursor: 'default',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: color, filter: 'blur(40px)', opacity: 0.08,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <Icon style={{ width: '18px', height: '18px', color }} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-dim)', letterSpacing: '0.04em', marginBottom: '6px' }}>
            {label}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            {value}
          </div>
          {subtext && (
            <div style={{ fontSize: '11px', fontWeight: 500, color, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {subtext}
            </div>
          )}
        </div>
        {sparkData && (
          <div style={{ opacity: 0.7, marginTop: '8px' }}>
            <MiniSparkline data={sparkData} color={color} height={36} width={80} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Live Market Pulse Strip ─── */
function MarketPulseStrip({ assets }) {
  const topAssets = useMemo(() => {
    return [...assets].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 8);
  }, [assets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      style={{
        display: 'flex', gap: '8px', padding: '12px 0',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}
    >
      {topAssets.map((asset, i) => {
        const isUp = asset.changePercent >= 0;
        return (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
              flexShrink: 0, cursor: 'default',
              transition: 'all 200ms',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: `${asset.color}15`, color: asset.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700,
            }}>
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
                {asset.symbol}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: isUp ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                {isUp ? <TrendingUp style={{ width: '10px', height: '10px' }} /> : <TrendingDown style={{ width: '10px', height: '10px' }} />}
                {formatPercent(asset.changePercent)}
              </div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(asset.price)}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ─── Greeting ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD PAGE — Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const assets = useMarketData();
  const { portfolio, savePortfolio } = usePortfolio();
  const { user } = useAuth();
  const [agentResult, setAgentResult] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const currentValue = portfolio
    ? portfolio.assets.reduce((sum, a) => {
        const liveAsset = assets.find((m) => m.symbol === a.symbol);
        if (liveAsset && a.buyPrice) {
          return sum + (a.amount / a.buyPrice) * liveAsset.price;
        }
        return sum + a.amount;
      }, 0)
    : 0;

  const totalInvestment = portfolio?.totalInvestment || 0;
  const profitLoss = currentValue - totalInvestment;
  const percentReturn = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
  const isPositive = profitLoss >= 0;

  // Sparkline data from snapshots
  const sparklineValues = useMemo(() => portfolioSnapshots.slice(-14).map(s => s.value), []);

  const handleRunSimulation = useCallback(async ({ amount, risk }) => {
    setIsRunning(true);
    setAgentLogs([]);
    const result = await runAgentPipeline(amount, risk, (log) => {
      setAgentLogs((prev) => [...prev, log]);
    });
    setAgentResult(result);
    setIsRunning(false);
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

  /* ─── Market Summary Calculations ─── */
  const marketSummary = useMemo(() => {
    if (!assets.length) return { gainers: 0, losers: 0, avgChange: 0, totalVolume: '—' };
    const gainers = assets.filter(a => a.changePercent > 0).length;
    const losers = assets.filter(a => a.changePercent < 0).length;
    const avgChange = assets.reduce((s, a) => s + a.changePercent, 0) / assets.length;
    return { gainers, losers, avgChange };
  }, [assets]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* ─── Background Effects ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <GridBackground />
        <FloatingOrb color="#4f8cff" size="280px" top="-8%" left="65%" delay={0} />
        <FloatingOrb color="#a78bfa" size="220px" top="45%" left="-8%" delay={2.5} />
        <FloatingOrb color="#22c55e" size="180px" top="75%" left="80%" delay={4} />
      </div>

      {/* ─── Content ─── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ Hero Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', padding: '36px 36px 32px',
            marginBottom: '28px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(79,140,255,0.06) 0%, rgba(99,102,241,0.04) 50%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(79,140,255,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            pointerEvents: 'none',
          }} />

          {/* Shimmer line */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '30%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.4), transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 500,
                  color: 'var(--color-text-dim)', letterSpacing: '0.02em',
                }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    padding: '2px 8px', borderRadius: '999px',
                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
                    fontSize: '9px', fontWeight: 700, color: '#22c55e',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}
                >
                  Market Open
                </motion.div>
              </div>
              <h1 style={{
                fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '6px',
              }}>
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Investor'}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: '480px' }}>
                Your AI-powered investment dashboard. Analyze markets, run simulations,
                and track portfolio performance in real-time.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <NotificationsPanel />
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,140,255,0.25)',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Portfolio Hero Card ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', padding: '32px 36px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            marginBottom: '24px', overflow: 'hidden',
          }}
        >
          {/* Subtle glow */}
          <div style={{
            position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
            width: '300px', height: '100px', borderRadius: '50%',
            background: isPositive ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
            filter: 'blur(50px)', pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--color-text-dim)',
                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Wallet style={{ width: '14px', height: '14px', color: 'var(--color-accent)' }} />
                Portfolio Value
              </div>
              <motion.div
                key={currentValue}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: '44px', fontWeight: 700, letterSpacing: '-0.03em',
                  color: 'var(--color-text)', lineHeight: 1,
                }}
              >
                {formatCurrency(currentValue || 0)}
              </motion.div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '999px',
                  background: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: isPositive ? '#22c55e' : '#ef4444',
                  fontSize: '13px', fontWeight: 600,
                }}>
                  {isPositive ? <TrendingUp style={{ width: '14px', height: '14px' }} /> : <TrendingDown style={{ width: '14px', height: '14px' }} />}
                  {formatPercent(percentReturn)}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  {isPositive ? '+' : ''}{formatCurrency(profitLoss)} P&L
                </span>
                <span style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>•</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
                  Invested {formatCurrency(totalInvestment)}
                </span>
              </div>
            </div>

            <div style={{ opacity: 0.8, marginLeft: '24px' }}>
              <MiniSparkline
                data={sparklineValues}
                color={isPositive ? '#22c55e' : '#ef4444'}
                height={56}
                width={160}
              />
            </div>
          </div>
        </motion.div>

        {/* ═══ Stats Grid ═══ */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <GlowStatCard
            icon={Target}
            label="Total Assets"
            value={portfolio ? portfolio.assets.length.toString() : '0'}
            subtext="Diversified"
            color="#4f8cff"
            delay={0.25}
            sparkData={sparklineValues.slice(-7)}
          />
          <GlowStatCard
            icon={Flame}
            label="Market Gainers"
            value={`${marketSummary.gainers}`}
            subtext={`${marketSummary.losers} losers`}
            color="#22c55e"
            delay={0.35}
          />
          <GlowStatCard
            icon={Activity}
            label="Market Avg."
            value={formatPercent(marketSummary.avgChange)}
            subtext="24h change"
            color={marketSummary.avgChange >= 0 ? '#22c55e' : '#ef4444'}
            delay={0.45}
          />
          <GlowStatCard
            icon={BrainCircuit}
            label="AI Agents"
            value="4 Active"
            subtext="Ready to analyze"
            color="#a78bfa"
            delay={0.55}
          />
        </div>

        {/* ═══ Market Pulse Strip ═══ */}
        <MarketPulseStrip assets={assets} />

        {/* ═══ Performance Chart ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: '28px' }}
        >
          <PerformanceChart />
        </motion.div>

        {/* ═══ Simulator + Agent Activity ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '24px', marginTop: '28px',
          }}
        >
          <InvestmentForm onSubmit={handleRunSimulation} isRunning={isRunning} />
          <AgentActivityPanel logs={agentLogs} isRunning={isRunning} />
        </motion.div>

        {/* ═══ Market Movers + Watchlist ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: '24px', marginTop: '28px',
          }}
        >
          <MarketMovers assets={assets} />
          <Watchlist />
        </motion.div>

        {/* ═══ AI Recommendation ═══ */}
        <AnimatePresence>
          {agentResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px', margin: '40px 0 28px',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.2), transparent)' }} />
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 20px', borderRadius: '999px',
                  background: 'rgba(79,140,255,0.08)',
                  border: '1px solid rgba(79,140,255,0.12)',
                }}>
                  <Sparkles style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f8cff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    AI Recommendation
                  </span>
                </div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(79,140,255,0.2), transparent)' }} />
              </div>

              <AIRecommendationPanel result={agentResult} onInvest={handleSavePortfolio} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
