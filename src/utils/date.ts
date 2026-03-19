/**
 * 日期工具函数 - 综合的日期操作和格式化
 */

// ============= 日期解析 =============

/**
 * 解析 ISO 日期字符串（YYYY-MM-DD 格式）
 * @param date - ISO 格式的日期字符串，如 "2025-12-14"
 * @returns 包含各种日期格式的对象
 */
export function parseDateString(date: string) {
  return {
    /** 完整年份，如 "2025" */
    year: date.substring(0, 4),
    /** 两位年份，如 "25" */
    shortYear: date.substring(2, 4),
    /** 月份，如 "12" */
    month: date.substring(5, 7),
    /** 日期，如 "14" */
    day: date.substring(8, 10),
  };
}

/**
 * 解析年月字符串
 * @param yearMonth - 格式: "2024-11"
 * @returns { year: "2024", month: "11" }
 */
export function parseYearMonth(yearMonth: string): { year: string; month: string } {
  const [year, month] = yearMonth.split('-');
  return { year, month };
}

// ============= 日期格式化 =============

/**
 * 格式化日期字符串用于显示
 * @param dateString - ISO 日期字符串
 * @returns 格式化的日期字符串（Today、Yesterday 或 "MMM DD"）
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 检查是否为今天
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  // 检查是否为昨天
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // 否则返回格式化的日期
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * 格式化月份显示
 * @param yearMonth - 格式: "2024-11"
 * @returns 格式: "Nov"
 */
export function formatMonthDisplay(yearMonth: string): string {
  const { month } = parseYearMonth(yearMonth);
  const MONTH_LABELS: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
  };
  return MONTH_LABELS[month] || '';
}

/**
 * 获取相对时间描述
 * @param dateString - ISO 日期字符串
 * @returns 相对时间描述（例如："Today"、"2 days ago"）
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

// ============= 日期计算 =============

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
 * 获取指定月份的前一个月（格式：YYYY-MM）
 * @param selectedMonth - 当前月份 "2025-12"
 * @returns 前一个月 "2025-11"
 */
export function getPreviousMonth(selectedMonth: string): string {
  if (!selectedMonth || !selectedMonth.includes('-')) return '';
  const [year, month] = selectedMonth.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  date.setMonth(date.getMonth() - 1);
  
  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${prevYear}-${prevMonth}`;
}

/**
 * 获取指定年月的下个月第一天（格式：YYYY-MM-DD）
 * @param year - 年份字符串 "2025"
 * @param month - 月份字符串 "12"
 * @returns 下个月第一天 "2026-01-01"
 */
export function getNextMonth(year: string, month: string): string {
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  date.setMonth(date.getMonth() + 1);
  
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${nextYear}-${nextMonth}-01`;
}

/**
 * 获取当前是该月的第几天（1-31）
 * @returns 今天的日期 (1-31)
 */
export function getTodayDay(): number {
  return new Date().getDate();
}

/**
 * 获取指定年月的天数
 * @param yearMonth - 格式: "2024-11"
 * @returns 该月的天数 (28-31)
 */
export function getDaysInMonth(yearMonth: string): number {
  const { year, month } = parseYearMonth(yearMonth);
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  return new Date(yearNum, monthNum, 0).getDate();
}

// ============= 日期范围工具 =============

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

// ============= 日期转换 =============

/**
 * 将 ISO 日期字符串转换为 YYYY-MM-DD 格式（用于表单输入）
 * @param isoDateString - ISO 8601 日期字符串（例如："2025-12-21T10:30:00Z"）
 * @returns YYYY-MM-DD 格式的日期字符串（例如："2025-12-21"）
 * @example toDateInputValue("2025-12-21T10:30:00Z") → "2025-12-21"
 */
export function toDateInputValue(isoDateString: string): string {
  return isoDateString.split('T')[0];
}

/**
 * 将 YYYY-MM-DD 日期字符串转换为 ISO 8601 格式
 * @param dateString - YYYY-MM-DD 格式的日期字符串（例如："2025-12-21"）
 * @returns 带午夜UTC时间的 ISO 8601 日期字符串
 * @example toISOString("2025-12-21") → "2025-12-21T00:00:00.000Z"
 */
export function toISOString(dateString: string): string {
  return new Date(dateString).toISOString();
}

/**
 * 获取今天的日期（YYYY-MM-DD 格式，用于表单输入）
 * @returns 今天的日期字符串，格式为 YYYY-MM-DD
 * @example getTodayDateString() → "2025-12-21"
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取当前时间（HH:mm:ss 格式）
 * @returns 当前时间字符串，格式为 HH:mm:ss
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
