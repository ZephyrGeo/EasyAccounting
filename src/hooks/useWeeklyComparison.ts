import { useState, useEffect } from 'react';
import { getLatestMonthWeeklyComparison } from '@/api/transactions';

interface WeeklyComparisonData {
  dayOfWeek: string; // "Mon", "Tue", "Wed", etc.
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

interface UseWeeklyComparisonReturn {
  data: WeeklyComparisonData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch weekly comparison data for a specific month from database
 * Compares spending across 4 weeks, grouped by day of week
 * @param selectedMonth 选中的月份，格式为 "YYYY-MM"
 */
export function useWeeklyComparison(selectedMonth: string): UseWeeklyComparisonReturn {
  const [data, setData] = useState<WeeklyComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getLatestMonthWeeklyComparison(selectedMonth);
      console.log('Hook received weekly comparison data:', result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weekly comparison data');
      console.error('Error fetching weekly comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 只在 selectedMonth 有效时才获取数据
    // 验证格式: YYYY-MM (如 "2024-11")
    const isValidFormat = /^\d{4}-\d{2}$/.test(selectedMonth);

    if (isValidFormat) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [selectedMonth]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
