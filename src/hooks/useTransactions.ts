import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getTransactions } from '@/api/transactions';

interface UseTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 获取所有交易记录（不限制数量，不筛选日期）
 */
export function useTransactions(): UseTransactionsResult {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        
        // 直接获取所有记录
        const transactions = await getTransactions();
        setData(transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取交易失败');
        console.error('获取交易失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
