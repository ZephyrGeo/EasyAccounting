import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.amount < 0;

  // 根据 category 动态获取图标配置
  const categoryConfig = getCategoryIcon(transaction.category);
  const Icon = categoryConfig.icon;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryConfig.bgColor}`}>
          <Icon className={`w-5 h-5 ${categoryConfig.textColor}`} />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">
            {transaction.merchant}
          </p>
          <p className="text-xs text-slate-400">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-900 text-sm">
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-slate-400">
          {isExpense ? 'Expense' : 'Income'}
        </p>
      </div>
    </div>
  );
}
