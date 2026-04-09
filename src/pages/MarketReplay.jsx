import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { replayDays } from '../data/educationData';
import { Play, Pause, SkipBack, FastForward, Clock, Target } from 'lucide-react';

function generateTickData(startPrice, change, ticks = 200) {
  const data = [];
  let price = startPrice;
  const endPrice = startPrice * (1 + change / 100);
  const step = (endPrice - startPrice) / ticks;
  for (let i = 0; i <= ticks; i++) {
    const noise = (Math.random() - 0.5) * startPrice * 0.01;
    price = startPrice + step * i + noise;
    data.push({ tick: i, price: +price.toFixed(2), time: `${Math.floor(i / (ticks / 6.5) * 60 + 9 * 60)}` });
  }
  return data;
}

export default function MarketReplay() {
  const [selectedDay, setSelectedDay] = useState(replayDays[0]);
  const [tickData, setTickData] = useState([]);
  const [currentTick, setCurrentTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [decision, setDecision] = useState(null);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTickData(generateTickData(selectedDay.startPrice, selectedDay.change));
    setCurrentTick(0);
    setIsPlaying(false);
    setDecision(null);
    setScore(null);
  }, [selectedDay]);

  useEffect(() => {
    if (isPlaying && currentTick < tickData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentTick(prev => {
          if (prev >= tickData.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 50 / speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, tickData.length, currentTick]);

  const makeDecision = (d) => {
    setDecision({ type: d, tick: currentTick, price: tickData[currentTick]?.price });
    setIsPlaying(true);
  };

  useEffect(() => {
    if (decision && currentTick === tickData.length - 1) {
      const finalPrice = tickData[tickData.length - 1]?.price || 0;
      const profit = decision.type === 'buy' ? finalPrice - decision.price : decision.price - finalPrice;
      setScore({ profit: +profit.toFixed(2), percent: +((profit / decision.price) * 100).toFixed(2), decision: decision.type });
    }
  }, [currentTick, decision, tickData]);

  const visibleData = tickData.slice(0, currentTick + 1);
  const currentPrice = visibleData[visibleData.length - 1]?.price || 0;
  const priceChange = currentPrice - (tickData[0]?.price || 0);
  const priceChangePercent = tickData[0]?.price ? (priceChange / tickData[0].price * 100) : 0;

  // SVG chart
  const chartW = 700, chartH = 200;
  const prices = visibleData.map(d => d.price);
  const minP = Math.min(...prices, ...tickData.map(d => d.price)) * 0.998;
  const maxP = Math.max(...prices, ...tickData.map(d => d.price)) * 1.002;
  const points = visibleData.map((d, i) => `${(i / tickData.length) * chartW},${chartH - ((d.price - minP) / (maxP - minP)) * chartH}`).join(' ');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Market Replay</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Replay historic market days and test your timing</p>
          </div>
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {replayDays.map(day => (
          <button key={day.id} onClick={() => setSelectedDay(day)}
            style={{ padding: '10px 16px', borderRadius: '12px', border: `1px solid ${selectedDay.id === day.id ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.05)'}`, background: selectedDay.id === day.id ? 'rgba(236,72,153,0.08)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', color: 'var(--color-text)', transition: 'all 200ms' }}>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{day.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>{day.date}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: day.change >= 0 ? '#22c55e' : '#ef4444', marginTop: '4px' }}>{day.change >= 0 ? '+' : ''}{day.change}%</div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedDay.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{selectedDay.description}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>${currentPrice.toLocaleString()}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: priceChange >= 0 ? '#22c55e' : '#ef4444' }}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="replayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={priceChange >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0.15" />
              <stop offset="100%" stopColor={priceChange >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {visibleData.length > 1 && (
            <>
              <polygon points={`0,${chartH} ${points} ${(currentTick / tickData.length) * chartW},${chartH}`} fill="url(#replayGrad)" />
              <polyline points={points} fill="none" stroke={priceChange >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" />
            </>
          )}
          {decision && (
            <circle cx={(decision.tick / tickData.length) * chartW} cy={chartH - ((decision.price - minP) / (maxP - minP)) * chartH} r="5" fill="#4f8cff" stroke="white" strokeWidth="2" />
          )}
        </svg>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button onClick={() => { setCurrentTick(0); setIsPlaying(false); setDecision(null); setScore(null); }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SkipBack style={{ width: '14px', height: '14px' }} />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)}
            style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ec4899, #6366f1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPlaying ? <Pause style={{ width: '16px', height: '16px' }} /> : <Play style={{ width: '16px', height: '16px' }} />}
          </button>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 5, 10].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', background: speed === s ? 'rgba(79,140,255,0.15)' : 'rgba(255,255,255,0.04)', color: speed === s ? '#4f8cff' : 'var(--color-text-dim)' }}>
                {s}x
              </button>
            ))}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginLeft: '12px' }}>{Math.round((currentTick / tickData.length) * 100)}%</span>
        </div>
      </motion.div>

      {/* Decision Buttons */}
      {!decision && !score && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => makeDecision('buy')}
            style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            📈 Buy Here
          </button>
          <button onClick={() => makeDecision('sell')}
            style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            📉 Short Here
          </button>
          <button onClick={() => { setCurrentTick(0); setIsPlaying(true); }}
            style={{ padding: '14px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            ⏭ Skip & Watch
          </button>
        </motion.div>
      )}

      {/* Score */}
      {score && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ padding: '32px', borderRadius: '20px', background: score.profit >= 0 ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${score.profit >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}`, textAlign: 'center', marginTop: '20px' }}>
          <Target style={{ width: '32px', height: '32px', color: score.profit >= 0 ? '#22c55e' : '#ef4444', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: score.profit >= 0 ? '#22c55e' : '#ef4444' }}>
            {score.profit >= 0 ? '🎉 Profit!' : '📉 Loss'}
          </h2>
          <div style={{ fontSize: '32px', fontWeight: 800, color: score.profit >= 0 ? '#22c55e' : '#ef4444', margin: '8px 0' }}>
            {score.profit >= 0 ? '+' : ''}{score.percent}%
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>You chose to {score.decision} at ${decision?.price?.toLocaleString()}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
