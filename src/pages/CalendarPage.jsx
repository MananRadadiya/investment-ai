import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { calendarEvents, eventTypes, impactLevels } from '../data/calendarData';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthName = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = viewMonth.getDay();

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDayOfWeek, daysInMonth]);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const selectedDateStr = selectedDate ? `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}` : null;
  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const upcomingEvents = calendarEvents.filter((e) => new Date(e.date) >= today).slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Market Calendar</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Earnings, economic events, and crypto milestones</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* Calendar Grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '28px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="text-lg font-semibold">{monthName}</h2>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <button onClick={() => setMonthOffset((p) => p - 1)} className="cursor-pointer flex items-center justify-center"
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface)', border: 'none', color: 'var(--color-text-muted)' }}>
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <button onClick={() => setMonthOffset(0)} className="text-xs font-medium cursor-pointer"
                style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--color-surface)', border: 'none', color: 'var(--color-text-muted)' }}>Today</button>
              <button onClick={() => setMonthOffset((p) => p + 1)} className="cursor-pointer flex items-center justify-center"
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface)', border: 'none', color: 'var(--color-text-muted)' }}>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-xs text-center font-semibold" style={{ color: 'var(--color-text-dim)', padding: '8px 0' }}>{d}</div>
            ))}
            {days.map((day, idx) => {
              const events = getEventsForDay(day);
              const isToday = day === today.getDate() && monthOffset === 0;
              const isSelected = day === selectedDate;
              return (
                <div key={idx} onClick={() => day && setSelectedDate(isSelected ? null : day)}
                  className="flex flex-col items-center"
                  style={{
                    padding: '8px 4px', borderRadius: '10px', minHeight: '60px', cursor: day ? 'pointer' : 'default',
                    background: isSelected ? 'var(--color-accent-soft)' : isToday ? 'var(--color-surface-hover)' : 'transparent',
                    border: isToday ? '1px solid var(--color-accent)' : '1px solid transparent',
                    transition: 'all 150ms',
                  }}>
                  {day && (
                    <>
                      <span className="text-sm font-medium" style={{ color: isToday ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>{day}</span>
                      <div className="flex items-center" style={{ gap: '3px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {events.slice(0, 3).map((e, i) => (
                          <div key={i} style={{ width: '5px', height: '5px', borderRadius: '999px', background: eventTypes[e.type]?.color || '#4f8cff' }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center" style={{ gap: '20px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            {Object.entries(eventTypes).map(([key, val]) => (
              <div key={key} className="flex items-center" style={{ gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: val.color }} />
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{val.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <div>
          {/* Selected Day Events */}
          {selectedDate && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '24px', marginBottom: '16px' }}>
              <span className="section-label">
                {viewMonth.toLocaleDateString('en-US', { month: 'short' })} {selectedDate} Events
              </span>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedEvents.length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>No events on this day</p>
                ) : selectedEvents.map((event) => (
                  <div key={event.id} style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-surface-hover)', borderLeft: `3px solid ${eventTypes[event.type]?.color}` }}>
                    <div className="flex items-center" style={{ gap: '8px', marginBottom: '6px' }}>
                      <span className="text-xs font-semibold" style={{ color: eventTypes[event.type]?.color }}>{eventTypes[event.type]?.label}</span>
                      <span className="text-xs" style={{ padding: '1px 6px', borderRadius: '4px', background: `${impactLevels[event.impact]?.color}15`, color: impactLevels[event.impact]?.color }}>{event.impact}</span>
                    </div>
                    <h4 className="text-sm font-semibold" style={{ marginBottom: '4px' }}>{event.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{event.description}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '6px' }}>{event.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Events */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="panel" style={{ padding: '24px' }}>
            <span className="section-label">Upcoming Events</span>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start" style={{ gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: '4px', height: '100%', minHeight: '40px', borderRadius: '999px', background: eventTypes[event.type]?.color, flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-semibold">{event.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '2px' }}>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
