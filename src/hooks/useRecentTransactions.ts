import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getRecentTransactions } from '@/api/transactions';

interface UseRecentTransactionsOptions {
  limit?: number;
  selectedMonth?: string;
}

interface UseRecentTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: string | null;
}

/**
 * 获取最近的交易记录
 * @param options - 配置选项
 * @param options.limit - 返回的交易数量，默认 5 条
 * @param options.selectedMonth - 可选的月份筛选（格式：YYYY-MM）
 */
export function useRecentTransactions({
  limit = 5,
  selectedMonth,
}: UseRecentTransactionsOptions = {}): UseRecentTransactionsResult {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentTransactions() {
      try {
        setLoading(true);
        setError(null);
        const transactions = await getRecentTransactions(limit, selectedMonth);
        setData(transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent transactions');
        console.error('Failed to fetch recent transactions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentTransactions();
  }, [limit, selectedMonth]);

  return { data, loading, error };
}
