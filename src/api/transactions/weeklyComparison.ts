import { supabase } from "@/lib/supabase";
import { parseYearMonth } from "@/constants/date";

/**
 * 获取指定月份的周度对比数据
 * 将该月的数据按星期几和周数（1-4周）分组汇总
 * @param yearMonth 月份字符串，格式为 "YYYY-MM"
 * @returns 周度对比数据数组，每个元素包含星期几和4周的数据
 */
export async function getLatestMonthWeeklyComparison(yearMonth: string): Promise<Array<{
  dayOfWeek: string; // "Mon", "Tue", "Wed", etc.
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}>> {
  try {
    // 解析月份参数
    const { year: selectedYear, month: selectedMonth } = parseYearMonth(yearMonth);

    // 计算月份的开始和结束日期
    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const nextMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1);
    const endDate = nextMonth.toISOString().split('T')[0];

    console.log(`Fetching weekly comparison data for: ${selectedYear}-${selectedMonth}`);

    // 从数据库获取该月的所有交易数据
    const { data, error } = await supabase
      .from('transactions')
      .select('date, amount')
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    // 按日期聚合数据
    const dailyData: Record<string, number> = {};
    data?.forEach((item) => {
      const date = item.date; // YYYY-MM-DD
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += item.amount;
    });

    // 按星期几和周数分组
    const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData: Record<string, { week1: number; week2: number; week3: number; week4: number }> = {};

    // 初始化所有星期几
    weekDayNames.forEach(day => {
      weeklyData[day] = { week1: 0, week2: 0, week3: 0, week4: 0 };
    });

    // 遍历每日数据，分配到对应的星期几和周数
    Object.entries(dailyData).forEach(([dateStr, amount]) => {
      const date = new Date(dateStr);
      const dayOfWeek = weekDayNames[date.getDay()]; // 0=Sun, 1=Mon, ...
      const dayOfMonth = date.getDate();

      // 计算是第几周 (1-7天=week1, 8-14=week2, 15-21=week3, 22+=week4)
      let weekNum: 'week1' | 'week2' | 'week3' | 'week4';
      if (dayOfMonth <= 7) {
        weekNum = 'week1';
      } else if (dayOfMonth <= 14) {
        weekNum = 'week2';
      } else if (dayOfMonth <= 21) {
        weekNum = 'week3';
      } else {
        weekNum = 'week4';
      }

      weeklyData[dayOfWeek][weekNum] += amount;
    });

    // 转换为数组格式，按照周一到周日排序
    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = orderedDays.map(day => ({
      dayOfWeek: day,
      week1: weeklyData[day].week1,
      week2: weeklyData[day].week2,
      week3: weeklyData[day].week3,
      week4: weeklyData[day].week4,
    }));

    console.log(`Processed weekly comparison data:`, result);
    return result;

  } catch (error) {
    console.error("Failed to get weekly comparison data:", error);
    return [];
  }
}
