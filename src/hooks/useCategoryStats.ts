import { useState, useEffect } from 'react';
import { getCategoryStats, CategoryStat } from '@/api/transactions';

interface UseCategoryStatsReturn {
  data: CategoryStat[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch category statistics for a specific month from database
 * @param selectedMonth 选中的月份，格式为 "YYYY-MM"
 */
export function useCategoryStats(selectedMonth: string): UseCategoryStatsReturn {
  const [data, setData] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCategoryStats(selectedMonth);
      console.log('Hook received category stats:', result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category stats');
      console.error('Error fetching category stats:', err);
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
