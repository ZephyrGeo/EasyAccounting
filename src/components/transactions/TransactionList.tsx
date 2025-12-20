import TransactionItem from './TransactionItem';
import { useRecentTransactions } from '@/hooks/useRecentTransactions';
import { Transaction } from '@/types/transaction';

interface TransactionListProps {
  selectedMonth?: string;
  limit?: number;
  onSeeAll?: () => void;
  // 新增：支持直接传入交易数据
  transactions?: Transaction[];
  loading?: boolean;
  error?: string | null;
}

export default function TransactionList({
  selectedMonth,
  limit,
  onSeeAll,
  transactions: externalTransactions,
  loading: externalLoading,
  error: externalError
}: TransactionListProps) {
  // 如果传入了 transactions，使用外部数据；否则使用内部 hook 获取
  const {
    data: internalTransactions,
    loading: internalLoading,
    error: internalError
  } = useRecentTransactions({
    limit,
    selectedMonth
  });

  // 优先使用外部传入的数据和状态
  const transactions = externalTransactions ?? internalTransactions;
  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;
  return (
    <div className="group relative col-span-12 lg:col-span-8 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-cyan-500/10 dark:via-transparent dark:to-blue-500/10 pointer-events-none" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            See all
          </button>
        )}
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400 dark:text-slate-500 text-sm">
              Loading...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500 dark:text-red-400 text-sm">
              {error}
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400 dark:text-slate-500 text-sm">
              No transactions found
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
