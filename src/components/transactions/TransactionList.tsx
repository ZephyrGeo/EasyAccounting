import TransactionItem from './TransactionItem';
import { useRecentTransactions } from '@/hooks/useRecentTransactions';

interface TransactionListProps {
  selectedMonth: string;
  limit?: number;
  onSeeAll?: () => void;
}

export default function TransactionList({
  selectedMonth,
  limit,
  onSeeAll
}: TransactionListProps) {
  const {
    data: transactions,
    loading,
    error
  } = useRecentTransactions({
    limit,
    selectedMonth
  });
  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-slate-800">Recent Transactions</h3>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm text-blue-600 hover:underline"
          >
            See all
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-400 text-sm">No transactions found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
