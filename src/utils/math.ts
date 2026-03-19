/**
 * 通用数学计算工具函数
 */

/**
 * 将数值限制在 0-100 之间，常用于计算百分比
 */
export function clampPercentage(value: number, max: number): number {
  if (max === 0) return 0;
  const percentage = (value / max) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

/**
 * 四舍五入到指定小数位
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
