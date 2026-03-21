import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";
import { DatabaseTransaction } from "./types";
import { getMonthDateRange } from "@/utils/date";
import { mapDatabaseTransactions } from "./mappers";

/**
 * 获取最近的交易记录
 * @param limit - 返回的交易数量，默认 5 条
 * @param selectedMonth - 可选的月份筛选（格式：YYYY-MM）
 * @returns 交易记录数组
 */
export async function getRecentTransactions(limit: number = 5, selectedMonth?: string): Promise<Transaction[]> {
  try {
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        category:categories(id, name),
        merchant:merchants(id, name)
      `,
      )
      .order("date", { ascending: false })
      .order("time", { ascending: false })
      .limit(limit);

    // 如果提供了月份筛选
    if (selectedMonth) {
      const { startDate, endDate } = getMonthDateRange(selectedMonth);
      query = query.gte("date", startDate).lt("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("获取最近交易数据失败:", error);
      throw error;
    }

    // 转换数据格式以匹配前端 Transaction 类型
    return mapDatabaseTransactions((data as DatabaseTransaction[]) || []);
  } catch (error) {
    console.error("获取最近交易数据失败:", error);
    return [];
  }
}
