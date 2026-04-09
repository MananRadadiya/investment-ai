import { motion } from 'framer-motion';
import { Bot, TrendingUp, Shield, Zap, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/format';

/* ─── Confidence Meter ─── */
function ConfidenceMeter({ score, label, color }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span style={{ fontSize: '12px', color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {score}
        </span>
      </div>
      <div style={{ height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 12px ${color}30`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Asset Row ─── */
function AssetRow({ asset, idx, total }) {
  const amount = total * asset.allocation;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.03)',
        marginBottom: '8px',
        transition: 'all 200ms',
      }}
      whileHover={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: `${asset.color}20`,
      }}
    >
      {/* Rank */}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: idx === 0 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 800,
        color: idx === 0 ? '#f59e0b' : 'var(--color-text-dim)',
        flexShrink: 0,
      }}>
        {idx === 0 ? <Award style={{ width: '12px', height: '12px' }} /> : `#${idx + 1}`}
      </div>

      {/* Symbol badge */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 800,
          background: `${asset.color}12`,
          color: asset.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${asset.color}20`,
          flexShrink: 0,
          letterSpacing: '-0.02em',
        }}
      >
        {asset.symbol.slice(0, 3)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
            {asset.symbol}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
            }}>
              {(asset.allocation * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '6px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          marginTop: '8px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${asset.allocation * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '100%',
              borderRadius: '999px',
              background: `linear-gradient(90deg, ${asset.color}80, ${asset.color})`,
              position: 'relative',
            }}
          >
            {/* Glow dot at end */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2 }}
              style={{
                position: 'absolute',
                right: '-2px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: asset.color,
                boxShadow: `0 0 8px ${asset.color}60`,
              }}
            />
          </motion.div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>
            {formatCurrency(amount)}
          </span>
          <span style={{ fontSize: '10px', color: asset.color, fontWeight: 600 }}>
            {asset.name || asset.symbol}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AIRecommendationPanel({ result, onInvest }) {
  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '36px',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot style={{ width: '14px', height: '14px' }} />
          AI Recommendation
        </span>
        <div style={{
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-dim)',
        }}>
          <Bot style={{ width: '32px', height: '32px', opacity: 0.15, marginBottom: '12px' }} />
          <p style={{ fontSize: '13px' }}>Run the simulator for recommendations</p>
        </div>
      </motion.div>
    );
  }

  const { strategy, execution, risk } = result;
  const allocation = strategy?.allocation || [];
  const totalInvestment = execution?.totalAllocated || execution?.totalInvestment || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '0',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative gradient top border */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #4f8cff, #a78bfa, #22c55e, #f59e0b)',
          borderRadius: '24px 24px 0 0',
        }}
      />

      {/* Header */}
      <div style={{
        padding: '24px 28px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(79,140,255,0.15), rgba(167,139,250,0.15))',
                border: '1px solid rgba(79,140,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px', color: '#4f8cff' }} />
            </motion.div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>AI Recommendation</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
                Optimized by multi-agent pipeline
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '10px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}>
            <TrendingUp style={{ width: '12px', height: '12px', color: '#22c55e' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e' }}>Optimal</span>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <ConfidenceMeter score={risk?.riskScore || 0} label="Risk Score" color="#f59e0b" />
          <ConfidenceMeter score={strategy?.diversificationScore || 0} label="Diversification" color="#4f8cff" />
        </div>
      </div>

      {/* Allocation List */}
      <div style={{ padding: '20px 24px' }}>
        {allocation.slice(0, 6).map((asset, idx) => (
          <AssetRow key={idx} asset={asset} idx={idx} total={totalInvestment} />
        ))}
      </div>

      {/* Footer */}
      {execution && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px 24px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Allocated
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
              {formatCurrency(totalInvestment)}
            </div>
          </div>

          <motion.button
            onClick={onInvest}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(79,140,255,0.25)',
              transition: 'all 200ms',
            }}
          >
            Save Portfolio
            <ArrowUpRight style={{ width: '14px', height: '14px' }} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
