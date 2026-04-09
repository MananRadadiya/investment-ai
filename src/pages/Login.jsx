import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';

export default function Login() {
  const { login, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Fake delay for realism
    await new Promise((r) => setTimeout(r, 800));
    login(email, password);
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail('demo@aiinvest.com');
    setPassword('demo1234');
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ padding: '20px' }}>
      {/* Animated orbs */}
      <div className="login-orb"
        style={{ width: '500px', height: '500px', background: '#4f8cff', top: '-120px', right: '-80px', animationDelay: '0s' }} />
      <div className="login-orb"
        style={{ width: '400px', height: '400px', background: '#a78bfa', bottom: '-100px', left: '-60px', animationDelay: '3s' }} />
      <div className="login-orb"
        style={{ width: '300px', height: '300px', background: '#22c55e', top: '40%', left: '60%', animationDelay: '5s', opacity: 0.08 }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative z-10 w-full"
        style={{ maxWidth: '440px', padding: '48px 40px' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center"
          style={{ gap: '12px', marginBottom: '40px' }}
        >
          <div className="flex items-center justify-center"
            style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f8cff, #a78bfa)' }}>
            <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ lineHeight: 1.2 }}>AI Invest</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>Intelligent Portfolio Manager</p>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
          style={{ marginBottom: '32px' }}
        >
          <h2 className="text-xl font-semibold" style={{ marginBottom: '8px' }}>Welcome back</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Sign in to your account to continue</p>
        </motion.div>

        {/* Demo hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={fillDemo}
          className="cursor-pointer"
          style={{
            padding: '14px 16px', marginBottom: '28px', borderRadius: '14px',
            background: 'rgba(79, 140, 255, 0.08)', border: '1px solid rgba(79, 140, 255, 0.15)',
            transition: 'all 200ms',
          }}
        >
          <p className="text-xs font-semibold" style={{ color: '#4f8cff', marginBottom: '4px' }}>
            🎯 Demo Account — Click to auto-fill
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            <span className="font-mono">demo@aiinvest.com</span> / <span className="font-mono">demo1234</span>
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '20px' }}
          >
            <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full text-sm focus:outline-none"
              style={{
                padding: '14px 16px', background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text)', transition: 'all 200ms',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ marginBottom: '24px' }}
          >
            <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full text-sm focus:outline-none"
                style={{
                  padding: '14px 48px 14px 16px', background: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--color-text)', transition: 'all 200ms',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute flex items-center justify-center cursor-pointer"
                style={{
                  right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-text-dim)',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium"
              style={{
                color: '#ef4444', padding: '12px 16px', marginBottom: '20px',
                borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {loginError}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            id="login-submit"
            className="w-full text-sm font-semibold flex items-center justify-center cursor-pointer"
            style={{
              padding: '14px 0', borderRadius: '14px', border: 'none',
              gap: '10px', transition: 'all 200ms',
              background: isLoading ? 'rgba(79,140,255,0.5)' : 'linear-gradient(135deg, #4f8cff, #6366f1)',
              color: '#ffffff', cursor: isLoading ? 'wait' : 'pointer',
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                  }}
                />
                Signing in...
              </>
            ) : (
              <>
                <LogIn style={{ width: '16px', height: '16px' }} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs"
          style={{ color: 'var(--color-text-dim)', marginTop: '24px' }}
        >
          This is a demo app — no real authentication
        </motion.p>
      </motion.div>
    </div>
  );
}
