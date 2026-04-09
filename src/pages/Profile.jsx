import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Calendar, TrendingUp, Trophy, Clock, Flame, Phone, Edit3 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Trades', value: '847', icon: TrendingUp, color: '#4f8cff' },
    { label: 'Success Rate', value: '73.2%', icon: Trophy, color: '#22c55e' },
    { label: 'Best Trade', value: '+42.8%', icon: Flame, color: '#f59e0b' },
    { label: 'Avg Hold Time', value: '14 days', icon: Clock, color: '#a78bfa' },
  ];

  const details = [
    { label: 'Portfolio High', value: '$284,500' },
    { label: 'Total Profit', value: '$47,320' },
    { label: 'Active Streak', value: '186 days' },
    { label: 'Worst Trade', value: '-18.3% (AVAX)' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Profile</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Your account information and stats</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="panel"
        style={{ padding: '40px', marginBottom: '24px' }}
      >
        <div className="flex items-start justify-between" style={{ marginBottom: '32px' }}>
          <div className="flex items-center" style={{ gap: '20px' }}>
            <div className="flex items-center justify-center flex-shrink-0"
              style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
                fontSize: '28px', fontWeight: 700, color: 'white',
              }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ marginBottom: '4px' }}>{user?.name || 'Alex Morgan'}</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email || 'demo@aiinvest.com'}</p>
              <div className="flex items-center" style={{ gap: '8px', marginTop: '8px' }}>
                <span className="text-xs font-semibold"
                  style={{
                    padding: '4px 12px', borderRadius: '999px',
                    background: 'rgba(79, 140, 255, 0.12)', color: '#4f8cff',
                  }}>
                  {user?.plan || 'Pro'} Plan
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  Member since {user?.memberSince || 'March 2024'}
                </span>
              </div>
            </div>
          </div>
          <button className="flex items-center text-xs font-medium cursor-pointer"
            style={{
              gap: '6px', padding: '8px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--color-text-muted)', transition: 'all 150ms',
            }}>
            <Edit3 style={{ width: '12px', height: '12px' }} /> Edit
          </button>
        </div>

        {/* Info rows */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { icon: Mail, label: 'Email', value: user?.email || 'demo@aiinvest.com' },
            { icon: Phone, label: 'Phone', value: '+1 (555) 987-6543' },
            { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
            { icon: Calendar, label: 'Joined', value: user?.memberSince || 'March 2024' },
          ].map((item) => (
            <div key={item.label} className="flex items-center"
              style={{ gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <item.icon style={{ width: '16px', height: '16px', color: 'var(--color-text-dim)', flexShrink: 0 }} />
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--color-text-dim)', marginBottom: '6px' }}>Bio</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            AI-driven investor focused on crypto and tech. Using algorithmic strategies since 2021.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="panel"
            style={{ padding: '24px' }}
          >
            <div className="flex items-center justify-center"
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `${stat.color}12`, marginBottom: '16px',
              }}>
              <stat.icon style={{ width: '18px', height: '18px', color: stat.color }} />
            </div>
            <p className="text-2xl font-semibold tracking-tight" style={{ marginBottom: '4px' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Extra Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="panel"
        style={{ padding: '32px' }}
      >
        <span className="section-label">Performance History</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          {details.map((d) => (
            <div key={d.label} className="flex items-center justify-between"
              style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{d.label}</span>
              <span className="text-sm font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
