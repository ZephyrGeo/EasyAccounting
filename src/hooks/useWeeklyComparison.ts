import { useState, useEffect } from 'react';
import { getLatestMonthWeeklyComparison } from '@/api/transactions/aggregations';

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
 * Hook to fetch the latest month's weekly comparison data from database
 * Compares spending across 4 weeks, grouped by day of week
 */
export function useWeeklyComparison(): UseWeeklyComparisonReturn {
  const [data, setData] = useState<WeeklyComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getLatestMonthWeeklyComparison();
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
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
