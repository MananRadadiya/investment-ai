import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { smartAlertTemplates, generateTechnicalIndicators } from '../data/aiData';
import { useMarketData } from '../hooks/useMarketData';
import { BellRing, Plus, Trash2, Zap, Shield, BarChart3, Brain, Activity, Check, X } from 'lucide-react';

const CATEGORY_COLORS = { technical: '#4f8cff', portfolio: '#a78bfa', market: '#f59e0b', price: '#22c55e', ai: '#ec4899' };
const CATEGORY_ICONS = { technical: BarChart3, portfolio: Shield, market: Activity, price: Zap, ai: Brain };

export default function SmartAlerts() {
  const assets = useMarketData();
  const [activeAlerts, setActiveAlerts] = useState(() => [
    { ...smartAlertTemplates[0], symbol: 'BTC', enabled: true, triggered: false, createdAt: '2026-04-09' },
    { ...smartAlertTemplates[6], symbol: null, enabled: true, triggered: true, triggeredAt: '2 hours ago', createdAt: '2026-04-08' },
    { ...smartAlertTemplates[11], symbol: 'NVDA', enabled: true, triggered: false, targetPrice: 900, createdAt: '2026-04-07' },
    { ...smartAlertTemplates[4], symbol: 'ETH', enabled: false, triggered: false, createdAt: '2026-04-05' },
  ]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  const filteredTemplates = useMemo(() => {
    if (filterCat === 'all') return smartAlertTemplates;
    return smartAlertTemplates.filter(t => t.category === filterCat);
  }, [filterCat]);

  const addAlert = (template, symbol) => {
    setActiveAlerts(prev => [{ ...template, symbol, enabled: true, triggered: false, createdAt: new Date().toISOString().split('T')[0] }, ...prev]);
    setShowAddPanel(false);
  };

  const toggleAlert = (idx) => {
    setActiveAlerts(prev => prev.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  };

  const removeAlert = (idx) => {
    setActiveAlerts(prev => prev.filter((_, i) => i !== idx));
  };

  const triggeredCount = activeAlerts.filter(a => a.triggered).length;
  const activeCount = activeAlerts.filter(a => a.enabled).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ec4899, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BellRing style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart Alerts Engine</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>AI-driven conditions — technical, portfolio, and market alerts</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Active Alerts', value: activeCount, color: '#4f8cff' },
          { label: 'Triggered', value: triggeredCount, color: '#22c55e' },
          { label: 'Templates', value: smartAlertTemplates.length, color: '#a78bfa' },
        ].map((s, idx) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            style={{ flex: 1, minWidth: '140px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Active Alerts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Your Alerts</span>
            <button onClick={() => setShowAddPanel(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(79,140,255,0.1)', border: '1px solid rgba(79,140,255,0.15)', color: '#4f8cff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
              <Plus style={{ width: '12px', height: '12px' }} /> Add Alert
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>
              <BellRing style={{ width: '32px', height: '32px', margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '13px' }}>No alerts configured yet</p>
            </div>
          ) : (
            activeAlerts.map((alert, idx) => {
              const CatIcon = CATEGORY_ICONS[alert.category] || Activity;
              const catColor = CATEGORY_COLORS[alert.category] || '#4f8cff';
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.04 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', marginBottom: '8px', background: alert.triggered ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${alert.triggered ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)'}`, opacity: alert.enabled ? 1 : 0.5 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${catColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CatIcon style={{ width: '14px', height: '14px', color: catColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{alert.name}</span>
                      {alert.symbol && <span style={{ fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>{alert.symbol}</span>}
                      {alert.triggered && <Check style={{ width: '12px', height: '12px', color: '#22c55e' }} />}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '2px' }}>{alert.condition}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => toggleAlert(idx)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: alert.enabled ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: alert.enabled ? '#22c55e' : 'var(--color-text-dim)' }}>
                      {alert.enabled ? <Check style={{ width: '12px', height: '12px' }} /> : <X style={{ width: '12px', height: '12px' }} />}
                    </button>
                    <button onClick={() => removeAlert(idx)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
                      <Trash2 style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Template Library */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '16px' }}>Alert Templates</span>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['all', 'technical', 'portfolio', 'market', 'price', 'ai'].map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, textTransform: 'capitalize', border: 'none', cursor: 'pointer', background: filterCat === c ? (CATEGORY_COLORS[c] || 'var(--color-accent)') + '15' : 'rgba(255,255,255,0.04)', color: filterCat === c ? (CATEGORY_COLORS[c] || 'var(--color-accent)') : 'var(--color-text-dim)' }}>
                {c}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {filteredTemplates.map((t, idx) => {
              const CatIcon = CATEGORY_ICONS[t.category] || Activity;
              const catColor = CATEGORY_COLORS[t.category] || '#4f8cff';
              return (
                <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', marginBottom: '6px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 150ms' }}
                  onClick={() => addAlert(t, assets[Math.floor(Math.random() * 10)]?.symbol || 'BTC')}>
                  <span style={{ fontSize: '18px' }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>{t.condition}</div>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: `${catColor}15`, color: catColor, textTransform: 'capitalize' }}>{t.category}</span>
                  <Plus style={{ width: '14px', height: '14px', color: 'var(--color-text-dim)' }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
