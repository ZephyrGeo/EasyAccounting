import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getTransactions } from '@/api/transactions';

interface UseTransactionsOptions {
  selectedMonth?: string | null;
}

interface UseTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 获取所有交易记录（不限制数量）
 * @param options - 配置选项
 * @param options.selectedMonth - 可选的月份筛选（格式：YYYY-MM）
 */
export function useTransactions({
  selectedMonth,
}: UseTransactionsOptions = {}): UseTransactionsResult {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    async function fetchTransactions() {
      if (!selectedMonth) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 解析 "YYYY-MM" 为年份和月份
        const [year, month] = selectedMonth.split('-');
        const yearShort = year.slice(2); // "2025" -> "25"

        const transactions = await getTransactions({
          year: yearShort,
          month: month,
        });

        setData(transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取交易失败');
        console.error('获取交易失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [selectedMonth, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
