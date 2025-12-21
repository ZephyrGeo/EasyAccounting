import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import TransactionList from '../transactions/TransactionList';
import TransactionFilters from '../transactions/TransactionFilters';
import ActivityHeatmap from '../charts/ActivityHeatmap';
import { useSelectedMonth } from '@/hooks/useSelectedMonth';
import { useTransactions } from '@/hooks/useTransactions';
import { isIncomeCategory } from '@/utils/categoryIcons';

type FilterType = 'all' | 'expense' | 'income';

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);

  // 获取可用月份和选中月份
  const {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    loading: monthsLoading,
  } = useSelectedMonth();

  // 筛选和搜索状态
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // 获取所有交易数据
  const { data: allTransactions, loading, error, refetch } = useTransactions({ selectedMonth });

  // 客户端筛选逻辑
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    // 类型筛选 - 基于分类而非金额符号（数据库中所有金额都是正数）
    if (filterType === 'expense') {
      result = result.filter((tx) => !isIncomeCategory(tx.category));
    } else if (filterType === 'income') {
      result = result.filter((tx) => isIncomeCategory(tx.category));
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.merchant.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query) ||
          (tx.notes?.toLowerCase().includes(query) ?? false) ||
          (tx.labels?.some((label) => label.toLowerCase().includes(query)) ?? false)
      );
    }

    return result;
  }, [allTransactions, filterType, searchQuery]);

  // 如果月份还在加载中，显示加载状态
  if (monthsLoading || !selectedMonth) {
    return (
      <DashboardLayout
        title="Transactions"
        description="Manage your financial records."
        activeRoute={activeRoute}
        onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 text-center py-12 text-slate-400">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Transactions"
      description="Manage your financial records."
      activeRoute={activeRoute}
      onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* 活动热图 */}
        <ActivityHeatmap
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
        />

        {/* 交易列表卡片 - 全宽 */}
        <div className="col-span-12 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
          />
          <TransactionList
            transactions={filteredTransactions}
            loading={loading}
            error={error}
            enableActions={true}
            onRefresh={refetch}
            showTitle={false}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
