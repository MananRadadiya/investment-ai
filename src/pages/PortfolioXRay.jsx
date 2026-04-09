import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { formatCurrency } from '../utils/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers, Globe2, BarChart3, Shield, Coins, PieChart as PieIcon } from 'lucide-react';

const GEO_MAP = { AAPL: 'US', NVDA: 'US', MSFT: 'US', GOOGL: 'US', AMZN: 'US', META: 'US', TSLA: 'US', JPM: 'US', V: 'US', JNJ: 'US', WMT: 'US', DIS: 'US', NFLX: 'US', AMD: 'US', INTC: 'US', CRM: 'US', PYPL: 'US', BAC: 'US', BTC: 'Global', ETH: 'Global', SOL: 'Global', ADA: 'Global', DOT: 'Global', AVAX: 'Global', MATIC: 'Global', LINK: 'Global', UNI: 'Global', ATOM: 'Global', XRP: 'Global', DOGE: 'Global', GOLD: 'Global', SLV: 'Global', USO: 'Global', NG: 'Global', SPY: 'US', QQQ: 'US', VTI: 'US', IWM: 'US', ARKK: 'US' };
const CAP_MAP = { AAPL: 'Mega', NVDA: 'Mega', MSFT: 'Mega', GOOGL: 'Mega', AMZN: 'Mega', META: 'Large', TSLA: 'Large', BTC: 'Mega', ETH: 'Large', SOL: 'Mid', GOLD: 'Large', SPY: 'Large', QQQ: 'Large', JPM: 'Large', V: 'Large', JNJ: 'Mid', WMT: 'Large', DIS: 'Mid', NFLX: 'Mid', AMD: 'Mid', INTC: 'Mid', CRM: 'Mid', PYPL: 'Small', BAC: 'Mid', ADA: 'Small', DOT: 'Small', AVAX: 'Small', MATIC: 'Small', LINK: 'Small', UNI: 'Small', ATOM: 'Small', XRP: 'Mid', DOGE: 'Small', SLV: 'Mid', USO: 'Mid', NG: 'Small', VTI: 'Large', IWM: 'Mid', ARKK: 'Small' };
const CURRENCY_MAP = { BTC: 'BTC', ETH: 'ETH', SOL: 'SOL', ADA: 'ADA', DOT: 'DOT', AVAX: 'AVAX', MATIC: 'MATIC', LINK: 'LINK', UNI: 'UNI', ATOM: 'ATOM', XRP: 'XRP', DOGE: 'DOGE' };
const GEO_COLORS = { US: '#4f8cff', Global: '#22c55e', EU: '#a78bfa', Asia: '#f59e0b' };
const CAP_COLORS = { Mega: '#4f8cff', Large: '#22c55e', Mid: '#f59e0b', Small: '#a78bfa' };
const SECTOR_COLORS = { Technology: '#4f8cff', Crypto: '#f59e0b', Finance: '#22c55e', Healthcare: '#ef4444', Retail: '#a78bfa', Entertainment: '#ec4899', Automotive: '#e31937', 'E-Commerce': '#ff9900', Energy: '#ff6b35', Commodity: '#fbbf24', Index: '#14b8a6', Innovation: '#6366f1' };

function MiniPie({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
          {data.map((e, i) => <Cell key={i} fill={colors[e.name] || '#4f8cff'} fillOpacity={0.85} />)}
        </Pie>
        <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
          <div style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '10px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#e6edf3' }}>{payload[0].payload.name}</p>
            <p style={{ fontSize: '11px', color: '#8b949e' }}>{payload[0].value.toFixed(1)}%</p>
          </div>
        ) : null} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function PortfolioXRay() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();

  const analysis = useMemo(() => {
    if (!portfolio?.assets) return null;
    const geoBreak = {}, sectorBreak = {}, capBreak = {}, currencyBreak = {};
    let totalValue = 0;

    portfolio.assets.forEach(a => {
      const live = assets.find(m => m.symbol === a.symbol);
      const val = a.buyPrice && live ? (a.amount / a.buyPrice) * live.price : a.amount;
      totalValue += val;
      const geo = GEO_MAP[a.symbol] || 'Other';
      const cap = CAP_MAP[a.symbol] || 'Small';
      const sector = live?.sector || 'Other';
      const currency = CURRENCY_MAP[a.symbol] ? 'Crypto' : 'USD';
      geoBreak[geo] = (geoBreak[geo] || 0) + val;
      sectorBreak[sector] = (sectorBreak[sector] || 0) + val;
      capBreak[cap] = (capBreak[cap] || 0) + val;
      currencyBreak[currency] = (currencyBreak[currency] || 0) + val;
    });

    const toChart = (obj) => Object.entries(obj).map(([name, val]) => ({ name, value: +(val / totalValue * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
    return { geo: toChart(geoBreak), sector: toChart(sectorBreak), cap: toChart(capBreak), currency: toChart(currencyBreak), totalValue };
  }, [portfolio, assets]);

  if (!portfolio?.assets || !analysis) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginTop: '32px' }}>
        <Layers style={{ width: '40px', height: '40px', color: '#4f8cff', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Portfolio Data</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Create a portfolio first to see X-Ray analysis</p>
      </motion.div>
    );
  }

  const sections = [
    { title: 'Geography', icon: Globe2, data: analysis.geo, colors: GEO_COLORS, color: '#4f8cff' },
    { title: 'Sector', icon: BarChart3, data: analysis.sector, colors: SECTOR_COLORS, color: '#22c55e' },
    { title: 'Market Cap', icon: Shield, data: analysis.cap, colors: CAP_COLORS, color: '#a78bfa' },
    { title: 'Currency', icon: Coins, data: analysis.currency, colors: { USD: '#22c55e', Crypto: '#f59e0b' }, color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfolio X-Ray</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Deep-dive composition: geography, sector, cap size & currency</p>
          </div>
        </div>
      </div>

      {/* Value banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Analyzed Portfolio</span>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>{formatCurrency(analysis.totalValue)}</div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div><span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Assets</span><div style={{ fontSize: '18px', fontWeight: 700, color: '#4f8cff' }}>{portfolio.assets.length}</div></div>
          <div><span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Sectors</span><div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>{analysis.sector.length}</div></div>
          <div><span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>Regions</span><div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>{analysis.geo.length}</div></div>
        </div>
      </motion.div>

      {/* X-Ray Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {sections.map((section, idx) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.08 }}
            style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <section.icon style={{ width: '14px', height: '14px', color: section.color }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>{section.title} Breakdown</span>
            </div>
            <MiniPie data={section.data} colors={section.colors} />
            <div style={{ marginTop: '12px' }}>
              {section.data.map((item, i) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: section.colors[item.name] || '#4f8cff' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
