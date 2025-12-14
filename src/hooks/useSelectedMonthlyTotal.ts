import { useState, useEffect } from 'react';
import { getSelectedMonthlyTotal } from '@/api/transactions';

export function useSelectedMonthlyTotal(selectedMonth: string) {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonthlyTotal() {
      try {
        setLoading(true);
        setError(null);
        const result = await getSelectedMonthlyTotal(selectedMonth);
        setTotal(result);
      } catch (err) {
        console.error('Failed to fetch monthly total:', err);
        setError('Failed to load monthly total');
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyTotal();
  }, [selectedMonth]);

  return { total, loading, error };
}
