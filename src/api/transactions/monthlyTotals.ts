import { supabase } from "@/lib/supabase";
import { getMonthDateRange } from "@/utils/date";

/**
 * 获取指定月份的总支出
 * @param yearMonth - 月份字符串，格式为 "2024-11"
 * @returns 该月的总支出金额（负数）
 */
export async function getSelectedMonthlyTotal(yearMonth: string): Promise<number> {
  try {
    // Validate input
    if (!yearMonth || !yearMonth.includes('-')) {
      console.warn(`Invalid yearMonth format: "${yearMonth}"`);
      return 0;
    }

    // 计算月份的开始和结束日期
    const { startDate, endDate } = getMonthDateRange(yearMonth);

    // 查询该月的所有交易
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .gte('date', startDate)
      .lt('date', endDate);

    if (error) throw error;

    // 计算总和
    const total = data?.reduce((sum, item) => sum + item.amount, 0) || 0;

    return total;
  } catch (error) {
    console.error("Failed to get monthly total:", error);
    return 0;
  }
}
