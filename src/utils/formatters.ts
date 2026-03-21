/**
 * 全局格式化工具集 (formatters.ts)
 * 职责：将原始数据转换为标准化的视觉文本
 */

/**
 * 货币格式化：支持动态币种与区域设置
 * @example 1234.56 -> "¥1,235" (默认日元处理，不保留小数)
 */
export function formatCurrency(value: number, currency: string = "JPY", locale: string = "ja-JP"): string {
  const safeValue = value || 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    // 日元通常不显示小数位，如果是美元/欧元可调整为 2
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(safeValue);
}

/**
 * 数字缩写：用于显示大额数值（如 1.2k, 1.5M）
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

/**
 * 百分比格式化
 * @example 0.123 -> "12.3%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 字符串截断：用于处理超长备注或名称
 */
export function truncate(str: string, length: number): string {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * 商家/分类名规格化：去除多余空格并大写化
 */
export function normalizeLabel(label: string): string {
  if (!label) return "";
  return label.trim().replace(/\s+/g, " ");
}

/**
 * 手机号/银行卡脱敏
 */
export function maskSensitive(text: string, visibleCount: number = 4): string {
  if (!text) return "";
  if (text.length <= visibleCount) return text;
  return `${"*".repeat(text.length - visibleCount)}${text.slice(-visibleCount)}`;
}
