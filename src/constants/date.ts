// 月份标签映射
export const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

// 所有月份用于网格显示
export const ALL_MONTHS = [
  { num: '01', name: 'Jan' },
  { num: '02', name: 'Feb' },
  { num: '03', name: 'Mar' },
  { num: '04', name: 'Apr' },
  { num: '05', name: 'May' },
  { num: '06', name: 'Jun' },
  { num: '07', name: 'Jul' },
  { num: '08', name: 'Aug' },
  { num: '09', name: 'Sep' },
  { num: '10', name: 'Oct' },
  { num: '11', name: 'Nov' },
  { num: '12', name: 'Dec' },
];

/**
 * 获取当前月份
 * @returns 格式: "2024-11"
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * 格式化月份显示
 * @param yearMonth - 格式: "2024-11"
 * @returns 格式: "Nov"
 */
export function formatMonthDisplay(yearMonth: string): string {
  const [, month] = yearMonth.split('-');
  return MONTH_LABELS[month] || '';
}
