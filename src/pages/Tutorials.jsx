import { useState } from 'react';
import { motion } from 'framer-motion';
import { tutorialTracks } from '../data/educationData';
import { GraduationCap, ChevronRight, Check, BookOpen, Play } from 'lucide-react';

export default function Tutorials() {
  const [selected, setSelected] = useState(tutorialTracks[0]);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f8cff, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #4f8cff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interactive Tutorials</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Step-by-step guides from beginner to pro</p>
          </div>
        </div>
      </div>

      {/* Track Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {tutorialTracks.map((track, idx) => (
          <motion.div key={track.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            onClick={() => { setSelected(track); setCurrentStep(0); }}
            style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', background: selected.id === track.id ? `${track.color}10` : 'rgba(255,255,255,0.03)', border: `1px solid ${selected.id === track.id ? `${track.color}25` : 'rgba(255,255,255,0.05)'}`, transition: 'all 200ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>{track.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: `${track.color}15`, color: track.color }}>{track.level}</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{track.title}</h3>
            <p style={{ fontSize: '11px', color: 'var(--color-text-dim)', lineHeight: 1.5, marginBottom: '12px' }}>{track.description}</p>
            <div style={{ width: '100%', height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ width: `${track.progress}%`, height: '100%', borderRadius: '999px', background: track.color, transition: 'width 500ms' }} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '4px', display: 'block' }}>{track.progress}% complete</span>
          </motion.div>
        ))}
      </div>

      {/* Step detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
        {/* Step list */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)', display: 'block', marginBottom: '16px' }}>Steps</span>
          {selected.steps.map((step, idx) => {
            const isComplete = idx < Math.ceil(selected.progress / 100 * selected.steps.length);
            const isCurrent = idx === currentStep;
            return (
              <div key={idx} onClick={() => setCurrentStep(idx)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px', background: isCurrent ? `${selected.color}10` : 'transparent', border: `1px solid ${isCurrent ? `${selected.color}20` : 'transparent'}` }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isComplete ? `${selected.color}20` : 'rgba(255,255,255,0.05)', color: isComplete ? selected.color : 'var(--color-text-dim)', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                  {isComplete ? <Check style={{ width: '12px', height: '12px' }} /> : idx + 1}
                </div>
                <span style={{ fontSize: '12px', fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{step.title}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div key={currentStep} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BookOpen style={{ width: '16px', height: '16px', color: selected.color }} />
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: selected.color }}>Step {currentStep + 1} of {selected.steps.length}</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>{selected.steps[currentStep].title}</h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{selected.steps[currentStep].content}</p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
            <button disabled={currentStep === 0} onClick={() => setCurrentStep(p => p - 1)}
              style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}>
              Previous
            </button>
            <button onClick={() => setCurrentStep(p => Math.min(selected.steps.length - 1, p + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`, color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {currentStep < selected.steps.length - 1 ? 'Next Step' : 'Complete'} <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
