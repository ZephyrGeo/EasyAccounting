import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCategoryIcon } from '@/utils/categoryIcons';
import TagPill from './TagPill';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  // 根据 category 动态获取图标配置
  const categoryConfig = getCategoryIcon(transaction.category);
  const Icon = categoryConfig.icon;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryConfig.bgColor}`}>
          <Icon className={`w-5 h-5 ${categoryConfig.textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">
            {transaction.merchant}
          </p>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(transaction.date)}</p>
            {transaction.labels && transaction.labels.length > 0 && (
              <>
                {transaction.labels.map((label) => (
                  <TagPill key={label} label={label} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {transaction.category}
        </p>
      </div>
    </div>
  );
}
