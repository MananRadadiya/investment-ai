import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMarketData } from '../hooks/useMarketData';
import { riskScenarios } from '../data/aiData';
import { formatCurrency, formatPercent } from '../utils/format';
import { AlertTriangle, Shield, Zap, TrendingDown, TrendingUp, Play, BarChart3 } from 'lucide-react';

export default function RiskSimulator() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulated, setSimulated] = useState(false);

  const currentValue = useMemo(() => {
    if (!portfolio?.assets) return 0;
    return portfolio.assets.reduce((sum, a) => {
      const live = assets.find(m => m.symbol === a.symbol);
      if (live && a.buyPrice) return sum + (a.amount / a.buyPrice) * live.price;
      return sum + a.amount;
    }, 0);
  }, [portfolio, assets]);

  const impactResult = useMemo(() => {
    if (!selectedScenario || !portfolio?.assets) return null;
    let impactedValue = 0;
    const assetImpacts = portfolio.assets.map(a => {
      const live = assets.find(m => m.symbol === a.symbol);
      const livePrice = live?.price || a.buyPrice || 0;
      const currentAmt = a.buyPrice ? (a.amount / a.buyPrice) * livePrice : a.amount;
      const impact = selectedScenario.impacts[a.symbol] || 0;
      const afterValue = currentAmt * (1 + impact / 100);
      impactedValue += afterValue;
      return { symbol: a.symbol, name: a.name, color: a.color, before: currentAmt, after: afterValue, impact, change: afterValue - currentAmt };
    });
    return { totalBefore: currentValue, totalAfter: impactedValue, totalChange: impactedValue - currentValue, totalChangePercent: currentValue > 0 ? ((impactedValue - currentValue) / currentValue * 100) : 0, assets: assetImpacts };
  }, [selectedScenario, portfolio, assets, currentValue]);

  const runScenario = (scenario) => {
    setSelectedScenario(scenario);
    setSimulated(false);
    setTimeout(() => setSimulated(true), 100);
  };

  const severityColors = { critical: '#ef4444', high: '#f59e0b', positive: '#22c55e' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Risk Simulator</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Stress-test your portfolio against market scenarios</p>
          </div>
        </div>
      </div>

      {!portfolio?.assets ? (
        <div style={{ padding: '80px 48px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <Shield style={{ width: '40px', height: '40px', color: '#4f8cff', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Portfolio to Test</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Create a portfolio first via the Simulator</p>
        </div>
      ) : (
        <>
          {/* Scenario Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {riskScenarios.map((scenario, idx) => (
              <motion.div key={scenario.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                onClick={() => runScenario(scenario)}
                style={{ padding: '20px', borderRadius: '16px', background: selectedScenario?.id === scenario.id ? 'rgba(79,140,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedScenario?.id === scenario.id ? 'rgba(79,140,255,0.15)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: 'all 200ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{scenario.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{scenario.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', background: `${severityColors[scenario.severity]}15`, color: severityColors[scenario.severity], textTransform: 'uppercase' }}>{scenario.severity}</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>{scenario.probability}% probability</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-dim)', lineHeight: 1.5 }}>{scenario.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Impact Results */}
          <AnimatePresence>
            {impactResult && simulated && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                {/* Summary */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Before</span>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>{formatCurrency(impactResult.totalBefore)}</div>
                  </motion.div>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: impactResult.totalChange >= 0 ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)', border: `1px solid ${impactResult.totalChange >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}` }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>After Scenario</span>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: impactResult.totalChange >= 0 ? '#22c55e' : '#ef4444', marginTop: '4px' }}>{formatCurrency(impactResult.totalAfter)}</div>
                  </motion.div>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, minWidth: '200px', padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Impact</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 700, color: impactResult.totalChange >= 0 ? '#22c55e' : '#ef4444' }}>{impactResult.totalChange >= 0 ? '+' : ''}{formatCurrency(impactResult.totalChange)}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: impactResult.totalChange >= 0 ? '#22c55e' : '#ef4444' }}>({formatPercent(impactResult.totalChangePercent)})</span>
                    </div>
                  </motion.div>
                </div>

                {/* Per-Asset Impact */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '16px' }}>Per-Asset Impact</span>
                  {impactResult.assets.map((a, idx) => (
                    <motion.div key={a.symbol} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.05 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: idx < impactResult.assets.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{a.symbol.slice(0, 2)}</div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{a.symbol}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginLeft: '8px' }}>{a.name}</span>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatCurrency(a.before)}</div>
                      </div>
                      <div style={{ width: '80px' }}>
                        <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(Math.abs(a.impact), 100)}%` }} transition={{ duration: 0.8, delay: 0.5 + idx * 0.05 }}
                            style={{ height: '100%', borderRadius: '999px', background: a.impact >= 0 ? '#22c55e' : '#ef4444' }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '70px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: a.impact >= 0 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          {a.impact >= 0 ? <TrendingUp style={{ width: '12px', height: '12px' }} /> : <TrendingDown style={{ width: '12px', height: '12px' }} />}
                          {a.impact >= 0 ? '+' : ''}{a.impact}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
