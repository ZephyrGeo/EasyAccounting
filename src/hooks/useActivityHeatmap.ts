import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { calculateHeatmapData, HeatmapDataPoint } from '@/utils/heatmap';

/**
 * 计算指定月份的交易活动热图数据
 * @param selectedMonth - 选中的月份（格式：YYYY-MM）
 * @returns 每日交易活动数据数组
 */
export function useActivityHeatmap(selectedMonth: string | null): HeatmapDataPoint[] {
  // 获取选中月份的交易数据
  const { data: transactions } = useTransactions({ selectedMonth });

  // 计算该月每日的交易活动强度
  const heatmapData = useMemo(() => {
    if (!selectedMonth) {
      return [];
    }
    const data = calculateHeatmapData(transactions, selectedMonth);

    return data;
  }, [selectedMonth, transactions]);

  return heatmapData;
}
