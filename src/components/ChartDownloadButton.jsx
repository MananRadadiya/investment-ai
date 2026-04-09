import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Image, FileText, Check } from 'lucide-react';
import { exportChartAsPNG, exportChartAsSVG } from '../utils/chartExport';

export default function ChartDownloadButton({ chartId, filename = 'chart', style = {} }) {
  const [open, setOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (format) => {
    if (format === 'png') await exportChartAsPNG(chartId, filename);
    else if (format === 'svg') exportChartAsSVG(chartId, filename);
    setDownloaded(true);
    setTimeout(() => { setDownloaded(false); setOpen(false); }, 1500);
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(79,140,255,0.15)', background: 'rgba(79,140,255,0.08)', color: '#4f8cff', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
        {downloaded ? <Check style={{ width: '12px', height: '12px' }} /> : <Download style={{ width: '12px', height: '12px' }} />}
        {downloaded ? 'Done!' : 'Download'}
      </button>

      <AnimatePresence>
        {open && !downloaded && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', padding: '6px', borderRadius: '10px', background: 'rgba(15,20,28,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', zIndex: 50, minWidth: '120px' }}>
            {[
              { format: 'png', icon: Image, label: 'PNG Image' },
              { format: 'svg', icon: FileText, label: 'SVG Vector' },
            ].map(opt => (
              <button key={opt.format} onClick={() => handleDownload(opt.format)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: 500, textAlign: 'left' }}>
                <opt.icon style={{ width: '12px', height: '12px', color: '#4f8cff' }} />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
