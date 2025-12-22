import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/cards/MetricCard';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import TransactionList from '@/components/transactions/TransactionList';
import SavingGoalCard from '@/components/cards/SavingGoalCard';
import { useSelectedMonth } from '@/hooks/useSelectedMonth';
import { getActiveRoute } from '@/utils/routing';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);

  // 获取可用月份和选中月份
  const {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    loading: monthsLoading,
  } = useSelectedMonth();

  // 如果月份还在加载中，显示加载状态
  if (monthsLoading || !selectedMonth) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="Welcome back, here's your financial overview."
        onAddBill={() => console.log('Add bill clicked')}
        activeRoute={activeRoute}
        onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 text-center py-12 text-slate-400">
            Loading...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      description="Welcome back, here's your financial overview."
      onAddBill={() => console.log('Add bill clicked')}
      activeRoute={activeRoute}
      onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: Key Metrics */}
        <div className="col-span-12 relative z-20">
          <MetricCard
            trend="-0.8%"
            trendGood={true}
            subtext="vs last month"
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>

        {/* Row 2: Charts */}
        <SpendingTrendChart selectedMonth={selectedMonth} />
        <CategoryPieChart selectedMonth={selectedMonth} />

        {/* Row 3: Transactions and Insights */}
        <TransactionList
          selectedMonth={selectedMonth}
          onSeeAll={() => navigate('/transactions')}
        />

        {/* Right Column: Goals */}
        <div className="col-span-12 lg:col-span-4">
          <SavingGoalCard
            goalName="Trip to Hokkaido"
            current={45000}
            target={100000}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
