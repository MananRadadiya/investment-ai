import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Trash2 } from 'lucide-react';
import { fakeNotifications } from '../data/userData';

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ai-invest-notifications');
    return saved ? JSON.parse(saved) : fakeNotifications;
  });
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    localStorage.setItem('ai-invest-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center cursor-pointer relative"
        style={{
          width: '36px', height: '36px', borderRadius: '12px',
          border: 'none', background: 'transparent',
          color: 'var(--color-text-dim)', transition: 'all 150ms',
        }}
        id="notification-bell"
      >
        <Bell style={{ width: '16px', height: '16px' }} />
        {unreadCount > 0 && (
          <div className="notification-badge absolute flex items-center justify-center"
            style={{
              top: '4px', right: '4px', width: '16px', height: '16px',
              borderRadius: '999px', background: '#ef4444',
              fontSize: '9px', fontWeight: 700, color: 'white',
            }}>
            {unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute"
            style={{
              right: 0, top: '48px', width: '380px', zIndex: 100,
              background: 'rgba(15, 20, 28, 0.98)',
              backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
              borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between"
              style={{ padding: '20px 20px 16px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-semibold"
                    style={{
                      padding: '2px 8px', borderRadius: '999px',
                      background: 'rgba(79,140,255,0.12)', color: '#4f8cff',
                    }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center" style={{ gap: '8px' }}>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs cursor-pointer"
                    style={{
                      padding: '4px 10px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)', border: 'none',
                      color: 'var(--color-text-muted)', transition: 'all 150ms',
                    }}>
                    <Check style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                    Read all
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="cursor-pointer"
                    style={{
                      padding: '4px 8px', borderRadius: '8px',
                      background: 'none', border: 'none',
                      color: 'var(--color-text-dim)', transition: 'all 150ms',
                    }}>
                    <Trash2 style={{ width: '12px', height: '12px' }} />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0 8px 8px' }}>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center"
                  style={{ padding: '40px 20px' }}>
                  <Bell style={{ width: '28px', height: '28px', color: 'var(--color-text-dim)', opacity: 0.3, marginBottom: '12px' }} />
                  <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>All caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => markAsRead(n.id)}
                    className="flex items-start cursor-pointer group relative"
                    style={{
                      gap: '12px', padding: '14px 12px',
                      borderRadius: '12px', transition: 'background 150ms',
                      background: n.read ? 'transparent' : 'rgba(79, 140, 255, 0.04)',
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <div className="absolute" style={{ left: '4px', top: '20px', width: '6px', height: '6px', borderRadius: '999px', background: '#4f8cff' }} />
                    )}
                    <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ marginBottom: '2px' }}>{n.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-dim)', lineHeight: 1.5 }}>{n.message}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '6px', opacity: 0.6 }}>{n.time}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                      className="cursor-pointer opacity-0 group-hover:opacity-100"
                      style={{
                        padding: '4px', borderRadius: '6px',
                        background: 'none', border: 'none',
                        color: 'var(--color-text-dim)', transition: 'opacity 150ms',
                        flexShrink: 0,
                      }}>
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
