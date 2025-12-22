/**
 * 数学工具函数
 */

/**
 * 计算百分比（四舍五入）
 * @param value - 分子
 * @param total - 分母
 * @returns 四舍五入到最接近整数的百分比
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * 计算限制在 0-100 范围内的百分比
 * @param value - 当前值
 * @param max - 最大值
 * @returns 限制在 0-100 之间的百分比
 */
export function clampPercentage(value: number, max: number): number {
  return Math.min(Math.max((value / max) * 100, 0), 100);
}
