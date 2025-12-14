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
