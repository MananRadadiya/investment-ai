// ─── Chart Export & Data Export Utilities ───

/**
 * Export a DOM element (chart container) as PNG
 */
export async function exportChartAsPNG(elementId, filename = 'chart') {
  const el = document.getElementById(elementId);
  if (!el) return;

  const svg = el.querySelector('svg');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);

      // Dark background
      ctx.fillStyle = '#0b0f14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL('image/png');
      downloadFile(pngUrl, `${filename}.png`);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
}

/**
 * Export SVG element directly
 */
export function exportChartAsSVG(elementId, filename = 'chart') {
  const el = document.getElementById(elementId);
  if (!el) return;

  const svg = el.querySelector('svg');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

/**
 * Export data as JSON file
 */
export function exportAsJSON(data, filename = 'export') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, `${filename}.json`);
  URL.revokeObjectURL(url);
}

/**
 * Import JSON file and return parsed data
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Export portfolio report as formatted text
 */
export function exportPortfolioReport(portfolio, assets) {
  if (!portfolio) return;

  const now = new Date().toLocaleString();
  let report = `AI INVEST – PORTFOLIO REPORT\nGenerated: ${now}\n${'═'.repeat(50)}\n\n`;

  report += `Total Investment: $${portfolio.totalInvestment?.toLocaleString() || '0'}\n`;
  report += `Assets: ${portfolio.assets?.length || 0}\n\n`;

  report += `${'─'.repeat(40)}\nHOLDINGS\n${'─'.repeat(40)}\n`;

  portfolio.assets?.forEach((a) => {
    const live = assets?.find((m) => m.symbol === a.symbol);
    const livePrice = live?.price || a.buyPrice || 0;
    const currentValue = a.buyPrice ? (a.amount / a.buyPrice) * livePrice : a.amount;
    const pnl = a.buyPrice ? ((livePrice - a.buyPrice) / a.buyPrice * 100).toFixed(2) : '0.00';
    report += `\n${a.symbol} (${a.name})\n`;
    report += `  Allocation: ${(a.allocation * 100).toFixed(1)}%\n`;
    report += `  Amount: $${a.amount?.toLocaleString()}\n`;
    report += `  Buy Price: $${a.buyPrice?.toLocaleString() || 'N/A'}\n`;
    report += `  Current Price: $${livePrice.toLocaleString()}\n`;
    report += `  Current Value: $${currentValue.toLocaleString()}\n`;
    report += `  P&L: ${pnl}%\n`;
  });

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, `portfolio-report-${new Date().toISOString().split('T')[0]}.txt`);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to trigger file download
 */
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Generate OHLCV data for candlestick charts
 */
export function generateOHLCV(basePrice = 100, days = 90) {
  const data = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * 0.04;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.02;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.02;
    const volume = Math.floor(Math.random() * 5000000) + 1000000;

    data.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });

    price = close;
  }
  return data;
}
