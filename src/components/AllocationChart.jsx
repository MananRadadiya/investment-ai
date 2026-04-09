import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChartIcon, Target } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CUSTOM SVG DONUT CHART — Pure SVG, no Recharts
   ═══════════════════════════════════════════════════════════════ */

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const spread = endAngle - startAngle;
  if (spread <= 0) return '';
  if (spread >= 359.99) {
    const mid = startAngle + 179.99;
    const s = polarToCartesian(cx, cy, radius, startAngle);
    const m = polarToCartesian(cx, cy, radius, mid);
    const e = polarToCartesian(cx, cy, radius, endAngle - 0.01);
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 1 1 ${m.x} ${m.y} A ${radius} ${radius} 0 0 1 ${e.x} ${e.y}`;
  }
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArc = spread > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function donutSlicePath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const spread = endAngle - startAngle;
  if (spread <= 0) return '';
  
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = spread > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    `Z`
  ].join(' ');
}

/* ─── Single Donut Slice ─── */
function DonutSlice({ cx, cy, innerR, outerR, startAngle, endAngle, color, isActive, dimmed, onMouseEnter, onMouseLeave, idx }) {
  const gap = 1.5; // degree gap between slices
  const sa = startAngle + gap;
  const ea = endAngle - gap;
  if (ea <= sa) return null;

  const activeInner = innerR - 3;
  const activeOuter = outerR + 6;
  const finalInner = isActive ? activeInner : innerR;
  const finalOuter = isActive ? activeOuter : outerR;

  const path = donutSlicePath(cx, cy, finalInner, finalOuter, sa, ea);

  return (
    <motion.path
      d={path}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        opacity: dimmed ? 0.25 : isActive ? 0.95 : 0.8,
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.15 + idx * 0.08 },
      }}
      style={{
        cursor: 'pointer',
        filter: isActive ? `drop-shadow(0 0 8px ${color}60)` : 'none',
        transition: 'filter 200ms ease',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

/* ─── Legend Item ─── */
function LegendItem({ item, idx, isHovered, onHover }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 + idx * 0.06 }}
      onMouseEnter={() => onHover(idx)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '12px',
        cursor: 'pointer',
        background: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: isHovered ? `1px solid ${item.color}20` : '1px solid transparent',
        transition: 'all 200ms ease',
        marginBottom: '4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: item.color || '#4f8cff',
            boxShadow: isHovered ? `0 0 8px ${item.color}60` : 'none',
            transition: 'box-shadow 200ms',
          }}
        />
        <div>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: isHovered ? 'var(--color-text)' : 'var(--color-text-muted)',
            transition: 'color 200ms',
          }}>
            {item.symbol}
          </span>
          {item.name && (
            <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '1px' }}>
              {item.name}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '48px',
          height: '4px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.value}%` }}
            transition={{ duration: 0.6, delay: 0.5 + idx * 0.06 }}
            style={{
              height: '100%',
              borderRadius: '999px',
              background: item.color || '#4f8cff',
            }}
          />
        </div>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: isHovered ? item.color : 'var(--color-text)',
          transition: 'color 200ms',
          minWidth: '36px',
          textAlign: 'right',
        }}>
          {item.value}%
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AllocationChart({ allocation = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => allocation.map((a) => ({
    ...a,
    value: +(a.allocation * 100).toFixed(1),
  })), [allocation]);

  const totalAssets = data.length;

  // Compute angles for each segment
  const segments = useMemo(() => {
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    if (totalValue === 0) return [];
    let currentAngle = 0;
    return data.map((d) => {
      const sweep = (d.value / totalValue) * 360;
      const seg = {
        ...d,
        startAngle: currentAngle,
        endAngle: currentAngle + sweep,
      };
      currentAngle += sweep;
      return seg;
    });
  }, [data]);

  const SIZE = 200;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const INNER_R = 56;
  const OUTER_R = 82;

  const activeSegment = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '0',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PieChartIcon style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Portfolio Allocation</div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
              {totalAssets} assets optimized
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '10px',
          background: 'rgba(167,139,250,0.1)',
          border: '1px solid rgba(167,139,250,0.15)',
        }}>
          <Target style={{ width: '12px', height: '12px', color: '#a78bfa' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa' }}>Balanced</span>
        </div>
      </div>

      {data.length > 0 ? (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Custom SVG Donut */}
            <div style={{ width: `${SIZE}px`, height: `${SIZE}px`, flexShrink: 0, position: 'relative' }}>
              <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ overflow: 'visible' }}
              >
                {/* Background ring */}
                <circle
                  cx={CX} cy={CY} r={(INNER_R + OUTER_R) / 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth={OUTER_R - INNER_R}
                />

                {/* Data slices */}
                {mounted && segments.map((seg, idx) => (
                  <DonutSlice
                    key={idx}
                    cx={CX} cy={CY}
                    innerR={INNER_R}
                    outerR={OUTER_R}
                    startAngle={seg.startAngle}
                    endAngle={seg.endAngle}
                    color={seg.color || '#4f8cff'}
                    isActive={hoveredIndex === idx}
                    dimmed={hoveredIndex !== null && hoveredIndex !== idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    idx={idx}
                  />
                ))}

                {/* Glow ring for hovered */}
                {hoveredIndex !== null && segments[hoveredIndex] && (() => {
                  const seg = segments[hoveredIndex];
                  const gap = 1.5;
                  const sa = seg.startAngle + gap;
                  const ea = seg.endAngle - gap;
                  if (ea <= sa) return null;
                  const arcPath = describeArc(CX, CY, OUTER_R + 12, sa, ea);
                  return (
                    <motion.path
                      key={`glow-${hoveredIndex}`}
                      d={arcPath}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  );
                })()}
              </svg>

              {/* Center text overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <AnimatePresence mode="wait">
                  {activeSegment ? (
                    <motion.div
                      key={activeSegment.symbol}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      style={{ textAlign: 'center' }}
                    >
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        lineHeight: 1,
                      }}>
                        {activeSegment.symbol}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: activeSegment.color,
                        fontFamily: 'var(--font-mono)',
                        marginTop: '4px',
                      }}>
                        {activeSegment.value}%
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ textAlign: 'center' }}
                    >
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font-mono)',
                        display: 'block',
                      }}>
                        {totalAssets}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--color-text-dim)',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                      }}>
                        ASSETS
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Legend */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {data.map((item, idx) => (
                <LegendItem
                  key={idx}
                  item={item}
                  idx={idx}
                  isHovered={hoveredIndex === idx}
                  onHover={setHoveredIndex}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-dim)',
          fontSize: '13px',
          padding: '24px',
        }}>
          No allocation data
        </div>
      )}
    </motion.div>
  );
}
