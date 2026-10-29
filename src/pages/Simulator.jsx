import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { calculateSIP, calculateLumpSum } from '../data/mutualFundData';
import { formatINR, formatCompact } from '../utils/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import {
  Calculator, TrendingUp, Target, ArrowRight,
  BarChart3, Sparkles, IndianRupee,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

// ─── SIP vs Lump Sum Visualizer ───
function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const { incrementStat } = useProgress();

  const sipResult = useMemo(() => calculateSIP(monthlyAmount, years, expectedReturn), [monthlyAmount, years, expectedReturn]);
  const fdResult = useMemo(() => calculateSIP(monthlyAmount, years, 7), [monthlyAmount, years]);
  const lumpSumEquiv = useMemo(() => calculateLumpSum(monthlyAmount * 12, years, expectedReturn), [monthlyAmount, years, expectedReturn]);

  // Year-by-year projection for chart
  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const sip = y === 0 ? 0 : calculateSIP(monthlyAmount, y, expectedReturn).futureValue;
      const fd = y === 0 ? 0 : calculateSIP(monthlyAmount, y, 7).futureValue;
      const invested = monthlyAmount * y * 12;
      data.push({
        year: `Yr ${y}`,
        'Index Fund SIP': Math.round(sip),
        'FD Equivalent': Math.round(fd),
        'Amount Invested': Math.round(invested),
      });
    }
    return data;
  }, [monthlyAmount, years, expectedReturn]);

  const handleCalculate = () => {
    incrementStat('sipCalculations');
  };

  return (
    <div>
      {/* Input Controls */}
      <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)' }}>
          <div>
            <label className="input-label">Monthly SIP Amount (₹)</label>
            <input
              type="range" min={500} max={50000} step={500}
              value={monthlyAmount}
              onChange={(e) => { setMonthlyAmount(+e.target.value); handleCalculate(); }}
              style={{ width: '100%', accentColor: 'var(--color-trust)' }}
            />
            <p className="mono-number" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-trust)', marginTop: 'var(--space-1)' }}>
              {formatINR(monthlyAmount)}/month
            </p>
          </div>
          <div>
            <label className="input-label">Investment Duration (Years)</label>
            <input
              type="range" min={1} max={40} step={1}
              value={years}
              onChange={(e) => { setYears(+e.target.value); handleCalculate(); }}
              style={{ width: '100%', accentColor: 'var(--color-learning)' }}
            />
            <p className="mono-number" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-learning)', marginTop: 'var(--space-1)' }}>
              {years} years
            </p>
          </div>
          <div>
            <label className="input-label">Expected Annual Return (%)</label>
            <input
              type="range" min={6} max={18} step={0.5}
              value={expectedReturn}
              onChange={(e) => { setExpectedReturn(+e.target.value); handleCalculate(); }}
              style={{ width: '100%', accentColor: 'var(--color-growth)' }}
            />
            <p className="mono-number" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-growth)', marginTop: 'var(--space-1)' }}>
              {expectedReturn}% p.a.
            </p>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            Total Invested
          </p>
          <p className="heading-tight mono-number" style={{ fontSize: 'var(--text-xl)' }}>
            {formatCompact(sipResult.totalInvested)}
          </p>
        </div>
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            Future Value (Index Fund)
          </p>
          <p className="heading-tight mono-number" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-growth)' }}>
            {formatCompact(sipResult.futureValue)}
          </p>
        </div>
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            Wealth Created
          </p>
          <p className="heading-tight mono-number" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-trust)' }}>
            {formatCompact(sipResult.totalReturns)}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-growth)' }}>
            +{sipResult.returnPercent}% total returns
          </p>
        </div>
        <div className="panel" style={{ padding: 'var(--space-5)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            FD vs Index Fund Gap
          </p>
          <p className="heading-tight mono-number" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-danger)' }}>
            {formatCompact(sipResult.futureValue - fdResult.futureValue)}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Cost of not investing in equity
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
          Growth Projection — SIP vs FD vs Just Saving
        </p>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-ghost)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-ghost)' }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                formatter={(value) => formatINR(value)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Index Fund SIP" stroke="#10b981" fill="url(#sipGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="FD Equivalent" stroke="#6b7280" fill="url(#fdGrad)" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="Amount Invested" stroke="#3b82f6" fill="none" strokeWidth={1} strokeDasharray="2 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Educational Insight */}
      <div style={{
        padding: 'var(--space-5)', borderRadius: 'var(--radius-sm)',
        background: 'var(--color-learning-soft)', border: '1px solid rgba(245, 158, 11, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <Sparkles style={{ width: 14, height: 14, color: 'var(--color-learning)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-learning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            What This Means
          </span>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          By investing <strong>{formatINR(monthlyAmount)}/month</strong> for <strong>{years} years</strong>,
          you invest {formatCompact(sipResult.totalInvested)} total.
          In an Index Fund at {expectedReturn}%, this becomes <strong>{formatCompact(sipResult.futureValue)}</strong>.
          In an FD at 7%, only {formatCompact(fdResult.futureValue)}.
          {' '}The gap of <strong>{formatCompact(sipResult.futureValue - fdResult.futureValue)}</strong> is the cost of not investing in equity.
          Remember: past performance doesn't guarantee future results, but historically NIFTY 50 has averaged ~12% over 20+ year periods.
        </p>
      </div>
    </div>
  );
}

