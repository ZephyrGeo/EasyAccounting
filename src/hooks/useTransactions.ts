import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { getTransactions } from "@/api/transactions";

interface UseTransactionsResult {
  data: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseTransactionsFilters {
  selectedMonth?: string | null;
}

/**
 * 获取所有交易记录（不限制数量，不筛选日期）
 */
export function useTransactions(filters: UseTransactionsFilters = {}): UseTransactionsResult {
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

        // 如果有月份过滤，则在前端过滤（暂时保持原逻辑，以后可优化为 API 过滤）
        if (filters.selectedMonth) {
          const filtered = transactions.filter((t) => t.date.startsWith(filters.selectedMonth!));
          setData(filtered);
        } else {
          setData(transactions);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取交易失败");
        console.error("获取交易失败:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [refetchTrigger, filters.selectedMonth]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
}
