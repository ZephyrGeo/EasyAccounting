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
  // 在组件内部获取数据 (这里传入 transactions 的逻辑可能需要根据实际 hooks 调整，暂时保持原逻辑)
  const {
    data: categoryStats,
    loading,
    error,
  } = useCategoryStats("");

  // 标准化数据格式并添加颜色
  const dataWithColors = transformCategoryDataForChart(categoryStats);
  const total = calculateTotal(dataWithColors);

  return (
    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-lg border border-[#E5E5E0] flex flex-col">
      <h3 className="font-medium text-[16px] text-[#1A1A1A] mb-6">Top Categories</h3>

      <div className="relative z-10">
        {loading ? (
          <div className="flex items-center justify-center flex-1 py-12">
            <div className="text-[#8E8E8E] text-sm">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1 py-12">
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="flex items-center justify-center flex-1 py-12">
            <div className="text-[#8E8E8E] text-sm">No data available</div>
          </div>
        ) : (
          <>
            <div className="w-full h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithColors}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Total</span>
                <span className="text-[18px] font-medium text-[#1A1A1A] font-serif mt-0.5">
                  {formatCompactCurrency(total)}
                </span>
              </div>
            </div>

            {/* Legend - Minimal style */}
            <div className="mt-6 space-y-1">
              {dataWithColors.slice(0, 5).map((cat) => (
                <div
                  key={cat.name}
                  className="flex justify-between items-center text-[13px] py-1.5 border-b border-[#F0F0EA] last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-[#4A4A4A]">{cat.name}</span>
                  </div>
                  <span className="font-medium text-[#1A1A1A] tabular-nums">
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
