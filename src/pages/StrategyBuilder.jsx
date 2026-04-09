import { useState } from 'react';
import { motion } from 'framer-motion';
import { strategyTemplates } from '../data/educationData';
import { GitBranch, Plus, Trash2, Play, Save } from 'lucide-react';

const NODE_TYPES = [
  { type: 'condition', label: 'IF Condition', color: '#4f8cff', icon: '🔍' },
  { type: 'action-buy', label: 'Buy Action', color: '#22c55e', icon: '📈' },
  { type: 'action-sell', label: 'Sell Action', color: '#ef4444', icon: '📉' },
  { type: 'filter', label: 'Filter', color: '#f59e0b', icon: '🔧' },
  { type: 'wait', label: 'Wait / Delay', color: '#a78bfa', icon: '⏳' },
  { type: 'alert', label: 'Send Alert', color: '#ec4899', icon: '🔔' },
];

export default function StrategyBuilder() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'condition', label: 'RSI < 30', x: 60, y: 60 },
    { id: 2, type: 'filter', label: 'Volume > Avg', x: 260, y: 60 },
    { id: 3, type: 'action-buy', label: 'Buy 10%', x: 460, y: 60 },
    { id: 4, type: 'condition', label: 'RSI > 70', x: 60, y: 200 },
    { id: 5, type: 'action-sell', label: 'Sell All', x: 260, y: 200 },
    { id: 6, type: 'alert', label: 'Notify', x: 460, y: 200 },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const getNodeColor = (type) => NODE_TYPES.find(n => n.type === type)?.color || '#4f8cff';
  const getNodeIcon = (type) => NODE_TYPES.find(n => n.type === type)?.icon || '📊';

  const addNode = (type) => {
    setNodes(prev => [...prev, { id: Date.now(), type: type.type, label: type.label, x: 60 + Math.random() * 300, y: 60 + Math.random() * 200 }]);
  };

  const removeNode = (id) => setNodes(prev => prev.filter(n => n.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitBranch style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Strategy Builder</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Visual flow-chart builder for investment strategies</p>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {strategyTemplates.map(t => (
          <motion.button key={t.id} whileHover={{ scale: 1.02 }} onClick={() => setSelectedTemplate(t)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${selectedTemplate?.id === t.id ? `${t.color}30` : 'rgba(255,255,255,0.05)'}`, background: selectedTemplate?.id === t.id ? `${t.color}10` : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color }} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{t.name}</span>
            <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: t.risk === 'High' ? 'rgba(239,68,68,0.1)' : t.risk === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: t.risk === 'High' ? '#ef4444' : t.risk === 'Medium' ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{t.risk}</span>
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
        {/* Node Palette */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', alignSelf: 'start' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '12px' }}>Add Nodes</span>
          {NODE_TYPES.map(n => (
            <button key={n.type} onClick={() => addNode(n)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', marginBottom: '4px', color: 'var(--color-text)', textAlign: 'left', transition: 'all 150ms' }}>
              <span>{n.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: 500 }}>{n.label}</span>
              <Plus style={{ width: '12px', height: '12px', marginLeft: 'auto', color: 'var(--color-text-dim)' }} />
            </button>
          ))}
          <div style={{ marginTop: '16px', display: 'flex', gap: '4px' }}>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
              <Save style={{ width: '10px', height: '10px' }} /> Save
            </button>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(79,140,255,0.1)', color: '#4f8cff', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
              <Play style={{ width: '10px', height: '10px' }} /> Test
            </button>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', minHeight: '500px', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {nodes.length >= 2 && nodes.slice(0, -1).map((n, i) => {
              const next = nodes[i + 1];
              if (!next) return null;
              return (
                <line key={`l-${i}`} x1={n.x + 70} y1={n.y + 25} x2={next.x} y2={next.y + 25}
                  stroke={getNodeColor(n.type)} strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
              );
            })}
          </svg>
          {nodes.map((node, idx) => (
            <motion.div key={node.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 + idx * 0.05 }}
              style={{ position: 'absolute', left: node.x, top: node.y, padding: '14px 18px', borderRadius: '14px', background: `${getNodeColor(node.type)}12`, border: `1.5px solid ${getNodeColor(node.type)}30`, cursor: 'grab', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '18px' }}>{getNodeIcon(node.type)}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>{node.label}</div>
                <div style={{ fontSize: '9px', color: getNodeColor(node.type), fontWeight: 500, textTransform: 'capitalize' }}>{node.type.replace('-', ' ')}</div>
              </div>
              <button onClick={() => removeNode(node.id)}
                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', border: 'none', background: 'rgba(239,68,68,0.8)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 style={{ width: '9px', height: '9px' }} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
