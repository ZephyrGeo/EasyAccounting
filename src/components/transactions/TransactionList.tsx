import React, { useMemo, useState } from 'react';
import { Transaction } from '@/types/transaction';
import TransactionItem from './TransactionItem';
import TransactionModal from './TransactionModal';
import { updateTransaction } from '@/api/transactions';
import { FilterMode } from './TagFilterBar';

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
  onSeeAll?: () => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  // 接收来自外部侧边栏的过滤状态
  searchQuery?: string;
  selectedTags?: string[];
  filterMode?: FilterMode;
}

export default function TransactionList({
  transactions,
  className = "",
  onDelete,
  onRefresh,
  searchQuery = "",
  selectedTags = [],
  filterMode = 'AND',
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // 1. 核心过滤逻辑
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const merchantName = t.merchant?.name || '';
      const categoryName = t.category?.name || '';

      const matchesSearch = 
        merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        (filterMode === 'AND' 
          ? selectedTags.every(tag => t.tags?.includes(tag))
          : selectedTags.some(tag => t.tags?.includes(tag)));

      return matchesSearch && matchesTags;
    });
  }, [transactions, searchQuery, selectedTags, filterMode]);

  // 2. 按日期分组
  const groupedTransactions = useMemo(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    const dateGroups: Record<string, Transaction[]> = {};
    
    filteredTransactions.forEach(t => {
      if (!dateGroups[t.date]) dateGroups[t.date] = [];
      dateGroups[t.date].push(t);
    });

    Object.keys(dateGroups).sort((a, b) => b.localeCompare(a)).forEach(date => {
      groups.push({
        date,
        items: dateGroups[date]
      });
    });

    return groups;
  }, [filteredTransactions]);

  const handleSave = async (updated: Transaction) => {
    try {
      await updateTransaction(updated.id, updated);
      onRefresh?.();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update transaction.');
    }
  };

  return (
    <div className={`bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E0] dark:border-[#333333] overflow-hidden flex flex-col min-h-[600px] shadow-sm ${className}`}>
      {/* 列表区域 - 已移除内部 Header */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1A1A1A]">
        {groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <img 
                src="/illustrations/undraw_wallet_diag.svg" 
                alt="No transactions" 
                className="w-48 h-48 md:w-56 md:h-56 object-contain opacity-70"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center"><svg class="w-10 h-10 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg></div>';
                }}
              />
            </div>
            <h4 className="text-[18px] font-medium text-[#1A1A1A] dark:text-white mb-2 font-serif">Clear as fresh snow</h4>
            <p className="text-[14px] text-[#8E8E8E] max-w-[280px] leading-relaxed">
              No transactions match your current filters. Try adjusting your search or date range.
            </p>
          </div>
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.date}>
              <div className="sticky top-0 z-10 bg-[#F7F7F3]/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md px-6 py-2 border-y border-[#E5E5E0] dark:border-[#333333] first:border-t-0">
                <span className="text-[11px] font-bold text-[#6B6B6B] dark:text-[#8E8E8E] uppercase tracking-wider">
                  {group.date}
                </span>
              </div>
              
              <div className="divide-y divide-[#F0F0EA] dark:divide-[#2A2A2A]">
                {group.items.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={(t) => setEditingTransaction(t)}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
