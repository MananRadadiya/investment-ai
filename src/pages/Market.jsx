import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../utils/format';
import { getSectorBreakdown } from '../data/marketData';
import {
  TrendingUp, TrendingDown, Search, Globe2, Layers, Filter,
  Zap, BarChart3, ArrowUpRight, ArrowDownRight, Flame,
  SlidersHorizontal, Grid3X3, List, Star, Sparkles, Activity,
  ChevronDown
} from 'lucide-react';

/* ─── Animated Data Stream Background ─── */
function DataStreamBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let streams = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Create vertical data streams
    for (let i = 0; i < 25; i++) {
      streams.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        speed: Math.random() * 0.8 + 0.2,
        length: Math.random() * 60 + 20,
        opacity: Math.random() * 0.06 + 0.01,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > h()) {
          s.y = -s.length;
          s.x = Math.random() * w();
        }

        const gradient = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.length);
        gradient.addColorStop(0, 'rgba(79, 140, 255, 0)');
        gradient.addColorStop(0.5, `rgba(79, 140, 255, ${s.opacity})`);
        gradient.addColorStop(1, 'rgba(79, 140, 255, 0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.length);
        ctx.stroke();
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
function PriceSparkline({ positive, width = 60, height = 24 }) {
  const points = useMemo(() => {
    const pts = [];
    let v = 50;
    for (let i = 0; i < 12; i++) {
      v += (Math.random() - (positive ? 0.4 : 0.6)) * 10;
      v = Math.max(10, Math.min(90, v));
      pts.push(v);
    }
    return pts;
  }, [positive]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const path = points.map((v, i) =>
    `${(i / (points.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(' ');

  const color = positive ? '#22c55e' : '#ef4444';

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

/* ─── Sector Badge ─── */
function SectorBadge({ name, count, avgChange, delay }) {
  const isPositive = avgChange >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
      style={{
        padding: '12px 16px', borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: 'default', flexShrink: 0, minWidth: '120px',
      }}
    >
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
        {name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{count} assets</span>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          color: isPositive ? '#22c55e' : '#ef4444',
        }}>
          {formatPercent(avgChange)}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Asset Row ─── */
function AssetRow({ asset, index, view }) {
  const isPositive = asset.changePercent >= 0;

  if (view === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        style={{
          padding: '24px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          cursor: 'default', position: 'relative', overflow: 'hidden',
          transition: 'box-shadow 200ms',
        }}
      >
        {/* Top glow */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: asset.color, filter: 'blur(30px)', opacity: 0.06,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `${asset.color}12`, color: asset.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, border: `1px solid ${asset.color}15`,
            }}>
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{asset.symbol}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '1px' }}>{asset.name}</div>
            </div>
          </div>
          <span style={{
            fontSize: '9px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
            background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-dim)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {asset.category}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <motion.div
              key={asset.price}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
            >
              {formatCurrency(asset.price)}
            </motion.div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px',
              fontSize: '12px', fontWeight: 600, color: isPositive ? '#22c55e' : '#ef4444',
            }}>
              {isPositive ? <ArrowUpRight style={{ width: '12px', height: '12px' }} /> : <ArrowDownRight style={{ width: '12px', height: '12px' }} />}
              {formatPercent(asset.changePercent)}
            </div>
          </div>
          <PriceSparkline positive={isPositive} />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Cap</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '2px' }}>{asset.marketCap}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Vol</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '2px' }}>{asset.volume}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.4 }}
      whileHover={{
        background: 'rgba(255,255,255,0.04)',
        x: 3,
        transition: { duration: 0.15 },
      }}
      style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
        gap: '16px', padding: '18px 24px', marginBottom: '4px',
        borderRadius: '14px', alignItems: 'center',
        cursor: 'default', transition: 'all 150ms',
        border: '1px solid transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: `${asset.color}10`, color: asset.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, border: `1px solid ${asset.color}12`,
          flexShrink: 0,
        }}>
          {asset.symbol.slice(0, 2)}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{asset.symbol}</span>
            <span style={{
              fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-dim)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {asset.category}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '2px' }}>{asset.name}</div>
        </div>
      </div>

      <motion.div key={asset.price} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
          {formatCurrency(asset.price)}
        </span>
      </motion.div>

      <div style={{ textAlign: 'right' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '12px', fontWeight: 600, color: isPositive ? '#22c55e' : '#ef4444',
          padding: '4px 10px', borderRadius: '8px',
          background: isPositive ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
        }}>
          {isPositive ? <ArrowUpRight style={{ width: '11px', height: '11px' }} /> : <ArrowDownRight style={{ width: '11px', height: '11px' }} />}
          {formatPercent(asset.changePercent)}
        </span>
      </div>

      <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
        {asset.marketCap}
      </div>

      <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
        {asset.volume}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PriceSparkline positive={isPositive} width={56} height={20} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MARKET PAGE — Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function Market() {
  const assets = useMarketData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [view, setView] = useState('list');

  const categories = ['all', 'stock', 'crypto', 'commodity', 'etf'];

  const sectors = useMemo(() => getSectorBreakdown(assets), [assets]);

  const filtered = useMemo(() => {
    let result = assets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
    }
    if (category !== 'all') {
      result = result.filter(a => a.category === category);
    }
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.symbol.localeCompare(b.symbol);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return b.changePercent - a.changePercent;
      return 0;
    });
    return result;
  }, [assets, search, category, sortBy]);

  const gainers = useMemo(() => assets.filter(a => a.changePercent > 0).length, [assets]);
  const losers = useMemo(() => assets.filter(a => a.changePercent < 0).length, [assets]);
  const avgChange = useMemo(() =>
    assets.length ? assets.reduce((s, a) => s + a.changePercent, 0) / assets.length : 0,
    [assets]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* ─── Background ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <DataStreamBackground />
        <FloatingOrb color="#4f8cff" size="280px" top="-5%" left="60%" delay={0} />
        <FloatingOrb color="#22c55e" size="220px" top="55%" left="-8%" delay={2} />
        <FloatingOrb color="#a78bfa" size="200px" top="70%" left="85%" delay={4} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ Hero Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', padding: '36px 36px 32px',
            marginBottom: '24px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(79,140,255,0.06) 0%, rgba(34,197,94,0.04) 50%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(79,140,255,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(79,140,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            pointerEvents: 'none',
          }} />

          {/* Shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '30%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.4), transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{
                  fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Market</h1>
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
                  Live
                </motion.div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: '440px' }}>
                Real-time market data across stocks, crypto, commodities & ETFs — updated every 3 seconds
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gainers</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e', marginTop: '4px' }}>{gainers}</div>
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Losers</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>{losers}</div>
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Avg</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: avgChange >= 0 ? '#22c55e' : '#ef4444', marginTop: '4px' }}>
                  {formatPercent(avgChange)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Sector Breakdown Strip ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'flex', gap: '8px', marginBottom: '24px',
            overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none',
          }}
        >
          {sectors.map((sector, i) => (
            <SectorBadge key={sector.name} {...sector} delay={0.35 + i * 0.04} />
          ))}
        </motion.div>

        {/* ═══ Toolbar ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px', gap: '12px', flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '0 0 260px' }}>
            <Search style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              width: '16px', height: '16px', color: 'var(--color-text-dim)',
            }} />
            <input
              id="market-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              style={{
                width: '100%', padding: '12px 16px 12px 40px',
                borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)', color: 'var(--color-text)',
                fontSize: '13px', outline: 'none', transition: 'all 200ms',
                backdropFilter: 'blur(20px)',
              }}
            />
          </div>

          {/* Category + Sort + View */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Category pills */}
            <div style={{
              display: 'flex', gap: '4px', padding: '4px',
              borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '7px 14px', borderRadius: '10px', border: 'none',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    textTransform: 'capitalize', transition: 'all 150ms',
                    background: category === c ? 'rgba(79,140,255,0.12)' : 'transparent',
                    color: category === c ? '#4f8cff' : 'var(--color-text-dim)',
                  }}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="change">24h Change</option>
            </select>

            {/* View toggle */}
            <div style={{
              display: 'flex', gap: '2px', padding: '4px',
              borderRadius: '10px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <button
                onClick={() => setView('list')}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', transition: 'all 150ms',
                  background: view === 'list' ? 'rgba(79,140,255,0.12)' : 'transparent',
                  color: view === 'list' ? '#4f8cff' : 'var(--color-text-dim)',
                }}
              >
                <List style={{ width: '14px', height: '14px' }} />
              </button>
              <button
                onClick={() => setView('grid')}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', transition: 'all 150ms',
                  background: view === 'grid' ? 'rgba(79,140,255,0.12)' : 'transparent',
                  color: view === 'grid' ? '#4f8cff' : 'var(--color-text-dim)',
                }}
              >
                <Grid3X3 style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══ Results Counter ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '16px', paddingLeft: '4px',
          }}
        >
          <Activity style={{ width: '12px', height: '12px', color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dim)' }}>
            {filtered.length} assets{search ? ` matching "${search}"` : ''}
          </span>
        </motion.div>

        {/* ═══ Table Header (List View) ═══ */}
        {view === 'list' && (
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
            gap: '16px', padding: '0 24px 12px',
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--color-text-dim)',
          }}>
            <span>Asset</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>24h Change</span>
            <span style={{ textAlign: 'right' }}>Market Cap</span>
            <span style={{ textAlign: 'right' }}>Volume</span>
            <span style={{ textAlign: 'right' }}>Trend</span>
          </div>
        )}

        {/* ═══ Asset List / Grid ═══ */}
        <div style={view === 'grid' ? {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        } : {}}>
          <AnimatePresence>
            {filtered.map((asset, idx) => (
              <AssetRow key={asset.symbol} asset={asset} index={idx} view={view} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '80px 40px',
              color: 'var(--color-text-dim)', fontSize: '14px',
            }}
          >
            <Search style={{ width: '32px', height: '32px', margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No assets found matching your search</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
