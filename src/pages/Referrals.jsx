import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, Star, ArrowRight } from 'lucide-react';
import { referralData } from '../data/userData';
import { formatCurrency } from '../utils/format';

export default function Referrals() {
  const [copied, setCopied] = useState(false);
  const data = referralData;

  const copyCode = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = (data.totalReferrals / data.nextTierRequirement) * 100;
  const currentTier = data.tiers.find((t) => t.name === data.tier);
  const nextTier = data.tiers.find((t) => t.name === data.nextTier);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Referrals & Rewards</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Invite friends and earn rewards together</p>
      </div>

      {/* Referral Code Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '32px', marginBottom: '20px', background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(167,139,250,0.08))' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Your Referral Code</p>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <span className="text-2xl font-bold tracking-wider" style={{ letterSpacing: '0.1em' }}>{data.code}</span>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyCode}
                className="flex items-center text-xs font-semibold cursor-pointer"
                style={{ gap: '6px', padding: '8px 16px', borderRadius: '10px', background: copied ? 'var(--color-green)' : 'var(--color-accent)', color: '#fff', border: 'none' }}>
                {copied ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </motion.button>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-green)' }}>${data.totalEarned}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>Total Earned</p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Total Referrals', value: data.totalReferrals, icon: Users, color: '#4f8cff' },
            { label: 'Active Users', value: data.activeReferrals, icon: Star, color: '#22c55e' },
            { label: 'Pending Rewards', value: `$${data.pendingRewards}`, icon: Gift, color: '#f59e0b' },
            { label: 'Current Tier', value: data.tier, icon: Star, color: currentTier?.color || '#c0c0c0' },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="panel" style={{ padding: '20px' }}>
              <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}15`, marginBottom: '12px' }}>
                <stat.icon style={{ width: '16px', height: '16px', color: stat.color }} />
              </div>
              <p className="text-xl font-semibold">{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tier Progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="panel" style={{ padding: '28px' }}>
          <span className="section-label">Tier Progress</span>
          <div style={{ marginTop: '20px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-sm font-semibold" style={{ color: currentTier?.color }}>{data.tier}</span>
              <span className="text-sm font-semibold" style={{ color: nextTier?.color }}>{data.nextTier}</span>
            </div>
            <div style={{ height: '10px', borderRadius: '999px', background: 'var(--color-surface-active)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
                style={{ height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${currentTier?.color}, ${nextTier?.color})` }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '8px' }}>
              {data.nextTierRequirement - data.totalReferrals} more referrals to reach {data.nextTier}
            </p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.tiers.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between" style={{ padding: '10px 14px', borderRadius: '10px', background: tier.name === data.tier ? 'var(--color-accent-soft)' : 'transparent' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: tier.color }} />
                    <span className="text-sm font-medium">{tier.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{tier.bonus}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral History */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="panel" style={{ padding: '28px' }}>
        <span className="section-label">Referral History</span>
        <div style={{ marginTop: '20px' }}>
          {data.referrals.map((ref, idx) => (
            <div key={ref.id} className="flex items-center justify-between" style={{ padding: '12px 0', borderBottom: idx < data.referrals.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '999px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)', fontSize: '12px', fontWeight: 700, color: '#fff' }}>{ref.avatar}</div>
                <div>
                  <p className="text-sm font-medium">{ref.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>Joined {ref.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: '16px' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-green)' }}>{ref.earned > 0 ? `+$${ref.earned}` : '—'}</span>
                <span className="text-xs font-semibold" style={{
                  padding: '3px 10px', borderRadius: '999px',
                  background: ref.status === 'active' ? 'var(--color-green-soft)' : ref.status === 'pending' ? 'var(--color-amber-soft)' : 'var(--color-surface-active)',
                  color: ref.status === 'active' ? 'var(--color-green)' : ref.status === 'pending' ? 'var(--color-amber)' : 'var(--color-text-dim)',
                }}>{ref.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
