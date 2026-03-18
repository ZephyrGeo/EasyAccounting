import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/cards/MetricCard';
import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import SavingGoalCard from '@/components/cards/SavingGoalCard';
import { useTransactions } from '@/hooks/useTransactions';
import { getActiveRoute } from '@/utils/routing';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);

  // 获取所有交易数据
  const { data: transactions, loading } = useTransactions();

  // 如果数据还在加载中，显示加载状态
  if (loading) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="Calculating your financial overview..."
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
      description={`You have ${transactions.length} transactions in total.`}
      onAddBill={() => console.log('Add bill clicked')}
      activeRoute={activeRoute}
      onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: Key Metrics (已移除日期切换) */}
        <div className="col-span-12 relative z-20">
          <MetricCard
            transactions={transactions}
          />
        </div>

        {/* Row 2: Charts (它们现在将分析所有交易数据) */}
        <SpendingTrendChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />

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