import { useState, useEffect } from 'react';
import { getAvailableMonths } from '@/api/transactions';

export function useAvailableMonths() {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvailableMonths() {
      try {
        setLoading(true);
        setError(null);
        const result = await getAvailableMonths();
        setMonths(result);
      } catch (err) {
        console.error('Failed to fetch available months:', err);
        setError('Failed to load available months');
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableMonths();
  }, []);

  return { months, loading, error };
}
