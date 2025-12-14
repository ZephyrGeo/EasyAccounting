import { TrendingDown, TrendingUp } from "lucide-react";
import MonthPicker from "@/components/ui/MonthPicker";
import { useSelectedMonthlyTotal } from "@/hooks/useSelectedMonthlyTotal";
import { formatMonthDisplay } from "@/constants/date";
import { formatAmount } from "@/utils/format";

interface MetricCardProps {
  trend: string;
  trendGood: boolean;
  subtext: string;
  selectedMonth: string; // 格式: "2025-11"
  onMonthChange: (month: string) => void;
  availableMonths: string[]; // 可用的月份列表
}

export default function MetricCard({
  trend,
  trendGood,
  subtext,
  selectedMonth,
  onMonthChange,
  availableMonths,
}: MetricCardProps) {
  // 在组件内部获取数据
  const { total: monthlyTotal, loading: totalLoading } = useSelectedMonthlyTotal(selectedMonth);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition duration-300 overflow-visible">
      <div className="overflow-visible">
        <div className="flex items-center justify-between mb-1 overflow-visible">
          <h4 className="text-slate-500 font-medium text-sm">
            Total Expense ({formatMonthDisplay(selectedMonth)})
          </h4>
          <MonthPicker
            value={selectedMonth}
            onChange={onMonthChange}
            availableMonths={availableMonths}
          />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          {totalLoading ? "Loading..." : formatAmount(monthlyTotal)}
        </h2>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            trendGood
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trendGood ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : (
            <TrendingUp className="w-3 h-3 mr-1" />
          )}
          {trend}
        </div>
        <span className="text-xs text-slate-400">{subtext}</span>
      </div>
    </div>
  );
}
