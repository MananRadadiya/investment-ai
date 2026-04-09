// ─── Paper Trading Data ───

export const ORDER_TYPES = ['market', 'limit', 'stop-loss', 'stop-limit'];
export const ORDER_SIDES = ['buy', 'sell'];
export const ORDER_STATUSES = ['pending', 'filled', 'cancelled', 'partial'];

export const initialBalance = 100000;

export const sampleOrders = [
  { id: 'ORD-001', symbol: 'BTC', side: 'buy', type: 'market', quantity: 0.15, price: 67432.18, total: 10114.83, status: 'filled', filledAt: '2026-04-09T14:23:00', createdAt: '2026-04-09T14:23:00' },
  { id: 'ORD-002', symbol: 'ETH', side: 'buy', type: 'limit', quantity: 3.0, price: 3400.00, total: 10200.00, status: 'filled', filledAt: '2026-04-09T14:25:00', createdAt: '2026-04-09T14:20:00' },
  { id: 'ORD-003', symbol: 'SOL', side: 'buy', type: 'market', quantity: 30, price: 178.45, total: 5353.50, status: 'filled', filledAt: '2026-04-09T14:30:00', createdAt: '2026-04-09T14:30:00' },
  { id: 'ORD-004', symbol: 'NVDA', side: 'buy', type: 'limit', quantity: 10, price: 870.00, total: 8700.00, status: 'pending', filledAt: null, createdAt: '2026-04-09T15:00:00' },
  { id: 'ORD-005', symbol: 'BTC', side: 'sell', type: 'stop-loss', quantity: 0.05, price: 60000.00, total: 3000.00, status: 'pending', filledAt: null, createdAt: '2026-04-09T15:10:00' },
  { id: 'ORD-006', symbol: 'AAPL', side: 'buy', type: 'market', quantity: 25, price: 189.84, total: 4746.00, status: 'filled', filledAt: '2026-04-08T10:15:00', createdAt: '2026-04-08T10:15:00' },
  { id: 'ORD-007', symbol: 'DOGE', side: 'buy', type: 'market', quantity: 5000, price: 0.167, total: 835.00, status: 'filled', filledAt: '2026-04-07T16:42:00', createdAt: '2026-04-07T16:42:00' },
  { id: 'ORD-008', symbol: 'ETH', side: 'sell', type: 'limit', quantity: 1.0, price: 3600.00, total: 3600.00, status: 'pending', filledAt: null, createdAt: '2026-04-09T16:00:00' },
  { id: 'ORD-009', symbol: 'GOLD', side: 'buy', type: 'market', quantity: 2, price: 2341.50, total: 4683.00, status: 'filled', filledAt: '2026-04-06T09:00:00', createdAt: '2026-04-06T09:00:00' },
  { id: 'ORD-010', symbol: 'MSFT', side: 'buy', type: 'limit', quantity: 15, price: 415.00, total: 6225.00, status: 'cancelled', filledAt: null, createdAt: '2026-04-05T11:30:00' },
];

export const samplePositions = [
  { symbol: 'BTC', quantity: 0.15, avgPrice: 67432.18, color: '#f7931a' },
  { symbol: 'ETH', quantity: 3.0, avgPrice: 3400.00, color: '#627eea' },
  { symbol: 'SOL', quantity: 30, avgPrice: 178.45, color: '#9945ff' },
  { symbol: 'AAPL', quantity: 25, avgPrice: 189.84, color: '#a78bfa' },
  { symbol: 'DOGE', quantity: 5000, avgPrice: 0.167, color: '#c2a633' },
  { symbol: 'GOLD', quantity: 2, avgPrice: 2341.50, color: '#fbbf24' },
];

// Generate P&L history for paper trading
export function generatePnLHistory(days = 30) {
  const data = [];
  let pnl = 0;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const dailyPnl = (Math.random() - 0.45) * 1200;
    pnl += dailyPnl;
    data.push({
      date: new Date(now - i * 86400000).toISOString().split('T')[0],
      pnl: +pnl.toFixed(2),
      dailyPnl: +dailyPnl.toFixed(2),
      trades: Math.floor(Math.random() * 8) + 1,
    });
  }
  return data;
}