// ─── Goal-Based Planning ───
function GoalPlanner() {
  const [goalType, setGoalType] = useState('retirement');
  const [targetAmount, setTargetAmount] = useState(5000000);
  const [years, setYears] = useState(30);

  const goals = [
    { id: 'emergency', label: '🛡️ Emergency Fund', defaultTarget: 150000, defaultYears: 1 },
    { id: 'bike', label: '🏍️ Bike/Scooter', defaultTarget: 120000, defaultYears: 2 },
    { id: 'wedding', label: '💒 Wedding', defaultTarget: 1500000, defaultYears: 5 },
    { id: 'car', label: '🚗 Car', defaultTarget: 800000, defaultYears: 3 },
    { id: 'house', label: '🏠 House Down Payment', defaultTarget: 2500000, defaultYears: 10 },
    { id: 'education', label: '🎓 Higher Education', defaultTarget: 1000000, defaultYears: 5 },
    { id: 'retirement', label: '🌅 Retirement', defaultTarget: 50000000, defaultYears: 30 },
  ];

  const selectedGoal = goals.find((g) => g.id === goalType);
  const scenarios = [
    { name: 'FD (7%)', rate: 7, color: '#6b7280' },
    { name: 'PPF (7.1%)', rate: 7.1, color: '#3b82f6' },
    { name: 'Hybrid Fund (10%)', rate: 10, color: '#f59e0b' },
    { name: 'Index Fund (12%)', rate: 12, color: '#10b981' },
    { name: 'Mid Cap (15%)', rate: 15, color: '#8b5cf6' },
  ];

  const results = useMemo(() => {
    return scenarios.map((s) => {
      const months = years * 12;
      const monthlyRate = s.rate / 12 / 100;
      const requiredSIP = Math.round(
        targetAmount / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
      );
      return { ...s, requiredSIP };
    });
  }, [targetAmount, years]);

  const handleGoalChange = (id) => {
    const g = goals.find((x) => x.id === id);
    setGoalType(id);
    setTargetAmount(g.defaultTarget);
    setYears(g.defaultYears);
  };

  return (
    <div>
      {/* Goal Selection */}
      <div className="panel" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
          Select Your Goal
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGoalChange(g.id)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                background: goalType === g.id ? 'var(--color-trust-soft)' : 'var(--surface-2)',
                border: goalType === g.id ? '1px solid var(--color-trust)' : '1px solid transparent',
                color: goalType === g.id ? 'var(--color-trust)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'all 150ms',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target & Timeline */}
      <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div>
            <label className="input-label">Target Amount (₹)</label>
            <input
              type="range" min={50000} max={100000000} step={50000}
              value={targetAmount}
              onChange={(e) => setTargetAmount(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-trust)' }}
            />
            <p className="mono-number" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-trust)', marginTop: 'var(--space-1)' }}>
              {formatCompact(targetAmount)}
            </p>
          </div>
          <div>
            <label className="input-label">Timeline</label>
            <input
              type="range" min={1} max={40} step={1}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-learning)' }}
            />
            <p className="mono-number" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-learning)', marginTop: 'var(--space-1)' }}>
              {years} years
            </p>
          </div>
        </div>
      </div>

      {/* Required SIP Comparison */}
      <div className="panel" style={{ padding: 'var(--space-5)' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
          Required Monthly SIP to Reach {formatCompact(targetAmount)} in {years} Years
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {results.map((r) => (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-1)',
            }}>
              <span style={{ fontSize: '13px', color: r.color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: r.color }} />
                {r.name}
              </span>
              <span className="mono-number" style={{ fontSize: '15px', fontWeight: 700 }}>
                {formatINR(r.requiredSIP)}/month
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════ MAIN COMPONENT ═══════
export default function Simulator() {
  const [tab, setTab] = useState('sip');

  return (
    <motion.div {...fadeIn}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
          Investment Simulator 🧪
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          See how your money grows with SIP, compare with FD, and plan for life goals — all in ₹
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-6)',
        background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', padding: 2, width: 'fit-content',
      }}>
        {[
          { id: 'sip', label: 'SIP Calculator', icon: Calculator },
          { id: 'goal', label: 'Goal Planner', icon: Target },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '8px 20px', borderRadius: 'var(--radius-sm)',
              background: tab === id ? 'var(--bg-secondary)' : 'transparent',
              border: tab === id ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: tab === id ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              transition: 'all 150ms',
            }}
          >
            <Icon style={{ width: 14, height: 14 }} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'sip' ? <SIPCalculator /> : <GoalPlanner />}
    </motion.div>
  );
}
