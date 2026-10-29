import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, loginAsDemo, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(email, password);
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    loginAsDemo();
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail('manan@bharatinvestai.in');
    setPassword('demo1234');
  };

  return (
    <div className="login-bg" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-5)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-10) var(--space-8)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-trust), var(--color-ai))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            fontSize: '24px', fontWeight: 700, color: '#fff',
          }}>
            ◇
          </div>
          <h1 className="heading-tight" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-1)' }}>
            Bharat InvestAI
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            Financial Literacy for Every Indian
          </p>
        </div>

        {/* One-Click Demo */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="btn-primary"
          style={{
            width: '100%', height: 44, marginBottom: 'var(--space-6)',
            fontSize: '15px', borderRadius: 'var(--radius-sm)',
          }}
        >
          {isLoading ? 'Starting...' : 'Start Demo'}
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            or sign in
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label className="input-label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manan@bharatinvestai.in"
              required
            />
          </div>

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-tertiary)', padding: 4,
                }}
              >
                {showPassword
                  ? <EyeOff style={{ width: 16, height: 16 }} />
                  : <Eye style={{ width: 16, height: 16 }} />
                }
              </button>
            </div>
          </div>

          {loginError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '12px', color: 'var(--color-danger)',
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-danger-soft)',
              }}
            >
              {loginError}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-secondary"
            style={{ width: '100%', height: 40, marginTop: 'var(--space-1)' }}
          >
            <LogIn style={{ width: 15, height: 15 }} />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Hint */}
        <p style={{
          fontSize: '11px', color: 'var(--text-ghost)', textAlign: 'center',
          marginTop: 'var(--space-6)',
        }}>
          Demo credentials:{' '}
          <button
            onClick={fillDemo}
            style={{
              background: 'none', border: 'none',
              color: 'var(--color-trust)', cursor: 'pointer',
              fontSize: '11px', textDecoration: 'underline',
              fontFamily: 'var(--font-sans)',
            }}
          >
            auto-fill
          </button>
        </p>
      </motion.div>
    </div>
  );
}
