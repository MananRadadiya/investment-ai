// ─── Format Utilities for Indian Financial Context ───

// Format number in Indian notation: 1,23,456
export function formatINR(amount, showSymbol = true) {
  if (amount === null || amount === undefined || isNaN(amount)) return showSymbol ? '₹0' : '0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-' : '';

  // Indian number grouping: first 3 digits, then groups of 2
  const parts = absAmount.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];

  // Apply Indian grouping
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const remaining = intPart.slice(0, -3);
    const grouped = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    intPart = grouped + ',' + last3;
  }

  const formatted = decPart === '00' ? intPart : `${intPart}.${decPart}`;
  return showSymbol ? `${prefix}₹${formatted}` : `${prefix}${formatted}`;
}

// Format large numbers as Lakhs/Crores
export function formatCompact(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? '-' : '';

  if (absAmount >= 10000000) {
    // Crores (1 Cr = 1,00,00,000)
    return `${prefix}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    // Lakhs (1 L = 1,00,000)
    return `${prefix}₹${(absAmount / 100000).toFixed(2)} L`;
  }
  if (absAmount >= 1000) {
    // Thousands
    return `${prefix}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  return `${prefix}₹${absAmount.toFixed(0)}`;
}

// Format percentage with sign
export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Format date in Indian format (DD/MM/YYYY)
export function formatDateIN(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Format relative time (e.g., "2 hours ago")
export function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDateIN(dateStr);
}

// Format currency for display in different contexts
export function formatCurrency(amount) {
  return formatINR(amount);
}
