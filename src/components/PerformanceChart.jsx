import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateHistoricalData } from '../data/marketData';
import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl shadow-2xl"
        style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '12px', padding: '12px 16px' }}>
        <p className="text-xs text-[var(--color-text-muted)]" style={{ marginBottom: '4px' }}>{label}</p>
        <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function PerformanceChart() {
  const [timeRange, setTimeRange] = useState('1M');
  const ranges = ['1W', '1M', '3M', '1Y'];

  const data = useMemo(() => {
    const days = { '1W': 7, '1M': 30, '3M': 90, '1Y': 365 }[timeRange];
    return generateHistoricalData(days);
  }, [timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="panel-static"
      style={{ padding: '32px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <span className="section-label">Performance</span>
        <div className="flex" style={{ gap: '4px', padding: '4px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className="text-xs font-semibold cursor-pointer"
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                transition: 'all 150ms',
                background: timeRange === r ? 'rgba(79,140,255,0.12)' : 'transparent',
                color: timeRange === r ? '#4f8cff' : '#484f58',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#484f58', fontWeight: 500 }}
              interval="preserveStartEnd"
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#484f58', fontWeight: 500 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={50}
              dx={-6}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4f8cff"
              strokeWidth={2}
              fill="url(#perfGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#4f8cff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
