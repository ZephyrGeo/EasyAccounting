/**
 * Format a number as currency with the specified symbol
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  return `${currency}${Math.abs(amount).toLocaleString()}`;
}

/**
 * Format date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Check if it's yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Otherwise return formatted date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format trend percentage
 */
export function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Get relative time description
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

/**
 * Format currency in compact form (e.g., 100000 → "¥100k")
 * Useful for displaying large amounts in limited space
 */
export function formatCompactCurrency(amount: number, currency: string = '¥'): string {
  if (amount >= 1000000) {
    return `${currency}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount, currency);
}
