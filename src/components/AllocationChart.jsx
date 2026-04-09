import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="backdrop-blur-xl shadow-2xl"
        style={{ background: 'rgba(15,20,28,0.95)', borderRadius: '12px', padding: '12px 16px' }}>
        <p className="text-sm font-semibold text-[var(--color-text)]">{d.symbol}</p>
        <p className="text-xs text-[var(--color-text-muted)]" style={{ marginTop: '2px' }}>
          {(d.allocation * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function AllocationChart({ allocation = [] }) {
  const data = allocation.map((a) => ({
    ...a,
    value: +(a.allocation * 100).toFixed(1),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="panel"
      style={{ padding: '32px' }}
    >
      <span className="section-label">Allocation</span>

      {data.length > 0 ? (
        <div className="flex items-center" style={{ gap: '32px', marginTop: '28px' }}>
          <div className="flex-shrink-0" style={{ width: '160px', height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color || '#4f8cff'} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '999px', background: item.color || '#4f8cff' }} />
                  <span className="text-sm text-[var(--color-text-muted)]">{item.symbol}</span>
                </div>
                <span className="text-sm font-medium tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-[var(--color-text-dim)] text-sm"
          style={{ height: '160px', marginTop: '28px' }}>
          No allocation data
        </div>
      )}
    </motion.div>
  );
}
