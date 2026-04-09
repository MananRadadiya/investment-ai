import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import { exportAsJSON, importFromJSON, exportPortfolioReport } from '../utils/chartExport';
import { useMarketData } from '../hooks/useMarketData';
import { Download, Upload, FileJson, FileText, Check, AlertTriangle } from 'lucide-react';

export default function ExportImport() {
  const { portfolio } = usePortfolio();
  const assets = useMarketData();
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  const exportData = () => {
    const data = {
      portfolio, settings: JSON.parse(localStorage.getItem('ai-invest-settings') || '{}'),
      alerts: JSON.parse(localStorage.getItem('ai-invest-smart-alerts') || '[]'),
      paperTrading: JSON.parse(localStorage.getItem('ai-invest-paper-trading') || '{}'),
      exportedAt: new Date().toISOString(), version: '1.0.0',
    };
    exportAsJSON(data, `ai-invest-backup-${new Date().toISOString().split('T')[0]}`);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromJSON(file);
      if (data.portfolio) { localStorage.setItem('savedPortfolio', JSON.stringify(data.portfolio)); }
      if (data.settings) { localStorage.setItem('ai-invest-settings', JSON.stringify(data.settings)); }
      if (data.alerts) { localStorage.setItem('ai-invest-smart-alerts', JSON.stringify(data.alerts)); }
      setImportResult({ success: true, message: `Imported successfully. Portfolio: ${data.portfolio?.assets?.length || 0} assets.` });
    } catch (err) {
      setImportResult({ success: false, message: err.message });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f8cff, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileJson style={{ width: '18px', height: '18px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--color-text) 0%, #14b8a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Export & Import</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-dim)' }}>Backup and restore your portfolio, settings, and alerts</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Export */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Download style={{ width: '24px', height: '24px', color: '#22c55e', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Export Data</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', lineHeight: 1.6, marginBottom: '24px' }}>Download your portfolio, settings, alerts, and paper trading data as a JSON file.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={exportData}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', justifyContent: 'center' }}>
              <FileJson style={{ width: '14px', height: '14px' }} /> Export as JSON
            </button>
            <button onClick={() => exportPortfolioReport(portfolio, assets)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(79,140,255,0.15)', background: 'rgba(79,140,255,0.08)', color: '#4f8cff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', justifyContent: 'center' }}>
              <FileText style={{ width: '14px', height: '14px' }} /> Export Report (TXT)
            </button>
          </div>
        </motion.div>

        {/* Import */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '32px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Upload style={{ width: '24px', height: '24px', color: '#4f8cff', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Import Data</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-dim)', lineHeight: 1.6, marginBottom: '24px' }}>Upload a previously exported JSON file to restore your data.</p>
          <input type="file" ref={fileRef} onChange={handleImport} accept=".json" style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4f8cff, #2563eb)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
            <Upload style={{ width: '14px', height: '14px' }} /> Choose JSON File
          </button>
          {importResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: importResult.success ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${importResult.success ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {importResult.success ? <Check style={{ width: '14px', height: '14px', color: '#22c55e' }} /> : <AlertTriangle style={{ width: '14px', height: '14px', color: '#ef4444' }} />}
              <span style={{ fontSize: '12px', color: importResult.success ? '#22c55e' : '#ef4444' }}>{importResult.message}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
