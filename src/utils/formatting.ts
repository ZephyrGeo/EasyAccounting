/**
 * 货币和数字格式化工具函数
 */

/**
 * 格式化金额为货币格式（取绝对值并添加千分位）
 * @param amount - 金额（可以是负数，会自动取绝对值）
 * @param currency - 货币符号，默认为 "¥"
 * @returns 格式化后的金额字符串，例如: "¥1,234"
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  return `${currency}${Math.abs(amount).toLocaleString()}`;
}

/**
 * 格式化货币为紧凑形式（例如：100000 → "¥100k"）
 * 适用于在有限空间内显示大额金额
 * @param amount - 金额
 * @param currency - 货币符号，默认为 "¥"
 * @returns 紧凑格式的货币字符串
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

/**
 * 格式化趋势百分比
 * @param value - 百分比值
 * @returns 带符号的百分比字符串（例如："+5.2%"）
 */
export function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
