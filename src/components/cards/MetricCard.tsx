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
    <div className="group relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 overflow-visible backdrop-blur-sm dark:ring-1 dark:ring-white/5">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 pointer-events-none" />

      <div className="overflow-visible relative z-10">
        <div className="flex items-center justify-between mb-1 overflow-visible">
          <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Total Expense ({formatMonthDisplay(selectedMonth)})
          </h4>
          <MonthPicker
            value={selectedMonth}
            onChange={onMonthChange}
            availableMonths={availableMonths}
          />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] tracking-tight">
          {totalLoading ? "Loading..." : formatAmount(monthlyTotal)}
        </h2>
      </div>
      <div className="flex items-center gap-2 mt-4 relative z-10">
        <div
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${
            trendGood
              ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 dark:ring-1 dark:ring-green-500/30"
              : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 dark:ring-1 dark:ring-red-500/30"
          }`}
        >
          {trendGood ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : (
            <TrendingUp className="w-3 h-3 mr-1" />
          )}
          {trend}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">{subtext}</span>
      </div>
    </div>
  );
}
