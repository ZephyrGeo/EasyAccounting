import React from 'react';
import TransactionItem from './TransactionItem';
import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  icon: LucideIcon;
  color: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onSeeAll?: () => void;
}

export default function TransactionList({ transactions, onSeeAll }: TransactionListProps) {
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
      <div className="space-y-4">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} {...tx} />
        ))}
      </div>
    </div>
  );
}
