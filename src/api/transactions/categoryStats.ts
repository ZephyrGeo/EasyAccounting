import { supabase } from "@/lib/supabase";
import type { CategoryStat, TransactionWithCategory } from "./types";

/**
 * 获取指定月份的分类统计数据
 * 只返回有数值的分类
 * @param selectedMonth - 选中的月份，格式为 "YYYY-MM"
 * @returns 分类统计数组，按金额降序排列
 */
export async function getCategoryStats(
  selectedMonth: string
): Promise<CategoryStat[]> {
  try {
    // 解析月份
    const [year, month] = selectedMonth.split('-');

    if (!year || !month) {
      console.error('Invalid month format:', selectedMonth);
      return [];
    }

    // 计算下个月的第一天作为结束日期
    const startDate = `${year}-${month}-01`;
    const nextMonth = month === '12' ? '01' : String(parseInt(month) + 1).padStart(2, '0');
    const nextYear = month === '12' ? String(parseInt(year) + 1) : year;
    const endDate = `${nextYear}-${nextMonth}-01`;

    // 查询该月份的所有交易，并按分类分组统计
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        amount,
        category:categories(name)
      `)
      .gte('date', startDate)
      .lt('date', endDate);

    if (error) {
      console.error('Failed to fetch category stats:', error);
      throw error;
    }

    // 按分类聚合金额
    const categoryMap = new Map<string, number>();

    (data as unknown as TransactionWithCategory[])?.forEach((transaction) => {
      const categoryName = transaction.category?.name || 'Unknown';
      const amount = Math.abs(transaction.amount); // 使用绝对值

      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName)! + amount);
      } else {
        categoryMap.set(categoryName, amount);
      }
    });

    // 转换为数组并按金额降序排序，过滤掉金额为0的分类
    const result: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .filter(stat => stat.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    console.log('Category stats for', selectedMonth, ':', result);

    return result;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }
}
