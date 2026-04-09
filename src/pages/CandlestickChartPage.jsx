import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { generateOHLCV } from '../utils/chartExport';
import { CandlestickChart as CandleIcon, Download, Clock } from 'lucide-react';

function CandlestickSVG({ data, width = 800, height = 400 }) {
  if (!data || data.length === 0) return null;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const cw = width - padding.left - padding.right;
  const ch = height - padding.top - padding.bottom;
  const allHigh = Math.max(...data.map(d => d.high));
  const allLow = Math.min(...data.map(d => d.low));
  const range = allHigh - allLow || 1;
  const barWidth = Math.max(2, (cw / data.length) * 0.7);
  const gap = cw / data.length;

  const yScale = (v) => padding.top + ch - ((v - allLow) / range) * ch;
  const maxVol = Math.max(...data.map(d => d.volume));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height + 60}`} style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = padding.top + ch * (1 - f);
        const val = allLow + range * f;
        return (
          <g key={f}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 4} textAnchor="end" style={{ fontSize: '9px', fill: 'var(--color-text-dim)' }}>${val.toFixed(0)}</text>
          </g>
        );
      })}

      {/* Candles */}
      {data.map((d, i) => {
        const x = padding.left + i * gap + gap / 2;
        const isGreen = d.close >= d.open;
        const color = isGreen ? '#22c55e' : '#ef4444';
        const bodyTop = yScale(Math.max(d.open, d.close));
        const bodyBottom = yScale(Math.min(d.open, d.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} y1={yScale(d.high)} x2={x} y2={yScale(d.low)} stroke={color} strokeWidth="1" />
            {/* Body */}
            <rect x={x - barWidth / 2} y={bodyTop} width={barWidth} height={bodyHeight} fill={color} rx="1" />
            {/* Volume */}
            <rect x={x - barWidth / 2} y={height + 30 - (d.volume / maxVol) * 25} width={barWidth} height={(d.volume / maxVol) * 25} fill={color} fillOpacity="0.3" rx="1" />
          </g>
        );
      })}

      {/* Date labels */}
      {data.filter((_, i) => i % Math.ceil(data.length / 8) === 0).map((d, i) => {
        const idx = data.indexOf(d);
        const x = padding.left + idx * gap + gap / 2;
        return <text key={i} x={x} y={height + 8} textAnchor="middle" style={{ fontSize: '8px', fill: 'var(--color-text-dim)' }}>{d.date.slice(5)}</text>;
      })}

      <text x={padding.left} y={height + 52} style={{ fontSize: '8px', fill: 'var(--color-text-dim)' }}>Volume</text>
    </svg>
  );
}

export default function CandlestickChartPage() {
  const assets = useMarketData();
  const [selected, setSelected] = useState('BTC');
  const [timeframe, setTimeframe] = useState(60);

  const asset = assets.find(a => a.symbol === selected);
  const ohlcv = useMemo(() => generateOHLCV(asset?.price || 100, timeframe), [selected, timeframe, asset?.price]);

  const handleDownload = () => {
    const svg = document.getElementById('candlestick-chart')?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${selected}-candlestick.svg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CandleIcon style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Candlestick Chart</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Interactive OHLCV candlestick charts with volume overlay</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {assets.slice(0, 12).map(a => (
            <button key={a.symbol} onClick={() => setSelected(a.symbol)}
              style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', background: selected === a.symbol ? `${a.color}20` : 'rgba(255,255,255,0.04)', color: selected === a.symbol ? a.color : 'var(--color-text-dim)', transition: 'all 150ms' }}>
              {a.symbol}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[{ label: '1M', days: 30 }, { label: '2M', days: 60 }, { label: '3M', days: 90 }].map(t => (
            <button key={t.label} onClick={() => setTimeframe(t.days)}
              style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', background: timeframe === t.days ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: timeframe === t.days ? 'var(--color-accent)' : 'var(--color-text-dim)' }}>
              {t.label}
            </button>
          ))}
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: '1px solid rgba(79,140,255,0.15)', cursor: 'pointer', background: 'rgba(79,140,255,0.08)', color: '#4f8cff' }}>
            <Download style={{ width: '12px', height: '12px' }} /> Download
          </button>
        </div>
      </div>

      {/* Chart */}
      <motion.div id="candlestick-chart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {asset && <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${asset.color}15`, color: asset.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{asset.symbol.slice(0, 2)}</div>}
            <div>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>{selected}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginLeft: '8px' }}>{asset?.name}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock style={{ width: '12px', height: '12px', color: 'var(--color-text-dim)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>{timeframe} days</span>
          </div>
        </div>
        <CandlestickSVG data={ohlcv} />
      </motion.div>
    </motion.div>
  );
}
