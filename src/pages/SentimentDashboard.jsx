import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { sentimentData, wordCloudData, defaultWordCloud } from '../data/aiData';
import { TrendingUp, TrendingDown, MessageSquare, Minus, Filter, BarChart3 } from 'lucide-react';

function SentimentGauge({ value, size = 100 }) {
  const color = value >= 70 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const label = value >= 70 ? 'Bullish' : value >= 50 ? 'Neutral' : 'Bearish';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</span>
        <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

function WordCloud({ words }) {
  const sizes = useMemo(() => {
    const max = Math.max(...words.map(w => w.weight));
    return words.map(w => ({ ...w, fontSize: 10 + (w.weight / max) * 22 }));
  }, [words]);

  const colors = ['#4f8cff', '#22c55e', '#a78bfa', '#f59e0b', '#14b8a6', '#ef4444', '#ec4899', '#6366f1'];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '16px' }}>
      {sizes.map((w, i) => (
        <motion.span key={w.text} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
          style={{ fontSize: `${w.fontSize}px`, fontWeight: w.weight > 70 ? 700 : 500, color: colors[i % colors.length], opacity: 0.5 + (w.weight / 200), cursor: 'default', transition: 'transform 200ms', padding: '2px 4px' }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.15)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
        >
          {w.text}
        </motion.span>
      ))}
    </div>
  );
}

export default function SentimentDashboard() {
  const assets = useMarketData();
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [filter, setFilter] = useState('all');

  const sentiment = sentimentData[selectedAsset] || { overall: 50, label: 'Unknown', social: 50, news: 50, technical: 50, trend: Array(12).fill(50) };
  const words = wordCloudData[selectedAsset] || defaultWordCloud;

  const filteredAssets = useMemo(() => {
    const assetsWithSentiment = assets.filter(a => sentimentData[a.symbol]).map(a => ({ ...a, sentiment: sentimentData[a.symbol] }));
    if (filter === 'bullish') return assetsWithSentiment.filter(a => a.sentiment.overall >= 65);
    if (filter === 'bearish') return assetsWithSentiment.filter(a => a.sentiment.overall < 45);
    return assetsWithSentiment;
  }, [assets, filter]);

  const overallMarket = useMemo(() => {
    const vals = Object.values(sentimentData);
    return Math.round(vals.reduce((s, v) => s + v.overall, 0) / vals.length);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #4f8cff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sentiment Analysis</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>AI-powered social media & news sentiment scores per asset</p>
          </div>
        </div>
      </div>

      {/* Market Mood */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Market Mood', value: overallMarket, icon: BarChart3, color: overallMarket >= 60 ? '#22c55e' : '#f59e0b' },
          { label: 'Social Score', value: sentiment.social, icon: MessageSquare, color: '#4f8cff' },
          { label: 'News Score', value: sentiment.news, icon: TrendingUp, color: '#a78bfa' },
          { label: 'Technical', value: sentiment.technical, icon: BarChart3, color: '#f59e0b' },
        ].map((item, idx) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            style={{ flex: 1, minWidth: '160px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <item.icon style={{ width: '14px', height: '14px', color: item.color }} />
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>{item.label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: item.color }}>{item.value}<span style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>/100</span></div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Asset Selector */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Assets</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'bullish', 'bearish'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', border: 'none', cursor: 'pointer', background: filter === f ? 'var(--color-accent-soft)' : 'transparent', color: filter === f ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {filteredAssets.map((a) => {
              const s = sentimentData[a.symbol];
              const isSelected = selectedAsset === a.symbol;
              const sentColor = s.overall >= 65 ? '#22c55e' : s.overall >= 45 ? '#f59e0b' : '#ef4444';
              return (
                <div key={a.symbol} onClick={() => setSelectedAsset(a.symbol)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '2px', background: isSelected ? 'rgba(79,140,255,0.08)' : 'transparent', border: isSelected ? '1px solid rgba(79,140,255,0.12)' : '1px solid transparent', transition: 'all 150ms' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>{a.symbol.slice(0, 2)}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600 }}>{a.symbol}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>{s.label}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {s.overall >= 60 ? <TrendingUp style={{ width: '12px', height: '12px', color: sentColor }} /> : s.overall < 45 ? <TrendingDown style={{ width: '12px', height: '12px', color: sentColor }} /> : <Minus style={{ width: '12px', height: '12px', color: sentColor }} />}
                    <span style={{ fontSize: '13px', fontWeight: 700, color: sentColor }}>{s.overall}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Gauge */}
          <motion.div key={selectedAsset} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '40px' }}>
            <SentimentGauge value={sentiment.overall} size={140} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{selectedAsset}</h2>
              <p style={{ fontSize: '14px', color: sentiment.overall >= 65 ? '#22c55e' : sentiment.overall >= 45 ? '#f59e0b' : '#ef4444', fontWeight: 600, marginBottom: '16px' }}>{sentiment.label}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[{ label: 'Social', val: sentiment.social, color: '#4f8cff' }, { label: 'News', val: sentiment.news, color: '#a78bfa' }, { label: 'Technical', val: sentiment.technical, color: '#f59e0b' }].map(item => (
                  <div key={item.label} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{item.label}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
              {/* Trend mini sparkline */}
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 500 }}>12-Day Trend</span>
                <svg width="100%" height="40" style={{ marginTop: '4px' }}>
                  {sentiment.trend.map((v, i) => {
                    const x = (i / (sentiment.trend.length - 1)) * 100 + '%';
                    const h = (v / 100) * 36;
                    return <rect key={i} x={`${(i / sentiment.trend.length) * 100}%`} y={40 - h} width={`${80 / sentiment.trend.length}%`} height={h} rx="2" fill={v >= 60 ? '#22c55e' : v >= 45 ? '#f59e0b' : '#ef4444'} fillOpacity="0.6" />;
                  })}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Word Cloud */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Word Cloud — {selectedAsset}</span>
            <WordCloud words={words} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
