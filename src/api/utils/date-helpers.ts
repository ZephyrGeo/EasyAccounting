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

/**
 * 获取月份的日期范围（左闭右开区间）
 * @param selectedMonth - 月份字符串，格式为 "YYYY-MM"
 * @returns 包含 startDate 和 endDate 的对象
 * @example getMonthDateRange("2025-12") → { startDate: "2025-12-01", endDate: "2026-01-01" }
 */
export function getMonthDateRange(selectedMonth: string): { startDate: string; endDate: string } {
  const [year, month] = selectedMonth.split('-');
  const startDate = `${year}-${month}-01`;
  const endDate = getNextMonth(year, month);
  return { startDate, endDate };
}

/**
 * 获取年份的日期范围（左闭右开区间）
 * @param year - 年份字符串，如 "2025"
 * @returns 包含 startDate 和 endDate 的对象
 * @example getYearDateRange("2025") → { startDate: "2025-01-01", endDate: "2026-01-01" }
 */
export function getYearDateRange(year: string): { startDate: string; endDate: string } {
  const startDate = `${year}-01-01`;
  const endDate = `${parseInt(year) + 1}-01-01`;
  return { startDate, endDate };
}
