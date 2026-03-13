/**
 * 图表数据转换工具函数
 */
import { getChartColor } from './colors/chart';

export interface CategoryData {
  category: string;
  amount: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // 支持 Recharts 的索引签名
}

/**
 * 将分类统计数据转换为带颜色的图表数据
 * @param categoryStats - 分类统计数据
 * @returns 准备好的图表数据（带颜色）
 */
export function transformCategoryDataForChart(
  categoryStats: CategoryData[]
): ChartDataPoint[] {
  return categoryStats.map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: getChartColor(index),
  }));
}

/**
 * 从数据点计算总计
 * @param data - 带有 value 属性的数据点
 * @returns 所有值的总和
 */
export function calculateTotal(data: { value: number }[]): number {
  return data.reduce((sum, item) => sum + item.value, 0);
}
