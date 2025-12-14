import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import MetricCard from '../cards/MetricCard';
import SpendingTrendChart from '../charts/SpendingTrendChart';
import CategoryPieChart from '../charts/CategoryPieChart';
import TransactionList from '../transactions/TransactionList';
import SavingGoalCard from '../cards/SavingGoalCard';
import { useAvailableMonths } from '@/hooks/useAvailableMonths';

export default function Dashboard() {
  // Fetch available months from database
  const { months: availableMonths, loading: monthsLoading } = useAvailableMonths();

  // 使用数据库中最新的月份作为初始值，初始为 null
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // 当月份数据加载完成后，设置为最新月份
  useEffect(() => {
    if (!monthsLoading && availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, monthsLoading, selectedMonth]);

  // 如果月份还在加载中，显示加载状态
  if (monthsLoading || !selectedMonth) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="Welcome back, here's your financial overview."
        onAddBill={() => console.log('Add bill clicked')}
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
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: Key Metrics */}
        <div className="col-span-12">
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
          onSeeAll={() => console.log('See all')}
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
