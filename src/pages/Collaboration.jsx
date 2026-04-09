import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, MessageSquare, Send, Eye } from 'lucide-react';

const FAKE_USERS = [
  { id: 1, name: 'Alice Chen', initials: 'AC', color: '#4f8cff', cursor: { x: 320, y: 180 } },
  { id: 2, name: 'Bob Turner', initials: 'BT', color: '#22c55e', cursor: { x: 550, y: 240 } },
  { id: 3, name: 'Carol Reyes', initials: 'CR', color: '#ec4899', cursor: { x: 200, y: 350 } },
];

const FAKE_MESSAGES = [
  { user: 'Alice Chen', text: 'I think we should increase BTC allocation to 25%', time: '2 min ago', color: '#4f8cff' },
  { user: 'Bob Turner', text: 'Agreed, but we need to hedge with some GOLD', time: '1 min ago', color: '#22c55e' },
  { user: 'Alice Chen', text: 'Let me run the optimizer real quick...', time: 'now', color: '#4f8cff' },
];

export default function Collaboration() {
  const [link] = useState(`https://ai-invest.app/session/${Math.random().toString(36).slice(2, 10)}`);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState(FAKE_MESSAGES);
  const [newMsg, setNewMsg] = useState('');
  const [cursorPositions, setCursorPositions] = useState(FAKE_USERS.map(u => u.cursor));

  // Simulate cursor movements
  useEffect(() => {
    const iv = setInterval(() => {
      setCursorPositions(prev => prev.map(p => ({ x: p.x + (Math.random() - 0.5) * 30, y: p.y + (Math.random() - 0.5) * 20 })));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const copyLink = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { user: 'You', text: newMsg, time: 'now', color: '#a78bfa' }]);
    setNewMsg('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real-time Collaboration</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Share your session and collaborate with others</p>
          </div>
        </div>
      </div>

      {/* Session Link */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link}</div>
        <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(79,140,255,0.1)', color: copied ? '#22c55e' : '#4f8cff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          {copied ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Collaborative Canvas */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye style={{ width: '14px', height: '14px', color: '#4f8cff' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-dim)' }}>Live Workspace</span>
            </div>
            <div style={{ display: 'flex', gap: '-4px' }}>
              {FAKE_USERS.map(u => (
                <div key={u.id} style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${u.color}25`, border: `2px solid ${u.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: u.color, marginLeft: '-4px' }}>{u.initials}</div>
              ))}
            </div>
          </div>

          {/* Simulated cursors */}
          {FAKE_USERS.map((user, idx) => (
            <motion.div key={user.id} animate={{ left: cursorPositions[idx]?.x, top: cursorPositions[idx]?.y }} transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', pointerEvents: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill={user.color}><path d="M0 0l16 6-6.5 2.5L7 16z" /></svg>
              <span style={{ position: 'absolute', left: '14px', top: '14px', fontSize: '9px', fontWeight: 600, color: user.color, background: `${user.color}15`, padding: '1px 5px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{user.name}</span>
            </motion.div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '150px', color: 'var(--color-text-dim)' }}>
            <Users style={{ width: '32px', height: '32px', margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '13px' }}>{FAKE_USERS.length + 1} viewers in this session</p>
            <p style={{ fontSize: '11px', marginTop: '4px', opacity: 0.5 }}>All changes sync in real-time</p>
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>Chat</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', marginBottom: '12px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: msg.color }}>{msg.user}</span>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-dim)' }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '6px' }}>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)', fontSize: '12px', outline: 'none' }} />
            <button type="submit" style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(79,140,255,0.15)', color: '#4f8cff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send style={{ width: '14px', height: '14px' }} />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
