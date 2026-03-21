import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { getPreviousMonth } from "@/utils/date";

export function useMonthlyComparison(selectedMonth: string) {
  // 1. 获取本月数据
  const { data: currentTransactions, loading: currentLoading } = useTransactions({ selectedMonth });

  // 2. 获取上月数据 (用于对比)
  const prevMonth = useMemo(() => {
    if (!selectedMonth) return "";
    return getPreviousMonth(selectedMonth);
  }, [selectedMonth]);

  const { data: prevTransactions, loading: prevLoading } = useTransactions({
    selectedMonth: prevMonth || null, // 确保传给 useTransactions 的是有效值或 null
  });

  const stats = useMemo(() => {
    if (currentLoading || prevLoading || !selectedMonth || !prevMonth) return null;

    // 只计算支出的总和 (假设负数是支出)
    const currentTotal = Math.abs(
      currentTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    );

    const prevTotal = Math.abs(prevTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

    if (prevTotal === 0) return { diff: 0, percentage: 0, isHigher: false, currentTotal };

    const diff = currentTotal - prevTotal;
    const percentage = Math.round((Math.abs(diff) / prevTotal) * 100);
    const isHigher = diff > 0;

    return {
      diff,
      percentage,
      isHigher,
      currentTotal,
      prevTotal,
    };
  }, [currentTransactions, prevTransactions, currentLoading, prevLoading]);

  return {
    stats,
    loading: currentLoading || prevLoading,
  };
}
