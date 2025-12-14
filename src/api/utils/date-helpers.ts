/**
 * 计算下个月第一天的日期字符串（用于日期范围查询）
 * @param year - 年份字符串，如 "2025"
 * @param month - 月份字符串，如 "12"
 * @returns 下个月第一天的日期字符串，格式为 "YYYY-MM-01"
 * @example getNextMonth("2025", "12") → "2026-01-01"
 * @example getNextMonth("2025", "06") → "2025-07-01"
 */
export function getNextMonth(year: string, month: string): string {
  const date = new Date(`${year}-${month}-01`);
  date.setMonth(date.getMonth() + 1);
  const nextYear = date.getFullYear();
  const nextMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${nextYear}-${nextMonth}-01`;
}
