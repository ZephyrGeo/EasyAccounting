import { useState, useEffect } from 'react';
import { ShoppingBag, Coffee, Car, Zap } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import MetricCard from '../cards/MetricCard';
import SpendingTrendChart from '../charts/SpendingTrendChart';
import CategoryPieChart from '../charts/CategoryPieChart';
import TransactionList from '../transactions/TransactionList';
import ProgressBar from '../ui/ProgressBar';
import { useWeeklyComparison } from '@/hooks/useWeeklyComparison';
import { useAvailableMonths } from '@/hooks/useAvailableMonths';

const categoryData = [
  { name: 'Shopping', value: 4500, color: '#6366f1' },
  { name: 'Food', value: 3200, color: '#ec4899' },
  { name: 'Transport', value: 2100, color: '#3b82f6' },
  { name: 'Others', value: 1100, color: '#94a3b8' },
];

const transactions = [
  {
    id: '1',
    name: 'Amazon JP',
    date: new Date().toISOString(),
    amount: -4401,
    icon: ShoppingBag,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: '2',
    name: 'Starbucks',
    date: new Date().toISOString(),
    amount: -998,
    icon: Coffee,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: '3',
    name: 'ENEOS Gas',
    date: new Date(Date.now() - 86400000).toISOString(),
    amount: -5230,
    icon: Car,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: '4',
    name: 'Netflix',
    date: new Date(Date.now() - 172800000).toISOString(),
    amount: -1490,
    icon: Zap,
    color: 'bg-red-100 text-red-600',
  },
];

export default function Dashboard() {
  // Fetch available months from database
  const { months: availableMonths, loading: monthsLoading } = useAvailableMonths();

  // 使用数据库中最新的月份作为初始值
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // 当月份数据加载完成后，设置为最新月份
  useEffect(() => {
    if (!monthsLoading && availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, monthsLoading, selectedMonth]);

  // Fetch weekly comparison data from database
  const { data: weeklyComparisonData, loading: trendLoading, error: trendError } = useWeeklyComparison();

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
        <SpendingTrendChart
          data={weeklyComparisonData}
          loading={trendLoading}
          error={trendError}
        />
        <CategoryPieChart data={categoryData} />

        {/* Row 3: Transactions and Insights */}
        <TransactionList transactions={transactions} onSeeAll={() => console.log('See all')} />

        {/* Right Column: Goals */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">Saving Goal</h3>
            <p className="text-xs text-slate-400 mb-4">Trip to Hokkaido</p>
            <ProgressBar value={45000} max={100000} color="green" size="md" className="mb-2" />
            <div className="flex justify-between text-xs font-semibold">
              <span>¥45,000</span>
              <span className="text-slate-400">Target: ¥100k</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
