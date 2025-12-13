import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface TransactionItemProps {
  id: string;
  name: string;
  date: string;
  amount: number;
  icon: LucideIcon;
  color: string;
}

export default function TransactionItem({
  name,
  date,
  amount,
  icon: Icon,
  color,
}: TransactionItemProps) {
  const isExpense = amount < 0;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
            {name}
          </p>
          <p className="text-xs text-slate-400">{formatDate(date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-900 text-sm">
          {formatCurrency(amount)}
        </p>
        <p className="text-xs text-slate-400">
          {isExpense ? 'Expense' : 'Income'}
        </p>
      </div>
    </div>
  );
}
