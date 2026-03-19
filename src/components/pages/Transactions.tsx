import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionList from '@/components/transactions/TransactionList';
import DeleteConfirmModal from '@/components/transactions/DeleteConfirmModal';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransaction } from '@/api/transactions';
import { getActiveRoute } from '@/utils/routing';
import { Transaction } from '@/types/transaction';

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);

  // 获取数据
  const { data: allTransactions, loading, refetch } = useTransactions();

  // 删除状态 - 存储整个对象以便弹窗显示
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 执行删除
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    try {
      setIsDeleting(true);
      await deleteTransaction(deleteTarget.id);
      await refetch(); // 刷新列表
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete transaction. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Transactions"
        activeRoute={activeRoute}
        onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Transactions"
      activeRoute={activeRoute}
      onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
    >
      <div className="flex flex-col">
        <TransactionList
          transactions={allTransactions}
          onDelete={(id) => {
            const target = allTransactions.find(t => t.id === id);
            if (target) setDeleteTarget(target);
          }}
          className="w-full"
        />
      </div>

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          transaction={deleteTarget}
        />
      )}
    </DashboardLayout>
  );
}
