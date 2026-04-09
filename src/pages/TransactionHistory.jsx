import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, Clock, Filter, Search,
  Download, Calendar, TrendingUp, TrendingDown, Receipt,
  Zap, BarChart3, DollarSign, Activity, CheckCircle2,
  XCircle, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { fakeTransactions } from '../data/userData';
import { formatCurrency, formatPercent } from '../utils/format';

/* ─── Animated Pulse Background ─── */
function PulseBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;
    let pulses = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Create concentric pulse rings
    for (let i = 0; i < 5; i++) {
      pulses.push({
        cx: w() * (0.3 + Math.random() * 0.4),
        cy: h() * (0.3 + Math.random() * 0.4),
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.008,
        maxRadius: 150 + Math.random() * 100,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      time += 0.01;

      pulses.forEach(p => {
        const radius = ((Math.sin(time * p.speed * 60 + p.phase) * 0.5 + 0.5) * p.maxRadius);
        const alpha = 0.02 * (1 - radius / p.maxRadius);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(79, 140, 255, ${Math.max(0, alpha)})`;
        ctx.lineWidth = 1;
        ctx.arc(p.cx, p.cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Horizontal scan lines
      for (let y = 0; y < h(); y += 4) {
        const alpha = Math.sin(y * 0.01 + time * 2) * 0.008 + 0.005;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(79, 140, 255, ${Math.max(0, alpha)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(w(), y);
        ctx.stroke();
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

/* ─── Summary Stat Card ─── */
function SummaryCard({ icon: Icon, label, value, color, trend, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        flex: 1, padding: '24px', borderRadius: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden', minWidth: '160px',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-15px', right: '-15px',
        width: '60px', height: '60px', borderRadius: '50%',
        background: color, filter: 'blur(30px)', opacity: 0.06,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '14px', position: 'relative',
      }}>
        <Icon style={{ width: '16px', height: '16px', color }} />
      </div>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: color || 'var(--color-text)', letterSpacing: '-0.02em', position: 'relative' }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-dim)', marginTop: '6px' }}>
          {trend}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Transaction Row ─── */
function TransactionRow({ tx, index }) {
  const isBuy = tx.type === 'buy';
  const statusColors = {
    completed: { bg: 'rgba(34,197,94,0.08)', color: '#22c55e', icon: CheckCircle2 },
    pending: { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', icon: AlertCircle },
    failed: { bg: 'rgba(239,68,68,0.08)', color: '#ef4444', icon: XCircle },
  };
  const status = statusColors[tx.status] || statusColors.completed;
  const StatusIcon = status.icon;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        background: 'rgba(255,255,255,0.04)',
        x: 4,
        transition: { duration: 0.15 },
      }}
      style={{
        display: 'grid', gridTemplateColumns: '2.2fr 0.8fr 1fr 1fr 1fr 0.8fr',
        gap: '16px', padding: '18px 24px', marginBottom: '4px',
        borderRadius: '14px', alignItems: 'center',
        cursor: 'default', transition: 'all 150ms',
      }}
    >
      {/* Asset Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: isBuy ? 5 : -5 }}
          style={{
            width: '42px', height: '42px', borderRadius: '14px',
            background: isBuy ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${isBuy ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isBuy
            ? <ArrowUpRight style={{ width: '18px', height: '18px', color: '#22c55e' }} />
            : <ArrowDownRight style={{ width: '18px', height: '18px', color: '#ef4444' }} />
          }
        </motion.div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{tx.symbol}</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginTop: '2px', display: 'block' }}>
            {tx.name}
          </span>
        </div>
      </div>

      {/* Type Badge */}
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 12px', borderRadius: '999px',
          background: isBuy ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${isBuy ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`,
          color: isBuy ? '#22c55e' : '#ef4444',
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {isBuy ? <ArrowUpRight style={{ width: '10px', height: '10px' }} /> : <ArrowDownRight style={{ width: '10px', height: '10px' }} />}
          {tx.type}
        </span>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
          {formatCurrency(tx.amount)}
        </div>
        {tx.fee > 0 && (
          <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
            Fee: {formatCurrency(tx.fee)}
          </div>
        )}
      </div>

      {/* Price & Qty */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {formatCurrency(tx.price)}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
          × {tx.quantity.toFixed(tx.quantity < 1 ? 4 : 2)}
        </div>
      </div>

      {/* Date */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
          <Clock style={{ width: '10px', height: '10px' }} />
          {formatDate(tx.date)}
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px', borderRadius: '8px',
          background: status.bg, color: status.color,
          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <StatusIcon style={{ width: '10px', height: '10px' }} />
          {tx.status}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Volume Chart Bar ─── */
function VolumeChart({ transactions }) {
  const dailyVolume = useMemo(() => {
    const byDay = {};
    transactions.forEach(tx => {
      const day = tx.date.split('T')[0];
      if (!byDay[day]) byDay[day] = { buy: 0, sell: 0 };
      byDay[day][tx.type] += tx.amount;
    });
    return Object.entries(byDay).slice(-10).map(([day, vol]) => ({
      day: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      buy: vol.buy,
      sell: vol.sell,
      total: vol.buy + vol.sell,
    }));
  }, [transactions]);

  const maxVol = Math.max(...dailyVolume.map(d => d.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      style={{
        padding: '24px', borderRadius: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        marginBottom: '24px',
      }}
    >
      <div style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--color-text-dim)',
        marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <BarChart3 style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
        Daily Volume (Last 10 days)
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {dailyVolume.map((d, i) => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1px', height: `${Math.max(4, (d.total / maxVol) * 70)}px` }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.buy / d.total) * 100}%` }}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.4 }}
                style={{
                  borderRadius: '4px 4px 0 0',
                  background: 'rgba(34,197,94,0.5)',
                }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.sell / d.total) * 100}%` }}
                transition={{ delay: 0.65 + i * 0.04, duration: 0.4 }}
                style={{
                  borderRadius: '0 0 4px 4px',
                  background: 'rgba(239,68,68,0.5)',
                }}
              />
            </div>
            <span style={{ fontSize: '8px', color: 'var(--color-text-dim)', fontWeight: 500 }}>
              {d.day.split(' ')[1]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--color-text-dim)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(34,197,94,0.6)' }} /> Buys
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--color-text-dim)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(239,68,68,0.6)' }} /> Sells
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRANSACTION HISTORY PAGE — Main Component
   ═══════════════════════════════════════════════════════════════════ */
export default function TransactionHistory() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filters = ['all', 'buy', 'sell'];

  const filtered = useMemo(() => {
    let result = fakeTransactions;
    if (filter !== 'all') result = result.filter(t => t.type === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [filter, search]);

  const totalBought = useMemo(() => fakeTransactions.filter(t => t.type === 'buy').reduce((s, t) => s + t.amount, 0), []);
  const totalSold = useMemo(() => fakeTransactions.filter(t => t.type === 'sell').reduce((s, t) => s + t.amount, 0), []);
  const totalFees = useMemo(() => fakeTransactions.reduce((s, t) => s + (t.fee || 0), 0), []);
  const avgTradeSize = useMemo(() => fakeTransactions.length ? fakeTransactions.reduce((s, t) => s + t.amount, 0) / fakeTransactions.length : 0, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', minHeight: '100vh' }}
    >
      {/* ─── Background ─── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <PulseBackground />
        <FloatingOrb color="#4f8cff" size="260px" top="-6%" left="55%" delay={0} />
        <FloatingOrb color="#f59e0b" size="200px" top="50%" left="-6%" delay={2} />
        <FloatingOrb color="#a78bfa" size="180px" top="75%" left="80%" delay={4} />
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
            background: 'linear-gradient(135deg, rgba(79,140,255,0.06) 0%, rgba(245,158,11,0.04) 50%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(79,140,255,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Grid */}
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
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '30%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(79,140,255,0.3), transparent)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{
                  fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Transactions</h1>
                <span style={{
                  padding: '3px 10px', borderRadius: '999px',
                  background: 'rgba(79,140,255,0.1)', border: '1px solid rgba(79,140,255,0.15)',
                  fontSize: '11px', fontWeight: 700, color: '#4f8cff',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {fakeTransactions.length} trades
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: '440px' }}>
                Your complete trade history — track every buy, sell, and fee across your entire portfolio
              </p>
            </div>

            {/* Net flow card */}
            <div style={{
              padding: '16px 20px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Net Flow
              </div>
              <div style={{
                fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em',
                color: totalBought - totalSold >= 0 ? '#22c55e' : '#ef4444',
              }}>
                {totalBought - totalSold >= 0 ? '+' : ''}{formatCurrency(totalBought - totalSold)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Summary Cards ═══ */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <SummaryCard
            icon={Receipt}
            label="Total Transactions"
            value={fakeTransactions.length}
            color="#4f8cff"
            trend={`Avg size: ${formatCurrency(avgTradeSize)}`}
            delay={0.2}
          />
          <SummaryCard
            icon={ArrowUpRight}
            label="Total Bought"
            value={formatCurrency(totalBought)}
            color="#22c55e"
            trend={`${fakeTransactions.filter(t => t.type === 'buy').length} buy orders`}
            delay={0.3}
          />
          <SummaryCard
            icon={ArrowDownRight}
            label="Total Sold"
            value={formatCurrency(totalSold)}
            color="#ef4444"
            trend={`${fakeTransactions.filter(t => t.type === 'sell').length} sell orders`}
            delay={0.4}
          />
          <SummaryCard
            icon={Zap}
            label="Total Fees"
            value={formatCurrency(totalFees)}
            color="#f59e0b"
            trend="Platform commission"
            delay={0.5}
          />
        </div>

        {/* ═══ Volume Chart ═══ */}
        <VolumeChart transactions={fakeTransactions} />

        {/* ═══ Toolbar ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px', gap: '12px', flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Filter pills */}
            <div style={{
              display: 'flex', gap: '4px', padding: '4px',
              borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '7px 14px', borderRadius: '10px', border: 'none',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    textTransform: 'capitalize', transition: 'all 150ms',
                    background: filter === f ? 'rgba(79,140,255,0.12)' : 'transparent',
                    color: filter === f ? '#4f8cff' : 'var(--color-text-dim)',
                  }}
                >
                  {f === 'buy' && <ArrowUpRight style={{ width: '11px', height: '11px' }} />}
                  {f === 'sell' && <ArrowDownRight style={{ width: '11px', height: '11px' }} />}
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              width: '14px', height: '14px', color: 'var(--color-text-dim)',
            }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              style={{
                padding: '10px 14px 10px 34px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text)', fontSize: '12px', outline: 'none',
                width: '220px', transition: 'all 200ms',
              }}
            />
          </div>
        </motion.div>

        {/* ═══ Table Header ═══ */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 0.8fr 1fr 1fr 1fr 0.8fr',
          gap: '16px', padding: '0 24px 12px',
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-text-dim)',
        }}>
          <span>Asset</span>
          <span>Type</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
          <span style={{ textAlign: 'right' }}>Price / Qty</span>
          <span style={{ textAlign: 'right' }}>Date</span>
          <span style={{ textAlign: 'right' }}>Status</span>
        </div>

        {/* ═══ Transaction Rows ═══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${search}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {paginated.map((tx, idx) => (
              <TransactionRow key={tx.id} tx={tx} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ═══ Pagination ═══ */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', marginTop: '28px', paddingBottom: '20px',
            }}
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: page === 1 ? 'var(--color-text-dim)' : 'var(--color-text)',
                cursor: page === 1 ? 'default' : 'pointer', transition: 'all 150ms',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: page === p ? 'rgba(79,140,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: page === p ? '1px solid rgba(79,140,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                  color: page === p ? '#4f8cff' : 'var(--color-text-dim)',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 150ms',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                color: page === totalPages ? 'var(--color-text-dim)' : 'var(--color-text)',
                cursor: page === totalPages ? 'default' : 'pointer', transition: 'all 150ms',
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </motion.div>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '80px 40px',
              color: 'var(--color-text-dim)', fontSize: '14px',
            }}
          >
            <Receipt style={{ width: '32px', height: '32px', margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No transactions found</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
