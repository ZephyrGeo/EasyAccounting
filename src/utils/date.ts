/**
 * 日期工具函数 - 使用 date-fns 重构，提供更稳健的日期操作
 */
import {
  format,
  parseISO,
  subMonths,
  addMonths,
  getDaysInMonth as getDays,
  startOfMonth,
  endOfMonth,
  formatDistanceToNow,
  isToday as isDateToday,
  isYesterday as isDateYesterday,
  parse,
  isValid,
} from "date-fns";
import { enUS } from "date-fns/locale";

// ============= 日期解析 =============

/**
 * 解析 ISO 日期字符串（YYYY-MM-DD 格式）
 * @param dateStr - ISO 格式的日期字符串，如 "2025-12-14"
 */
export function parseDateString(dateStr: string) {
  const date = parseISO(dateStr);
  if (!isValid(date)) return { year: "", shortYear: "", month: "", day: "" };

  return {
    year: format(date, "yyyy"),
    shortYear: format(date, "yy"),
    month: format(date, "MM"),
    day: format(date, "dd"),
  };
}

/**
 * 解析年月字符串
 * @param yearMonth - 格式: "2024-11"
 */
export function parseYearMonth(yearMonth: string): { year: string; month: string } {
  const date = parse(yearMonth, "yyyy-MM", new Date());
  return {
    year: format(date, "yyyy"),
    month: format(date, "MM"),
  };
}

// ============= 日期格式化 =============

/**
 * 格式化日期字符串用于显示
 * @param dateString - ISO 日期字符串
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);

  if (isDateToday(date)) {
    return `Today, ${format(date, "hh:mm a")}`;
  }

  if (isDateYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MMM d");
}

/**
 * 格式化月份显示
 * @param yearMonth - 格式: "2024-11"
 * @returns 格式: "Nov"
 */
export function formatMonthDisplay(yearMonth: string): string {
  const date = parse(yearMonth, "yyyy-MM", new Date());
  return format(date, "MMM");
}

/**
 * 获取相对时间描述
 * @param dateString - ISO 日期字符串
 */
export function getRelativeTime(dateString: string): string {
  const date = parseISO(dateString);

  if (isDateToday(date)) return "Today";
  if (isDateYesterday(date)) return "Yesterday";

  return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
}

// ============= 日期计算 =============

/**
 * 获取当前月份
 * @returns 格式: "2024-11"
 */
export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

/**
 * 获取指定月份的前一个月（格式：YYYY-MM）
 */
export function getPreviousMonth(selectedMonth: string): string {
  if (!selectedMonth) return "";
  const date = parse(selectedMonth, "yyyy-MM", new Date());
  return format(subMonths(date, 1), "yyyy-MM");
}

/**
 * 获取指定年月的下个月第一天（格式：YYYY-MM-DD）
 */
export function getNextMonth(year: string, month: string): string {
  const date = parse(`${year}-${month}`, "yyyy-MM", new Date());
  return format(addMonths(date, 1), "yyyy-MM-01");
}

/**
 * 获取当前是该月的第几天（1-31）
 */
export function getTodayDay(): number {
  return new Date().getDate();
}

/**
 * 获取指定年月的天数
 * @param yearMonth - 格式: "2024-11"
 */
export function getDaysInMonth(yearMonth: string): number {
  const date = parse(yearMonth, "yyyy-MM", new Date());
  return getDays(date);
}

// ============= 日期范围工具 =============

/**
 * 获取月份的日期范围（左闭右开区间）
 */
export function getMonthDateRange(selectedMonth: string): { startDate: string; endDate: string } {
  const date = parse(selectedMonth, "yyyy-MM", new Date());
  return {
    startDate: format(startOfMonth(date), "yyyy-MM-dd"),
    endDate: format(addMonths(startOfMonth(date), 1), "yyyy-MM-dd"),
  };
}

/**
 * 获取年份的日期范围（左闭右开区间）
 */
export function getYearDateRange(year: string): { startDate: string; endDate: string } {
  const date = parse(year, "yyyy", new Date());
  return {
    startDate: format(date, "yyyy-01-01"),
    endDate: format(addMonths(date, 12), "yyyy-01-01"),
  };
}

// ============= 日期转换 =============

/**
 * 将 ISO 日期字符串转换为 YYYY-MM-DD 格式
 */
export function toDateInputValue(isoDateString: string): string {
  return format(parseISO(isoDateString), "yyyy-MM-dd");
}

/**
 * 将 YYYY-MM-DD 日期字符串转换为 ISO 8601 格式，同时保留本地日期属性
 * 避免直接调用 .toISOString() 导致的 UTC 跨日问题
 */
export function toISOString(dateString: string): string {
  if (!dateString) return new Date().toISOString();

  // 逻辑：如果只有日期 YYYY-MM-DD，我们将其解析为本地时间的 00:00:00
  // 然后手动拼接一个符合 ISO 格式但不带 Z 的字符串，或者保留本地偏移
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  if (!isValid(date)) return new Date().toISOString();

  // 我们返回一个带有本地时间信息的字符串，Supabase 会正确处理这种 timestamptz
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/**
 * 获取本地 YYYY-MM-DD 格式的日期字符串
 */
export function formatToLocalDate(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * 获取今天的日期字符串 YYYY-MM-DD
 */
export function getTodayDateString(): string {
  return formatToLocalDate(new Date());
}

/**
 * 获取当前时间（HH:mm:ss 格式）
 */
export function getCurrentTimeString(): string {
  return format(new Date(), "HH:mm:ss");
}
