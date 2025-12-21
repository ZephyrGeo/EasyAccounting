import { useState } from 'react';
import TransactionItem from './TransactionItem';
import TransactionModal from './TransactionModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useRecentTransactions } from '@/hooks/useRecentTransactions';
import { Transaction } from '@/types/transaction';
import { updateTransaction, deleteTransaction } from '@/api/transactions/crud';

interface TransactionListProps {
  selectedMonth?: string;
  limit?: number;
  onSeeAll?: () => void;
  // 新增：支持直接传入交易数据
  transactions?: Transaction[];
  loading?: boolean;
  error?: string | null;
  // 新增：是否启用编辑/删除功能
  enableActions?: boolean;
  // 新增：刷新回调（用于编辑/删除后刷新数据）
  onRefresh?: () => void;
  // 新增：是否显示标题
  showTitle?: boolean;
}

export default function TransactionList({
  selectedMonth,
  limit,
  onSeeAll,
  transactions: externalTransactions,
  loading: externalLoading,
  error: externalError,
  enableActions = false,
  onRefresh,
  showTitle = true,
}: TransactionListProps) {
  // 编辑和删除的状态管理
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // 如果传入了 transactions，使用外部数据；否则使用内部 hook 获取
  const {
    data: internalTransactions,
    loading: internalLoading,
    error: internalError,
  } = useRecentTransactions({
    limit,
    selectedMonth
  });

  // 优先使用外部传入的数据和状态
  const transactions = externalTransactions ?? internalTransactions;
  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;

  // 编辑处理
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    try {
      await updateTransaction(updatedTransaction.id, updatedTransaction);

      // 刷新数据（如果提供了刷新回调）
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
      // TODO: 显示错误提示给用户
    } finally {
      setEditingTransaction(null);
    }
  };

  // 删除处理
  const handleDelete = (id: string) => {
    const transaction = transactions.find(tx => tx.id === id);
    if (transaction) {
      setDeletingTransaction(transaction);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;

    try {
      await deleteTransaction(deletingTransaction.id);

      // 刷新数据（如果提供了刷新回调）
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      // TODO: 显示错误提示给用户
    } finally {
      setDeletingTransaction(null);
    }
  };
  return (
    <div className="group relative col-span-12 lg:col-span-8 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-cyan-500/10 dark:via-transparent dark:to-blue-500/10 pointer-events-none" />

      {showTitle && (
        <div className="flex justify-between items-center mb-4 relative z-10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Transactions
          </h3>
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all cursor-pointer"
            >
              See all →
            </button>
          )}
        </div>
      )}

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
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={enableActions ? handleEdit : undefined}
                onDelete={enableActions ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* 编辑模态框 */}
      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleSaveEdit}
        />
      )}

      {/* 删除确认模态框 */}
      {deletingTransaction && (
        <DeleteConfirmModal
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={handleConfirmDelete}
          transaction={deletingTransaction}
        />
      )}
    </div>
  );
}
