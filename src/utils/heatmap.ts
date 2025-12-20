import { Transaction } from '@/types/transaction';
import { getDaysInMonth } from '@/constants/date';

export interface HeatmapDataPoint {
  day: number;
  count: number;
  intensity: number; // 0-4
}

/**
 * 根据交易数据计算热图数据点
 * @param transactions - 交易数组
 * @param selectedMonth - 选中的月份（格式：YYYY-MM）
 * @returns 每日交易活动数据数组
 */
export function calculateHeatmapData(
  transactions: Transaction[],
  selectedMonth: string
): HeatmapDataPoint[] {
  if (!selectedMonth || transactions.length === 0) {
    return [];
  }

  // 获取该月的天数
  const daysInMonth = getDaysInMonth(selectedMonth);

  // 统计每日的交易数量
  const dailyTransactions: Record<number, number> = {};
  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const day = txDate.getDate();
    dailyTransactions[day] = (dailyTransactions[day] || 0) + 1;
  });

  // 找出最大交易数量，用于归一化强度
  const maxTransactions = Math.max(...Object.values(dailyTransactions), 1);

  // 生成每日数据
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const count = dailyTransactions[day] || 0;
    // 将交易数量映射到 0-4 的强度等级
    const intensity = count === 0 ? 0 : Math.ceil((count / maxTransactions) * 4);

    return {
      day,
      count,
      intensity,
    };
  });
}
