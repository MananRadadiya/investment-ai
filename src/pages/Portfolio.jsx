import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { portfolioSnapshots } from '../data/userData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  TrendingUp, TrendingDown, Trash2, Wallet, PieChart as PieIcon,
  BarChart3, ArrowUpRight, ArrowDownRight, Layers, Shield,
  Sparkles, Eye, EyeOff, RefreshCw, ChevronRight
} from 'lucide-react';
import PerformanceChart from '../components/PerformanceChart';
import ChartDownloadButton from '../components/ChartDownloadButton';

/* ─── Animated Mesh Gradient Background ─── */
function MeshBackground() {
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
      time += 0.002;

      // Soft gradient mesh
      const points = [
        { x: 0.2, y: 0.3, color: [79, 140, 255] },
        { x: 0.8, y: 0.2, color: [167, 139, 250] },
        { x: 0.5, y: 0.7, color: [34, 197, 94] },
        { x: 0.1, y: 0.8, color: [245, 158, 11] },
      ];

      points.forEach((p, i) => {
        const cx = (p.x + Math.sin(time + i * 1.5) * 0.05) * w();
        const cy = (p.y + Math.cos(time * 0.8 + i * 2) * 0.05) * h();
        const r = Math.max(w(), h()) * 0.3;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(${p.color.join(',')}, 0.04)`);
        gradient.addColorStop(1, `rgba(${p.color.join(',')}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w(), h());
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
      animate={{ y: [0, -18, 6, 0], x: [0, 6, -6, 0], scale: [1, 1.06, 0.97, 1] }}
      transition={{ repeat: Infinity, duration: 10 + delay, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: '50%', background: color,
        filter: `blur(${parseInt(size) * 0.55}px)`,
        opacity: 0.1, pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ─── Animated Ring Chart ─── */
function AnimatedRingChart({ data }) {
  return (
    <div style={{ position: 'relative', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationBegin={300}
            animationDuration={1200}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color || '#4f8cff'} fillOpacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div style={{
                  background: 'rgba(15,20,28,0.95)', borderRadius: '12px',
                  padding: '12px 16px', backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#e6edf3' }}>{payload[0].payload.name}</p>
                  <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>{payload[0].value}% allocation</p>
                </div>
              ) : null
            }
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Assets
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
          {data.length}
        </div>
      </div>
    </div>
  );
}

/* ─── Holding Row ─── */
function HoldingRow({ asset, livePrice, index }) {
  const pnl = asset.buyPrice ? ((livePrice - asset.buyPrice) / asset.buyPrice) * 100 : 0;
  const currentAmount = asset.buyPrice ? (asset.amount / asset.buyPrice) * livePrice : asset.amount;
  const isPnlPositive = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        background: 'rgba(255,255,255,0.04)',
        x: 4,
        transition: { duration: 0.15 },
      }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px', margin: '0 -16px', borderRadius: '14px',
        cursor: 'default', transition: 'all 150ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: `${asset.color}12`, color: asset.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, position: 'relative',
            border: `1px solid ${asset.color}20`,
          }}
        >
          {asset.symbol.slice(0, 2)}
        </motion.div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              {asset.symbol}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-dim)',
            }}>
              {(asset.allocation * 100).toFixed(0)}%
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '2px', display: 'block' }}>
            {asset.name}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {/* Live price */}
        <motion.span
          key={livePrice}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}
        >
          @ {formatCurrency(livePrice)}
        </motion.span>

        {/* Amount */}
        <div style={{ textAlign: 'right', minWidth: '90px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(currentAmount)}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px',
            marginTop: '2px', fontSize: '12px', fontWeight: 600,
            color: isPnlPositive ? '#22c55e' : '#ef4444',
          }}>
            {isPnlPositive
              ? <ArrowUpRight style={{ width: '12px', height: '12px' }} />
              : <ArrowDownRight style={{ width: '12px', height: '12px' }} />
            }
            {formatPercent(pnl)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Stat Mini Card ─── */
function MiniStat({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1, padding: '20px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)', minWidth: '140px',
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '10px',
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '12px',
      }}>
        <Icon style={{ width: '14px', height: '14px', color }} />
      </div>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO PAGE — Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const { portfolio, clearPortfolio } = usePortfolio();
  const assets = useMarketData();
  const [showValues, setShowValues] = useState(true);

  /* ─── Empty State ─── */
  if (!portfolio) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: 'relative', minHeight: '70vh' }}
      >
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <MeshBackground />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px',
              background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Portfolio</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', marginBottom: '48px' }}>
              Track your AI-generated portfolio performance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '80px 48px', borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(79,140,255,0.04) 0%, rgba(167,139,250,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(24px)',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Grid pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `linear-gradient(rgba(79,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(79,140,255,0.15), rgba(167,139,250,0.15))',
                border: '1px solid rgba(79,140,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', position: 'relative',
              }}
            >
              <Wallet style={{ width: '24px', height: '24px', color: '#4f8cff' }} />
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '23px',
                border: '1px solid rgba(79,140,255,0.08)',
                animation: 'pulse-soft 3s ease-in-out infinite',
              }} />
            </motion.div>

            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', position: 'relative' }}>
              No portfolio yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', lineHeight: 1.5, maxWidth: '380px', margin: '0 auto', position: 'relative' }}>
              Run the AI simulator from the Dashboard to create your first portfolio and watch it come to life
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  /* ─── Calculations ─── */
  const currentValue = portfolio.assets.reduce((sum, a) => {
    const liveAsset = assets.find((m) => m.symbol === a.symbol);
    if (liveAsset && a.buyPrice) {
      return sum + (a.amount / a.buyPrice) * liveAsset.price;
    }
    return sum + a.amount;
  }, 0);

  const profitLoss = currentValue - portfolio.totalInvestment;
  const percentReturn = (profitLoss / portfolio.totalInvestment) * 100;
  const isPositive = profitLoss >= 0;

  const chartData = portfolio.assets.map((a) => ({
    name: a.symbol,
    value: +(a.allocation * 100).toFixed(1),
    color: a.color,
  }));

  // Top performer
  const topPerformer = useMemo(() => {
    let best = null;
    let bestPnl = -Infinity;
    portfolio.assets.forEach(a => {
      const live = assets.find(m => m.symbol === a.symbol);
      if (live && a.buyPrice) {
        const pnl = ((live.price - a.buyPrice) / a.buyPrice) * 100;
        if (pnl > bestPnl) { bestPnl = pnl; best = { ...a, pnl }; }
      }
    });
    return best;
  }, [portfolio.assets, assets]);

  // Biggest holding
  const biggestHolding = useMemo(() => {
    return [...portfolio.assets].sort((a, b) => b.allocation - a.allocation)[0];
  }, [portfolio.assets]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* ─── Background ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <MeshBackground />
        <FloatingOrb color="#4f8cff" size="250px" top="-5%" left="70%" delay={0} />
        <FloatingOrb color="#22c55e" size="200px" top="50%" left="-5%" delay={3} />
        <FloatingOrb color="#a78bfa" size="180px" top="80%" left="75%" delay={5} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}
        >
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px',
              background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Portfolio</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
              Track your AI-generated portfolio performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowValues(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {showValues ? <Eye style={{ width: '14px', height: '14px' }} /> : <EyeOff style={{ width: '14px', height: '14px' }} />}
              {showValues ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={clearPortfolio}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)',
                color: '#ef4444', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              <Trash2 style={{ width: '13px', height: '13px' }} /> Reset
            </button>
          </div>
        </motion.div>

        {/* ═══ Portfolio Hero ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '36px 40px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            marginBottom: '24px', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle animated border */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '30%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.3), transparent)',
            }}
          />

          <div style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--color-text-dim)',
            marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Wallet style={{ width: '14px', height: '14px', color: 'var(--color-accent)' }} />
            Current Value
          </div>

          <motion.h2
            key={showValues ? currentValue : 'hidden'}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em',
              lineHeight: 1, marginBottom: '16px',
            }}
          >
            {showValues ? formatCurrency(currentValue) : '••••••'}
          </motion.h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '999px',
              background: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: isPositive ? '#22c55e' : '#ef4444',
              fontSize: '13px', fontWeight: 600,
            }}>
              {isPositive ? <TrendingUp style={{ width: '14px', height: '14px' }} /> : <TrendingDown style={{ width: '14px', height: '14px' }} />}
              {formatPercent(percentReturn)}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {isPositive ? '+' : ''}{showValues ? formatCurrency(profitLoss) : '•••'} P&L
            </span>
            <span style={{ color: 'var(--color-text-dim)', fontSize: '10px' }}>•</span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
              Invested {showValues ? formatCurrency(portfolio.totalInvestment) : '•••'}
            </span>
          </div>
        </motion.div>

        {/* ═══ Mini Stats Row ═══ */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <MiniStat
            icon={Layers}
            label="Holdings"
            value={portfolio.assets.length}
            color="#4f8cff"
            delay={0.2}
          />
          <MiniStat
            icon={TrendingUp}
            label="Top Performer"
            value={topPerformer ? `${topPerformer.symbol} ${formatPercent(topPerformer.pnl)}` : '—'}
            color="#22c55e"
            delay={0.3}
          />
          <MiniStat
            icon={PieIcon}
            label="Largest Holding"
            value={biggestHolding ? `${biggestHolding.symbol} ${(biggestHolding.allocation * 100).toFixed(0)}%` : '—'}
            color="#a78bfa"
            delay={0.4}
          />
          <MiniStat
            icon={Shield}
            label="Risk Score"
            value="58/100"
            color="#f59e0b"
            delay={0.5}
          />
        </div>

        {/* ═══ Main Content Grid ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '24px', marginBottom: '28px',
        }}>
          {/* Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              padding: '28px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--color-text-dim)',
              marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieIcon style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
                Allocation
              </span>
              <ChartDownloadButton chartId="allocation-chart-container" filename="portfolio-allocation" />
            </div>
            <div id="allocation-chart-container">
              <AnimatedRingChart data={chartData} />
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
              {chartData.map(item => (
                <div key={item.name} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 10px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '3px',
                    background: item.color,
                  }} />
                  {item.name} · {item.value}%
                </div>
              ))}
            </div>
          </motion.div>

          {/* Holdings List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              padding: '28px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--color-text-dim)',
              marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
                Holdings
              </span>
              <span style={{
                fontSize: '10px', color: 'var(--color-accent)',
                fontWeight: 700, letterSpacing: '0.04em',
              }}>
                {portfolio.assets.length} ASSETS
              </span>
            </div>
            <div>
              {portfolio.assets.map((asset, idx) => {
                const live = assets.find((a) => a.symbol === asset.symbol);
                const currentPrice = live?.price || asset.buyPrice || 0;
                return (
                  <HoldingRow
                    key={asset.symbol}
                    asset={asset}
                    livePrice={currentPrice}
                    index={idx}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ═══ Performance Chart ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <PerformanceChart />
        </motion.div>
      </div>
    </motion.div>
  );
}
