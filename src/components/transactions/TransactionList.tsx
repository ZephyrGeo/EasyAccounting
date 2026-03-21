import React, { useState } from "react";
import { Transaction } from "@/types/transaction";
import TransactionItem from "./TransactionItem";
import TransactionModal from "./TransactionModal";
import { updateTransaction } from "@/api/transactions";
import { TransactionGroup } from "@/utils/transactions";

interface TransactionListProps {
  groupedTransactions: TransactionGroup[];
  className?: string;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
}

/**
 * 纯粹的渲染容器 (Dumb Component)：不再关心过滤和分组逻辑，只负责显示。
 */
export default function TransactionList({
  groupedTransactions,
  className = "",
  onDelete,
  onRefresh,
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSave = async (updated: Transaction) => {
    try {
      await updateTransaction(updated.id, updated);
      onRefresh?.();
      setEditingTransaction(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update transaction.");
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E0] dark:border-[#333333] overflow-hidden flex flex-col min-h-[600px] shadow-sm ${className}`}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1A1A1A]">
        {groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <img
                src="/illustrations/undraw_wallet_diag.svg"
                alt="No transactions"
                className="w-48 h-48 md:w-56 md:h-56 object-contain opacity-70"
              />
            </div>
            <h4 className="text-[18px] font-medium text-[#1A1A1A] dark:text-white mb-2 font-serif">
              Clear as fresh snow
            </h4>
            <p className="text-[14px] text-[#8E8E8E] max-w-[280px] leading-relaxed">
              No transactions match your criteria. Adjust your search or filters to see more.
            </p>
          </div>
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.date}>
              <div className="sticky top-0 z-10 bg-[#F7F7F3]/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md px-6 py-2 border-b border-[#E5E5E0] dark:border-[#333333]">
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
