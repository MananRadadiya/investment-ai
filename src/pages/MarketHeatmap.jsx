import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMarketData } from '../hooks/useMarketData';
import { Grid, ZoomIn, ZoomOut, Filter } from 'lucide-react';

export default function MarketHeatmap() {
  const assets = useMarketData();
  const [zoom, setZoom] = useState(1);
  const [filterCat, setFilterCat] = useState('all');

  const filtered = useMemo(() => {
    if (filterCat === 'all') return assets;
    return assets.filter(a => a.category === filterCat);
  }, [assets, filterCat]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(a => {
      if (!g[a.sector]) g[a.sector] = [];
      g[a.sector].push(a);
    });
    return g;
  }, [filtered]);

  const maxMcap = useMemo(() => {
    const parseM = (s) => { if (!s) return 1; const n = parseFloat(s); if (s.includes('T')) return n * 1000; if (s.includes('B')) return n; return n / 1000; };
    return Math.max(...filtered.map(a => parseM(a.marketCap)));
  }, [filtered]);

  const parseMcap = (s) => { if (!s) return 1; const n = parseFloat(s); if (s.includes('T')) return n * 1000; if (s.includes('B')) return n; return n / 1000; };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Market Heatmap</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Visualize market performance at a glance — sized by market cap</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'stock', 'crypto', 'commodity', 'etf'].map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: filterCat === c ? 'var(--color-accent-soft)' : 'rgba(255,255,255,0.04)', color: filterCat === c ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
              {c === 'all' ? 'All Sectors' : c + 's'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setZoom(z => Math.max(0.6, z - 0.2))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZoomOut style={{ width: '14px', height: '14px' }} />
          </button>
          <button onClick={() => setZoom(z => Math.min(1.6, z + 0.2))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZoomIn style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Heatmap */}
      <motion.div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 300ms ease' }}>
        {Object.entries(grouped).map(([sector, sectorAssets]) => (
          <div key={sector} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '8px', padding: '4px 0' }}>{sector}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {sectorAssets.sort((a, b) => parseMcap(b.marketCap) - parseMcap(a.marketCap)).map((asset, idx) => {
                const size = Math.max(80, Math.min(200, (parseMcap(asset.marketCap) / maxMcap) * 200 * zoom));
                const pct = asset.changePercent;
                const intensity = Math.min(Math.abs(pct) / 5, 1);
                const bg = pct >= 0
                  ? `rgba(34, 197, 94, ${0.08 + intensity * 0.35})`
                  : `rgba(239, 68, 68, ${0.08 + intensity * 0.35})`;
                const borderColor = pct >= 0
                  ? `rgba(34, 197, 94, ${0.15 + intensity * 0.25})`
                  : `rgba(239, 68, 68, ${0.15 + intensity * 0.25})`;

                return (
                  <motion.div key={asset.symbol} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    style={{ width: `${size}px`, height: `${size * 0.7}px`, borderRadius: '12px', background: bg, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 300ms, border-color 300ms', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ fontSize: size > 100 ? '14px' : '11px', fontWeight: 700, color: 'var(--color-text)' }}>{asset.symbol}</span>
                    <span style={{ fontSize: size > 100 ? '12px' : '9px', fontWeight: 600, color: pct >= 0 ? '#22c55e' : '#ef4444' }}>
                      {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                    </span>
                    {size > 120 && <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', marginTop: '2px' }}>{asset.marketCap}</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.4)' }} />
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Strong Decline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)' }} />
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Slight Decline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.15)' }} />
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Slight Gain</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.4)' }} />
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Strong Gain</span>
        </div>
      </div>
    </motion.div>
  );
}
