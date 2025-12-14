import { supabase } from "@/lib/supabase";

/**
 * 获取数据库中所有可用的年月列表
 * @returns 年月字符串数组，格式为 ["2024-11", "2024-12", "2025-01"]，按时间倒序排列
 */
export async function getAvailableMonths(): Promise<string[]> {
  try {
    // 查询所有不重复的年月
    const { data, error } = await supabase
      .from('transactions')
      .select('date')
      .order('date', { ascending: false });

    if (error) throw error;

    // 提取唯一的年月组合
    const monthSet = new Set<string>();
    data?.forEach((item) => {
      const yearMonth = item.date.substring(0, 7); // "2024-11-14" -> "2024-11"
      monthSet.add(yearMonth);
    });

    // 转换为数组并按时间倒序排列
    return Array.from(monthSet).sort().reverse();
  } catch (error) {
    console.error("Failed to get available months:", error);
    return [];
  }
}
