import { useState, useRef } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatting';
import { formatDate } from '@/utils/date';
import { getCategoryIcon } from '@/utils/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeClass } from '@/utils/theme';
import { useClickOutside } from '@/hooks/useClickOutside';
import TagPill from './TagPill';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // 根据 category 动态获取图标配置
  const categoryConfig = getCategoryIcon(transaction.category);
  const Icon = categoryConfig.icon;

  // 点击外部关闭菜单
  useClickOutside(menuRef, () => setShowMenu(false), showMenu);

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(transaction);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete?.(transaction.id);
  };

  // 如果没有传入 onEdit 和 onDelete，则不显示操作按钮
  const showActions = onEdit || onDelete;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition relative">
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
            {transaction.tags && transaction.tags.length > 0 && (
              <>
                {transaction.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right min-w-25">
          <p className="font-bold text-slate-900 dark:text-slate-200 text-base">
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {transaction.category}
          </p>
        </div>

        {/* 操作菜单 (Edit/Delete) */}
        {showActions && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${getThemeClass(
                isDarkMode,
                'text-slate-400 hover:text-white hover:bg-slate-600',
                'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              )}`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
