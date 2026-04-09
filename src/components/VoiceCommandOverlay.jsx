import { motion } from 'framer-motion';
import { Mic, MicOff, X } from 'lucide-react';

export default function VoiceCommandOverlay({ isListening, transcript, lastCommand, onStop }) {
  if (!isListening) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {/* Animated mic */}
        <div style={{ position: 'relative' }}>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: '#4f8cff' }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            style={{ position: 'absolute', inset: '-40px', borderRadius: '50%', background: '#4f8cff' }} />
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f8cff, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Mic style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>Listening...</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Say a command like "open portfolio" or "go to heatmap"</p>
        </div>

        {transcript && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '12px 24px', borderRadius: '12px', background: 'rgba(79,140,255,0.15)', border: '1px solid rgba(79,140,255,0.2)', fontSize: '16px', fontWeight: 500, color: '#4f8cff' }}>
            "{transcript}"
          </motion.div>
        )}

        {lastCommand && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            {lastCommand}
          </motion.div>
        )}

        <button onClick={onStop}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer', marginTop: '16px' }}>
          <X style={{ width: '14px', height: '14px' }} /> Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
