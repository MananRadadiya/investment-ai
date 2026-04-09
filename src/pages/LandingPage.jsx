import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Zap, ArrowRight, TrendingUp, Shield, Brain, BarChart3,
  ChevronRight, Star, Check, Moon, Sun, Menu, X,
  Sparkles, Target, LineChart, Bot, Layers, Globe,
  Play, Users, Award, Clock, ArrowUpRight, ChevronDown,
  Cpu, Activity, PieChart, Wallet, Lock, Rocket
} from 'lucide-react';

/* ─── Particle Canvas Background ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight * 5);

    const PARTICLE_COUNT = 120;
    const isDark = theme === 'dark';
    const color = isDark ? '79, 140, 255' : '59, 127, 245';

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight || window.innerHeight * 5;
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating Badge ─── */
function FloatingBadge({ children, delay = 0, x = 0, y = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', left: x, top: y, zIndex: 10,
        padding: '10px 18px', borderRadius: '16px',
        background: 'var(--color-surface-solid)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px var(--color-shadow)',
        fontSize: '13px', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px',
        color: 'var(--color-text)',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Scroll Reveal Section ─── */
function RevealSection({ children, ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ─── Glowing Card ─── */
function GlowCard({ children, glowColor = '79, 140, 255', delay = 0, style = {} }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouse = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      style={{
        position: 'relative', borderRadius: '24px', overflow: 'hidden',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(24px)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        ...style,
      }}
      className="landing-glow-card"
    >
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(${glowColor}, 0.08) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
        className="landing-glow-overlay"
      />
      {children}
    </motion.div>
  );
}

/* ─── Typewriter Effect ─── */
function TypeWriter({ words, speed = 80, pause = 2000 }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1));
        if (text.length === word.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(word.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentWord, words, speed, pause]);

  return (
    <span>
      {text}
      <span style={{
        borderRight: '3px solid var(--color-accent)',
        animation: 'blink-cursor 1s step-end infinite',
        marginLeft: '2px',
      }} />
    </span>
  );
}


/* ═══════════════ MAIN LANDING PAGE ═══════════════ */

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate featured feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain, title: 'AI-Powered Analysis',
      desc: 'Our neural networks process 10M+ data points per second, identifying patterns invisible to the human eye.',
      color: '#4f8cff', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)',
    },
    {
      icon: Shield, title: 'Risk Intelligence',
      desc: 'Adaptive risk models predict market volatility and automatically adjust your portfolio shield in real-time.',
      color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
      icon: Bot, title: 'Autonomous Agents',
      desc: 'Deploy AI agents that monitor, analyze, and execute trades 24/7 — even while you sleep.',
      color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    },
    {
      icon: Target, title: 'Smart Rebalancing',
      desc: 'Algorithm-driven portfolio rebalancing that maintains optimal allocation ratios across all market conditions.',
      color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  ];

  const stats = [
    { value: 847, suffix: 'K+', label: 'Active Traders', icon: Users },
    { value: 2.4, suffix: 'B', prefix: '$', label: 'Assets Managed', icon: Wallet },
    { value: 73, suffix: '%', label: 'Avg. Success Rate', icon: TrendingUp },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: Clock },
  ];

  const howItWorks = [
    { step: 1, title: 'Connect', desc: 'Link your brokerage account in seconds with bank-grade encryption.', icon: Lock },
    { step: 2, title: 'Configure', desc: 'Set your risk tolerance, goals, and preferred sectors.', icon: Layers },
    { step: 3, title: 'Deploy', desc: 'Launch AI agents that analyze markets and execute strategies.', icon: Rocket },
    { step: 4, title: 'Profit', desc: 'Watch your portfolio grow with real-time insights and reports.', icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen', role: 'Portfolio Manager, Goldman Sachs',
      text: "AI Invest completely transformed how I manage client portfolios. The autonomous agents caught a market dip 3 hours before it hit — saving us $2.4M.",
      avatar: 'SC', rating: 5,
    },
    {
      name: 'Marcus Johnson', role: 'Independent Trader',
      text: "I went from spending 8 hours daily on analysis to 30 minutes. The AI does the heavy lifting while I focus on strategy. My returns improved 42%.",
      avatar: 'MJ', rating: 5,
    },
    {
      name: 'Elena Rodriguez', role: 'CTO, FinVault Capital',
      text: "The risk intelligence module is unreal. It predicted the tech correction with 94% accuracy. We've integrated AI Invest across our entire fund.",
      avatar: 'ER', rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter', price: 0, period: 'Forever free',
      desc: 'Perfect for exploring AI-powered investing',
      features: ['1 AI Agent', 'Basic Analytics', 'Paper Trading', 'Email Support', 'Market News Feed'],
      cta: 'Start Free', popular: false,
    },
    {
      name: 'Pro', price: 49, period: '/month',
      desc: 'For serious traders who want an edge',
      features: ['5 AI Agents', 'Advanced Analytics', 'Live Trading', 'Priority Support', 'Risk Intelligence', 'Smart Rebalancing', 'Custom Alerts'],
      cta: 'Go Pro', popular: true,
    },
    {
      name: 'Enterprise', price: 199, period: '/month',
      desc: 'For funds and institutions at scale',
      features: ['Unlimited Agents', 'Custom Models', 'API Access', 'Dedicated Manager', 'SLA Guarantee', 'White-label Option', 'Team Management', 'Audit Logs'],
      cta: 'Contact Sales', popular: false,
    },
  ];

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticleCanvas />

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? '12px 40px' : '20px 40px',
          background: scrolled
            ? theme === 'dark'
              ? 'rgba(11, 15, 20, 0.85)'
              : 'rgba(244, 246, 249, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79, 140, 255, 0.3)',
            }}>
              <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{
              fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--color-text), var(--color-accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              AI Invest
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
          }} className="landing-desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '14px',
                  fontWeight: 500, color: 'var(--color-text-secondary)',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                }}
                className="landing-nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text-secondary)',
                transition: 'all 0.2s ease',
              }}
              className="landing-theme-btn"
              id="landing-theme-toggle"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px', borderRadius: '12px', fontSize: '14px',
                fontWeight: 600, background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="landing-login-btn"
              id="landing-login-btn"
            >
              Log In
            </button>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px', borderRadius: '12px', fontSize: '14px',
                fontWeight: 600, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
                color: '#ffffff', transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(79, 140, 255, 0.3)',
              }}
              className="landing-cta-btn-nav"
              id="landing-get-started-nav"
            >
              Get Started Free
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="landing-mobile-menu-btn"
              style={{
                display: 'none', width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-text)',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden', padding: '16px 0',
                borderTop: '1px solid var(--color-border)',
                marginTop: '12px',
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block', padding: '12px 16px', fontSize: '15px',
                    fontWeight: 500, color: 'var(--color-text-secondary)',
                    textDecoration: 'none', borderRadius: '10px',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '14px', marginTop: '8px',
                  borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                }}
              >
                Get Started Free
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        ref={heroRef}
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '140px 40px 80px',
          opacity: heroOpacity, scale: heroScale,
        }}
      >
        {/* Gradient Orbs */}
        <div className="landing-orb" style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,140,255,0.15) 0%, transparent 70%)',
          position: 'absolute', top: '-100px', right: '-150px',
          filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite',
        }} />
        <div className="landing-orb" style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          position: 'absolute', bottom: '-50px', left: '-100px',
          filter: 'blur(60px)', animation: 'float 12s ease-in-out infinite 2s',
        }} />
        <div className="landing-orb" style={{
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          position: 'absolute', top: '40%', left: '60%',
          filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite 4s',
        }} />

        <div style={{
          maxWidth: '1100px', margin: '0 auto', textAlign: 'center',
          position: 'relative', zIndex: 2,
        }}>
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 20px 8px 10px', borderRadius: '100px',
              background: 'var(--color-accent-soft)',
              border: '1px solid rgba(79,140,255,0.15)',
              marginBottom: '32px', cursor: 'pointer',
            }}
          >
            <span style={{
              padding: '4px 12px', borderRadius: '100px', fontSize: '11px',
              fontWeight: 700, background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
              color: '#fff', letterSpacing: '0.03em',
            }}>NEW</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              AI Agent v3.0 is here — 2x faster predictions
            </span>
            <ChevronRight size={14} style={{ color: 'var(--color-accent)' }} />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800,
              lineHeight: 1.05, letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}
          >
            <span style={{ color: 'var(--color-text)' }}>
              Invest Smarter with{' '}
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4f8cff, #a78bfa, #22c55e)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'gradient-shift 4s linear infinite',
            }}>
              <TypeWriter
                words={['Artificial Intelligence', 'Neural Networks', 'Smart Agents', 'Machine Learning']}
                speed={70}
                pause={2500}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.7,
              color: 'var(--color-text-muted)', maxWidth: '680px',
              margin: '0 auto 44px', fontWeight: 400,
            }}
          >
            Deploy autonomous AI agents that analyze markets, predict trends, 
            and manage your portfolio 24/7 — achieving returns that outperform 
            traditional strategies by <strong style={{ color: 'var(--color-accent)', fontWeight: 600 }}>42%</strong>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '16px', flexWrap: 'wrap', marginBottom: '60px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(79, 140, 255, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              id="landing-hero-cta"
              style={{
                padding: '16px 36px', borderRadius: '16px', fontSize: '16px',
                fontWeight: 700, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
                color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 4px 24px rgba(79, 140, 255, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <Sparkles size={18} />
              Start Investing with AI
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, background: 'var(--color-surface-hover)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '16px 36px', borderRadius: '16px', fontSize: '16px',
                fontWeight: 600, cursor: 'pointer',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.3s ease',
              }}
            >
              <Play size={16} style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Social Proof Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '32px', flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                {['#4f8cff', '#22c55e', '#a78bfa', '#f59e0b', '#ef4444'].map((c, i) => (
                  <div key={i} style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--color-bg)',
                    background: `linear-gradient(135deg, ${c}, ${c}dd)`,
                    marginLeft: i > 0 ? '-10px' : 0, zIndex: 5 - i,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: '#fff',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                <strong style={{ color: 'var(--color-text)' }}>847K+</strong> active traders
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 14px', borderRadius: '10px',
              background: 'var(--color-green-soft)',
            }}>
              <Star size={14} style={{ color: 'var(--color-green)', fill: 'var(--color-green)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-green)' }}>4.9/5</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                (12K reviews)
              </span>
            </div>
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: '80px', position: 'relative',
              borderRadius: '24px', overflow: 'hidden',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-solid)',
              boxShadow: `0 40px 100px -20px rgba(79, 140, 255, 0.15), 
                          0 20px 50px -10px var(--color-shadow)`,
              padding: '2px',
            }}
          >
            {/* Fake Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              <div style={{
                marginLeft: '16px', padding: '6px 32px', borderRadius: '8px',
                background: 'var(--color-input-bg)', fontSize: '12px',
                color: 'var(--color-text-dim)', flex: 1, textAlign: 'center',
              }}>
                app.aiinvest.com/dashboard
              </div>
            </div>
            {/* Dashboard Mock */}
            <div style={{
              padding: '24px', display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px',
            }} className="landing-hero-grid">
              {/* Stat Cards */}
              {[
                { label: 'Total Value', value: '$284,520', change: '+12.4%', color: '#22c55e', icon: Wallet },
                { label: "Today's P&L", value: '+$3,847', change: '+1.35%', color: '#22c55e', icon: TrendingUp },
                { label: 'Active Agents', value: '5 / 5', change: 'Running', color: '#4f8cff', icon: Bot },
                { label: 'Win Rate', value: '73.2%', change: '+2.1%', color: '#a78bfa', icon: Target },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  style={{
                    padding: '20px', borderRadius: '16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{card.label}</span>
                    <card.icon size={16} style={{ color: card.color }} />
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{card.value}</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: card.color }}>{card.change}</span>
                </motion.div>
              ))}
            </div>
              {/* Chart Area */}
            <div style={{
              margin: '0 24px 24px', padding: '24px', borderRadius: '16px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              height: '200px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Portfolio Performance (6M)
              </div>
              {/* SVG Chart */}
              <svg width="100%" height="140" viewBox="0 0 800 140" preserveAspectRatio="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C100,100 150,80 200,85 C250,90 300,40 400,50 C500,60 550,20 600,15 C650,10 700,30 750,10 L800,5 L800,140 L0,140 Z"
                  fill="url(#heroChartGrad)"
                />
                <path
                  d="M0,120 C100,100 150,80 200,85 C250,90 300,40 400,50 C500,60 550,20 600,15 C650,10 700,30 750,10 L800,5"
                  fill="none" stroke="#4f8cff" strokeWidth="2.5"
                />
                <circle cx="800" cy="5" r="4" fill="#4f8cff">
                  <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ STATS BAR ═══ */}
      <RevealSection
        style={{
          padding: '80px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px',
        }} className="landing-stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                textAlign: 'center', padding: '32px 24px', borderRadius: '20px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'var(--color-accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <stat.icon size={22} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div style={{
                fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em',
                color: 'var(--color-text)', marginBottom: '4px',
              }}>
                <AnimatedCounter end={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══ FEATURES SECTION ═══ */}
      <RevealSection
        id="features"
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'var(--color-accent-soft)',
                border: '1px solid rgba(79,140,255,0.12)',
                marginBottom: '20px', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-accent)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} /> Capabilities
            </motion.div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px',
              color: 'var(--color-text)',
            }}>
              The Future of Investing,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Today</span>
            </h2>
            <p style={{
              fontSize: '17px', color: 'var(--color-text-muted)',
              maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
            }}>
              Harness the power of artificial intelligence to make smarter investment 
              decisions backed by real-time data analysis.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px',
          }} className="landing-features-grid">
            {features.map((feature, i) => (
              <GlowCard key={i} delay={i * 0.1} glowColor={feature.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(', ')}>
                <div style={{ padding: '36px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: feature.gradient, marginBottom: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 24px ${feature.color}33`,
                  }}>
                    <feature.icon size={26} style={{ color: '#fff' }} />
                  </div>
                  <h3 style={{
                    fontSize: '22px', fontWeight: 700, marginBottom: '12px',
                    letterSpacing: '-0.01em', color: 'var(--color-text)',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-muted)',
                  }}>
                    {feature.desc}
                  </p>
                  <div style={{
                    marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '14px', fontWeight: 600, color: feature.color,
                    cursor: 'pointer',
                  }}>
                    Learn more <ArrowUpRight size={15} />
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ HOW IT WORKS ═══ */}
      <RevealSection
        id="how-it-works"
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'var(--color-green-soft)',
                border: '1px solid rgba(34,197,94,0.12)',
                marginBottom: '20px', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-green)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Cpu size={14} /> How It Works
            </motion.div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px',
              color: 'var(--color-text)',
            }}>
              Start in{' '}
              <span style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>4 Simple Steps</span>
            </h2>
            <p style={{
              fontSize: '17px', color: 'var(--color-text-muted)',
              maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
            }}>
              Go from zero to fully automated investing in under 5 minutes.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px',
            position: 'relative',
          }} className="landing-steps-grid">

            {/* Connecting Line */}
            <div style={{
              position: 'absolute', top: '60px', left: '12.5%', right: '12.5%',
              height: '2px', background: 'linear-gradient(90deg, var(--color-border), var(--color-accent), var(--color-border))',
              zIndex: 0,
            }} className="landing-steps-line" />

            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  textAlign: 'center', position: 'relative', zIndex: 1,
                }}
              >
                {/* Step Number */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: i <= 1
                    ? 'linear-gradient(135deg, #4f8cff, #6366f1)'
                    : i === 2
                      ? 'linear-gradient(135deg, #a78bfa, #7c3aed)'
                      : 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: `0 8px 24px ${i <= 1 ? 'rgba(79,140,255,0.3)' : i === 2 ? 'rgba(167,139,250,0.3)' : 'rgba(34,197,94,0.3)'}`,
                }}>
                  <item.icon size={28} style={{ color: '#fff' }} />
                </div>
                <h3 style={{
                  fontSize: '18px', fontWeight: 700, marginBottom: '8px',
                  color: 'var(--color-text)',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-muted)',
                  maxWidth: '220px', margin: '0 auto',
                }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ INTERACTIVE FEATURE SHOWCASE ═══ */}
      <RevealSection
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px',
          alignItems: 'center',
        }} className="landing-showcase-grid">
          {/* Left: Feature Tabs */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'var(--color-purple-soft)',
                border: '1px solid rgba(167,139,250,0.12)',
                marginBottom: '20px', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-purple)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Activity size={14} /> Deep Dive
            </motion.div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '40px',
              color: 'var(--color-text)',
            }}>
              Intelligence That{' '}<br />
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa, #f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Adapts & Evolves</span>
            </h2>

            {features.map((feature, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveFeature(i)}
                whileHover={{ x: 8 }}
                style={{
                  padding: '20px 24px', borderRadius: '16px', cursor: 'pointer',
                  marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '16px',
                  background: activeFeature === i ? 'var(--color-surface)' : 'transparent',
                  border: `1px solid ${activeFeature === i ? 'var(--color-border-hover)' : 'transparent'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: activeFeature === i ? feature.gradient : 'var(--color-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <feature.icon size={20} style={{
                    color: activeFeature === i ? '#fff' : 'var(--color-text-muted)',
                    transition: 'all 0.3s ease',
                  }} />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '15px', fontWeight: 600, marginBottom: '4px',
                    color: activeFeature === i ? 'var(--color-text)' : 'var(--color-text-secondary)',
                    transition: 'color 0.3s ease',
                  }}>{feature.title}</h4>
                  {activeFeature === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        fontSize: '13px', lineHeight: 1.6,
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {feature.desc}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Live Preview Card */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                style={{
                  padding: '40px', borderRadius: '24px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: `0 20px 60px var(--color-shadow)`,
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  background: features[activeFeature].gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '28px',
                  boxShadow: `0 12px 32px ${features[activeFeature].color}33`,
                }}>
                  {(() => { const Icon = features[activeFeature].icon; return <Icon size={30} style={{ color: '#fff' }} />; })()}
                </div>
                <h3 style={{
                  fontSize: '26px', fontWeight: 700, marginBottom: '16px',
                  letterSpacing: '-0.02em', color: 'var(--color-text)',
                }}>
                  {features[activeFeature].title}
                </h3>
                <p style={{
                  fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-muted)',
                  marginBottom: '28px',
                }}>
                  {features[activeFeature].desc}
                </p>

                {/* Fake metric bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Accuracy', value: 94, color: features[activeFeature].color },
                    { label: 'Speed', value: 87, color: '#4f8cff' },
                    { label: 'Reliability', value: 99, color: '#22c55e' },
                  ].map((bar, i) => (
                    <div key={i}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', marginBottom: '6px',
                        fontSize: '13px', color: 'var(--color-text-muted)',
                      }}>
                        <span>{bar.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{bar.value}%</span>
                      </div>
                      <div style={{
                        height: '6px', borderRadius: '100px',
                        background: 'var(--color-input-bg)',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            height: '100%', borderRadius: '100px',
                            background: `linear-gradient(90deg, ${bar.color}, ${bar.color}cc)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </RevealSection>

      {/* ═══ TESTIMONIALS ═══ */}
      <RevealSection
        id="testimonials"
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'var(--color-amber-soft)',
                border: '1px solid rgba(245,158,11,0.12)',
                marginBottom: '20px', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-amber)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <Award size={14} /> Testimonials
            </motion.div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px',
              color: 'var(--color-text)',
            }}>
              Trusted by{' '}
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Industry Leaders</span>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
          }} className="landing-testimonials-grid">
            {testimonials.map((t, i) => (
              <GlowCard key={i} delay={i * 0.15}
                glowColor={['79, 140, 255', '167, 139, 250', '245, 158, 11'][i]}
              >
                <div style={{ padding: '32px' }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                    {Array.from({ length: t.rating }, (_, j) => (
                      <Star key={j} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '15px', lineHeight: 1.7, color: 'var(--color-text-secondary)',
                    marginBottom: '24px', fontStyle: 'italic',
                  }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#4f8cff', '#a78bfa', '#f59e0b'][i]}, ${['#6366f1', '#7c3aed', '#ef4444'][i]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 700, color: '#fff',
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ PRICING ═══ */}
      <RevealSection
        id="pricing"
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'var(--color-accent-soft)',
                border: '1px solid rgba(79,140,255,0.12)',
                marginBottom: '20px', fontSize: '12px', fontWeight: 600,
                color: 'var(--color-accent)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <PieChart size={14} /> Pricing
            </motion.div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px',
              color: 'var(--color-text)',
            }}>
              Simple,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4f8cff, #22c55e)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Transparent</span> Pricing
            </h2>
            <p style={{
              fontSize: '17px', color: 'var(--color-text-muted)',
              maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
            }}>
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
            alignItems: 'stretch',
          }} className="landing-pricing-grid">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                style={{
                  padding: plan.popular ? '4px' : '0',
                  borderRadius: '28px',
                  background: plan.popular
                    ? 'linear-gradient(135deg, #4f8cff, #a78bfa, #22c55e)'
                    : 'transparent',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    padding: '6px 20px', borderRadius: '100px', fontSize: '12px',
                    fontWeight: 700, background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
                    color: '#fff', letterSpacing: '0.03em', zIndex: 2,
                    boxShadow: '0 4px 16px rgba(79,140,255,0.3)',
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{
                  padding: '40px 32px', borderRadius: '24px',
                  background: 'var(--color-surface-solid)',
                  border: plan.popular ? 'none' : '1px solid var(--color-border)',
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}>
                  <h3 style={{
                    fontSize: '20px', fontWeight: 700, marginBottom: '8px',
                    color: 'var(--color-text)',
                  }}>{plan.name}</h3>
                  <p style={{
                    fontSize: '13px', color: 'var(--color-text-muted)',
                    marginBottom: '24px',
                  }}>{plan.desc}</p>
                  <div style={{ marginBottom: '28px' }}>
                    <span style={{
                      fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em',
                      color: 'var(--color-text)',
                    }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    marginBottom: '32px', flex: 1,
                  }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: '14px', color: 'var(--color-text-secondary)',
                      }}>
                        <Check size={16} style={{
                          color: plan.popular ? '#4f8cff' : 'var(--color-green)',
                          flexShrink: 0,
                        }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    style={{
                      padding: '14px', borderRadius: '14px', fontSize: '14px',
                      fontWeight: 600, cursor: 'pointer', width: '100%',
                      border: plan.popular ? 'none' : '1px solid var(--color-border)',
                      background: plan.popular
                        ? 'linear-gradient(135deg, #4f8cff, #6366f1)'
                        : 'transparent',
                      color: plan.popular ? '#fff' : 'var(--color-text)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ FINAL CTA ═══ */}
      <RevealSection
        style={{
          padding: '100px 40px', position: 'relative', zIndex: 2,
        }}
      >
        <div style={{
          maxWidth: '800px', margin: '0 auto', textAlign: 'center',
          padding: '80px 60px', borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(167,139,250,0.08))',
          border: '1px solid rgba(79,140,255,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative Orb */}
          <div style={{
            position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,140,255,0.1), transparent)',
            top: '-100px', right: '-100px', filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.1), transparent)',
            bottom: '-80px', left: '-80px', filter: 'blur(40px)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 12px 32px rgba(79,140,255,0.3)',
            }}>
              <Rocket size={32} style={{ color: '#fff' }} />
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px',
              color: 'var(--color-text)',
            }}>
              Ready to Transform<br />Your Investments?
            </h2>
            <p style={{
              fontSize: '17px', color: 'var(--color-text-muted)',
              maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7,
            }}>
              Join 847,000+ traders who are already using AI to generate 
              superior returns. Start free, no credit card required.
            </p>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(79, 140, 255, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              id="landing-final-cta"
              style={{
                padding: '18px 48px', borderRadius: '16px', fontSize: '16px',
                fontWeight: 700, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #4f8cff, #6366f1)',
                color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 4px 24px rgba(79, 140, 255, 0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              <Sparkles size={18} />
              Get Started — It's Free
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </RevealSection>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: '80px 40px 40px', position: 'relative', zIndex: 2,
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '48px', marginBottom: '64px',
          }} className="landing-footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={20} style={{ color: '#fff' }} />
                </div>
                <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
                  AI Invest
                </span>
              </div>
              <p style={{
                fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-muted)',
                maxWidth: '280px', marginBottom: '24px',
              }}>
                The most advanced AI-powered investment platform. 
                Making institutional-grade intelligence accessible to everyone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['X', 'in', 'GH', 'YT'].map((social, i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }} className="landing-social-btn">
                    {social}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Agents', 'Simulator', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'Status', 'Contact', 'Security'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{
                  fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em',
                  textTransform: 'uppercase', color: 'var(--color-text-muted)',
                  marginBottom: '20px',
                }}>
                  {col.title}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.links.map((link, j) => (
                    <a key={j} href="#" style={{
                      fontSize: '14px', color: 'var(--color-text-secondary)',
                      textDecoration: 'none', transition: 'color 0.2s ease',
                    }} className="landing-footer-link">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '32px', borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>
              © 2026 AI Invest. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy', 'Terms', 'Cookies'].map((link, i) => (
                <a key={i} href="#" style={{
                  fontSize: '13px', color: 'var(--color-text-dim)',
                  textDecoration: 'none',
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
