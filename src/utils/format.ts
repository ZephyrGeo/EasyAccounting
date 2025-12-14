/**
 * 格式化工具函数
 */

/**
 * 格式化金额（取绝对值并添加千分位）
 * @param amount - 金额（可以是负数）
 * @param currency - 货币符号，默认为 "¥"
 * @returns 格式化后的金额字符串，例如: "¥1,234"
 */
export function formatAmount(amount: number, currency: string = '¥'): string {
  return `${currency}${Math.abs(amount).toLocaleString()}`;
}
