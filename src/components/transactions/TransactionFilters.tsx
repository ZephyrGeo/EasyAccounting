import { Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeClass } from '@/utils/theme';

type FilterType = 'all' | 'expense' | 'income';

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ children, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-blue-500 text-white dark:bg-blue-600 shadow-sm'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
}: TransactionFiltersProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
      {/* 搜索输入框 */}
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${getThemeClass(
            isDarkMode,
            "bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50",
            "bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-100"
          )}`}
        />
      </div>

      {/* 筛选按钮组 */}
      <div className="flex gap-2">
        <FilterButton active={filterType === 'all'} onClick={() => onFilterChange('all')}>
          All
        </FilterButton>
        <FilterButton active={filterType === 'expense'} onClick={() => onFilterChange('expense')}>
          Expense
        </FilterButton>
        <FilterButton active={filterType === 'income'} onClick={() => onFilterChange('income')}>
          Income
        </FilterButton>
      </div>
    </div>
  );
}
