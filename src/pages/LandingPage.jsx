import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowRight, BookOpen, FlaskConical, TrendingUp,
  Bot, Shield, Target, Moon, Sun, ChevronDown,
} from 'lucide-react';

/* ─── Subtle Particle Background ─── */
function ParticleBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const isDark = theme === 'dark';
    const color = isDark ? '59, 130, 246' : '37, 99, 235';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

/* ─── Animated Counter ─── */
function Counter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── Section Wrapper ─── */
function Section({ children, style, ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ maxWidth: 1000, margin: '0 auto', padding: '0 var(--space-8)', ...style }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/* ═══════ LANDING PAGE ═══════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      <ParticleBackground />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64, padding: '0 var(--space-8)',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--color-trust), var(--color-ai))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 700, color: '#fff',
          }}>◇</div>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Bharat InvestAI
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button onClick={toggleTheme} className="btn-ghost" style={{ width: 36, height: 36, padding: 0 }}>
            {theme === 'dark' ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary" style={{ height: 36, fontSize: '13px' }}>
            Log in
          </button>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ height: 36, fontSize: '13px' }}>
            Start Learning
          </button>
        </div>
      </nav>

      {/* ══ SECTION 1: THE OPENING STATEMENT ══ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        position: 'relative', padding: '0 var(--space-8)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 700 }}
        >
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-trust)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Financial Literacy for Viksit Bharat 2047
          </p>
          <h1 className="heading-tight" style={{ fontSize: 'clamp(32px, 5vw, var(--text-5xl))', lineHeight: 1.1, marginBottom: 'var(--space-6)' }}>
            India has 140 crore people.{' '}
            <span style={{ color: 'var(--text-tertiary)' }}>
              Only 4 crore invest in stocks.
            </span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 'var(--space-10)' }}>
            The gap isn't money. It's knowledge.<br />
            Bharat InvestAI teaches you to invest — without risking a single rupee.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ height: 48, padding: '0 32px', fontSize: '15px', borderRadius: 'var(--radius-sm)' }}>
              Begin Your Journey <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <a href="#how-it-works" className="btn-secondary" style={{ height: 48, padding: '0 28px', fontSize: '15px' }}>
              Learn More
            </a>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 40 }}
        >
          <ChevronDown style={{ width: 24, height: 24, color: 'var(--text-ghost)' }} />
        </motion.div>
      </section>

      {/* ══ SECTION 2: THE PROBLEM ══ */}
      <Section style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-danger)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          The Problem
        </p>
        <h2 className="heading-tight" style={{ fontSize: 'clamp(28px, 4vw, var(--text-4xl))', lineHeight: 1.15, marginBottom: 'var(--space-8)' }}>
          Financial literacy in India is at{' '}
          <span className="mono-number" style={{ color: 'var(--color-danger)' }}>
            <Counter end={27} suffix="%" />
          </span>
        </h2>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          That means 3 out of 4 Indians cannot plan their own financial future. Not because they lack intelligence — because they lack access to clear, patient, jargon-free financial education.
        </p>
      </Section>

      {/* ══ SECTION 3: THE SOLUTION ══ */}
      <Section style={{ paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-growth)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          The Solution
        </p>
        <h2 className="heading-tight" style={{ fontSize: 'clamp(24px, 3.5vw, var(--text-3xl))', marginBottom: 'var(--space-12)' }}>
          An AI mentor that teaches you to build wealth — one lesson at a time
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { icon: BookOpen, label: 'Learn', desc: '7 structured paths from savings basics to portfolio theory. Every lesson uses Indian examples.', color: 'var(--color-growth)' },
            { icon: FlaskConical, label: 'Practice', desc: 'SIP calculators, goal planners, and a virtual portfolio with ₹1,00,000 play money.', color: 'var(--color-learning)' },
            { icon: TrendingUp, label: 'Grow', desc: 'Track your literacy score, earn XP, unlock achievements, and build real financial confidence.', color: 'var(--color-trust)' },
          ].map((item) => (
            <div key={item.label} className="panel" style={{ textAlign: 'left', padding: 'var(--space-6)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}>
                <item.icon style={{ width: 20, height: 20, color: item.color }} />
              </div>
              <h3 className="heading-tight" style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-2)' }}>
                {item.label}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══ SECTION 4: HOW IT WORKS ══ */}
      <Section id="how-it-works" style={{ paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-ai)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          How It Works
        </p>
        <h2 className="heading-tight" style={{ fontSize: 'clamp(24px, 3.5vw, var(--text-3xl))', marginBottom: 'var(--space-12)' }}>
          Your journey in 4 steps
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: 520, margin: '0 auto', textAlign: 'left' }}>
          {[
            { step: '01', title: 'Take a 2-minute assessment', desc: 'We find your starting point. No judgement. Just clarity.' },
            { step: '02', title: 'Get a personalized learning path', desc: 'AI recommends what to learn based on your knowledge and goals.' },
            { step: '03', title: 'Practice with virtual ₹1,00,000', desc: 'Build portfolios, run SIP simulations, plan goals — risk-free.' },
            { step: '04', title: 'Build real financial confidence', desc: 'Earn certificates, track your literacy score, share your progress.' },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: 'var(--space-5)' }}
            >
              <span className="mono-number" style={{
                fontSize: 'var(--text-sm)', fontWeight: 600,
                color: 'var(--color-ai)', flexShrink: 0, paddingTop: 2,
              }}>
                {item.step}
              </span>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ══ SECTION 5: AI DIFFERENCE ══ */}
      <Section style={{ paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-ai)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          AI-Powered Mentoring
        </p>
        <h2 className="heading-tight" style={{ fontSize: 'clamp(24px, 3.5vw, var(--text-3xl))', marginBottom: 'var(--space-12)' }}>
          Ask anything. Learn everything.
        </h2>
        <div className="panel" style={{ maxWidth: 560, margin: '0 auto', padding: 'var(--space-6)', textAlign: 'left' }}>
          {/* Mock conversation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* User */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                padding: '12px 16px', borderRadius: '16px 16px 4px 16px',
                background: 'var(--color-trust)', color: '#fff',
                fontSize: 'var(--text-sm)', maxWidth: '75%',
              }}>
                What is the safest way to save for my daughter's education?
              </div>
            </div>
            {/* AI */}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 'var(--radius-full)', flexShrink: 0,
                background: 'var(--color-ai-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot style={{ width: 14, height: 14, color: 'var(--color-ai)' }} />
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                background: 'var(--bg-tertiary)',
                fontSize: 'var(--text-sm)', lineHeight: 1.7, maxWidth: '80%',
              }}>
                <p style={{ marginBottom: 8 }}>Great question! For a goal 15+ years away, consider:</p>
                <p style={{ marginBottom: 4 }}>• <strong>Sukanya Samriddhi Yojana</strong> — 8.2% guaranteed, tax-free</p>
                <p style={{ marginBottom: 4 }}>• <strong>ELSS + PPF combo</strong> — equity growth with tax benefits</p>
                <p style={{ marginBottom: 8 }}>• <strong>SIP in index funds</strong> — NIFTY 50 has averaged ~12% over 20 years</p>
                <p style={{ color: 'var(--color-ai)', fontSize: '12px', fontWeight: 500, marginTop: 8 }}>
                  💡 Want me to calculate how much you'd need to start saving monthly?
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══ SECTION 6: SDG ALIGNMENT ══ */}
      <Section style={{ paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-learning)', marginBottom: 'var(--space-6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Aligned with National Mission
        </p>
        <h2 className="heading-tight" style={{ fontSize: 'clamp(24px, 3.5vw, var(--text-3xl))', marginBottom: 'var(--space-4)' }}>
          Built for Viksit Bharat 2047
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-10)', maxWidth: 520, margin: '0 auto var(--space-10)' }}>
          Every feature maps to the United Nations Sustainable Development Goals.
        </p>
        {/* Tricolor accent line */}
        <div style={{ width: 120, height: 3, margin: '0 auto var(--space-10)', borderRadius: 'var(--radius-full)', background: 'linear-gradient(90deg, #f59e0b, #ffffff, #10b981)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', maxWidth: 800, margin: '0 auto' }}>
          {[
            { sdg: 'SDG 4', title: 'Quality Education', desc: 'Structured financial literacy curriculum' },
            { sdg: 'SDG 8', title: 'Decent Work & Growth', desc: 'Economic participation through investing' },
            { sdg: 'SDG 9', title: 'Innovation', desc: 'AI-powered educational technology' },
            { sdg: 'SDG 10', title: 'Reduced Inequalities', desc: 'Free access, multi-language support' },
          ].map((item) => (
            <div key={item.sdg} style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
              <div className="sdg-badge" style={{
                background: 'var(--color-trust-soft)', color: 'var(--color-trust)',
                margin: '0 auto var(--space-3)', width: 'fit-content',
              }}>
                {item.sdg}
              </div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══ SECTION 7: CTA ══ */}
      <section style={{
        padding: 'var(--space-24) var(--space-8)',
        textAlign: 'center', position: 'relative',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-tight" style={{ fontSize: 'clamp(28px, 4vw, var(--text-4xl))', marginBottom: 'var(--space-4)' }}>
            Financial freedom starts with<br />financial knowledge.
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
            Join the mission. Start learning today — it's free.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{ height: 52, padding: '0 36px', fontSize: '16px', borderRadius: 'var(--radius-sm)' }}
          >
            Start Learning — It's Free <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--text-ghost)' }}>
          Bharat InvestAI — PBL Project · Viksit Bharat @2047 + SDG Alignment · Built with 🇮🇳
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-ghost)', marginTop: 'var(--space-2)' }}>
          This platform is for educational purposes only. No real financial advice is provided.
        </p>
      </footer>
    </div>
  );
}
