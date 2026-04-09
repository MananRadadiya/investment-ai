// Market calendar events

export const calendarEvents = [
  { id: 1, date: '2026-04-10', title: 'CPI Inflation Data Release', type: 'economic', impact: 'high', time: '08:30 EST', description: 'Consumer Price Index for March. Consensus: 3.2% YoY.' },
  { id: 2, date: '2026-04-10', title: 'TSLA Q1 Earnings', type: 'earnings', impact: 'high', time: '16:00 EST', description: 'Tesla Q1 earnings report. EPS estimate: $0.52.' },
  { id: 3, date: '2026-04-11', title: 'PPI Data Release', type: 'economic', impact: 'medium', time: '08:30 EST', description: 'Producer Price Index for March.' },
  { id: 4, date: '2026-04-11', title: 'BTC Halving Anniversary', type: 'crypto', impact: 'low', time: 'All Day', description: 'One year since the 4th Bitcoin halving event.' },
  { id: 5, date: '2026-04-12', title: 'NVDA GTC Keynote', type: 'earnings', impact: 'high', time: '09:00 EST', description: 'Jensen Huang keynote at GPU Technology Conference.' },
  { id: 6, date: '2026-04-14', title: 'Fed FOMC Minutes', type: 'economic', impact: 'high', time: '14:00 EST', description: 'Federal Open Market Committee meeting minutes released.' },
  { id: 7, date: '2026-04-15', title: 'NFLX Q1 Earnings', type: 'earnings', impact: 'medium', time: '16:00 EST', description: 'Netflix Q1 earnings. Subscriber growth is key metric.' },
  { id: 8, date: '2026-04-15', title: 'Retail Sales Data', type: 'economic', impact: 'medium', time: '08:30 EST', description: 'March retail sales report. Indicator of consumer spending.' },
  { id: 9, date: '2026-04-16', title: 'ETH Protocol Upgrade', type: 'crypto', impact: 'high', time: '12:00 UTC', description: 'Ethereum network upgrade expected at block 19,500,000.' },
  { id: 10, date: '2026-04-17', title: 'AAPL Product Event', type: 'earnings', impact: 'medium', time: '13:00 EST', description: 'Apple Spring product announcement event.' },
  { id: 11, date: '2026-04-18', title: 'Jobless Claims', type: 'economic', impact: 'low', time: '08:30 EST', description: 'Weekly initial jobless claims report.' },
  { id: 12, date: '2026-04-21', title: 'GOOGL Q1 Earnings', type: 'earnings', impact: 'high', time: '16:00 EST', description: 'Alphabet Q1 earnings. Cloud and AI revenue focus.' },
  { id: 13, date: '2026-04-22', title: 'MSFT Q1 Earnings', type: 'earnings', impact: 'high', time: '16:00 EST', description: 'Microsoft Q1 earnings. Azure growth is key.' },
  { id: 14, date: '2026-04-23', title: 'META Q1 Earnings', type: 'earnings', impact: 'high', time: '16:00 EST', description: 'Meta Q1 earnings. Reality Labs losses in focus.' },
  { id: 15, date: '2026-04-25', title: 'GDP First Estimate', type: 'economic', impact: 'high', time: '08:30 EST', description: 'Q1 2026 GDP advance estimate. Consensus: 2.4%.' },
  { id: 16, date: '2026-04-28', title: 'SOL Breakpoint Conference', type: 'crypto', impact: 'medium', time: 'All Day', description: 'Solana Foundation annual developer conference.' },
  { id: 17, date: '2026-04-30', title: 'AMZN Q1 Earnings', type: 'earnings', impact: 'high', time: '16:00 EST', description: 'Amazon Q1 earnings. AWS and retail margins.' },
  { id: 18, date: '2026-04-30', title: 'PCE Inflation Data', type: 'economic', impact: 'high', time: '08:30 EST', description: 'Fed\'s preferred inflation gauge for March.' },
];

export const eventTypes = {
  economic: { color: '#4f8cff', label: 'Economic' },
  earnings: { color: '#22c55e', label: 'Earnings' },
  crypto: { color: '#f59e0b', label: 'Crypto' },
  ipo: { color: '#a78bfa', label: 'IPO' },
};

export const impactLevels = {
  high: { color: '#ef4444', label: 'High Impact' },
  medium: { color: '#f59e0b', label: 'Medium' },
  low: { color: '#22c55e', label: 'Low' },
};
