import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { transformCategoryDataForChart, calculateTotal } from '@/utils/charts';
import { formatCompactCurrency, formatCurrency } from '@/utils/formatting';

interface CategoryPieChartProps {
  selectedMonth: string;
}

export default function CategoryPieChart({
  selectedMonth,
}: CategoryPieChartProps) {
  // 在组件内部获取数据
  const {
    data: categoryStats,
    loading,
    error,
  } = useCategoryStats(selectedMonth);

  // 标准化数据格式并添加颜色
  const dataWithColors = transformCategoryDataForChart(categoryStats);
  const total = calculateTotal(dataWithColors);

  return (
    <div className="group relative col-span-12 lg:col-span-4 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 flex flex-col hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-purple-500/10 dark:via-transparent dark:to-pink-500/10 pointer-events-none" />

      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 relative z-10">Top Categories</h3>

      <div className="relative z-10">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-slate-400 dark:text-slate-500 text-sm">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-slate-400 dark:text-slate-500 text-sm">No data available</div>
          </div>
        ) : (
          <>
            <div className="w-full h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithColors}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {dataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs text-slate-400 dark:text-slate-500">Total</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
                  {formatCompactCurrency(total)}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {dataWithColors.slice(0, 5).map((cat) => (
                <div
                  key={cat.name}
                  className="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30 p-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-slate-600 dark:text-slate-400">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
