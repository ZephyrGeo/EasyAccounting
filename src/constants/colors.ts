/**
 * 预定义的色彩调色板
 * 用于图表和可视化组件
 */
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
  '#8b5cf6', // violet
  '#84cc16', // lime
  '#6366f1', // indigo
  '#14b8a6', // teal
] as const;

/**
 * 获取指定索引的颜色，超出范围时循环使用
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * 周度对比图表的颜色配置
 */
export const WEEK_COLORS = {
  week1: '#3b82f6', // blue
  week2: '#8b5cf6', // purple
  week3: '#ec4899', // pink
  week4: '#f59e0b', // amber
} as const;
