import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getChartColor } from "@/constants/colors";
import { useCategoryStats } from "@/hooks/useCategoryStats";

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
  const dataWithColors = categoryStats.map((item, index) => {
    const name = item.category;
    const value = item.amount;

    return {
      name,
      value,
      color: getChartColor(index),
    };
  });

  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col">
      <h3 className="font-bold text-lg text-slate-800 mb-4">Top Categories</h3>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      ) : categoryStats.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-slate-400 text-sm">No data available</div>
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
              <span className="text-xs text-slate-400">Total</span>
              <span className="font-bold text-slate-800">
                ¥{(total / 1000).toFixed(1)}K
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {dataWithColors.slice(0, 5).map((cat) => (
              <div
                key={cat.name}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="text-slate-600">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  ¥{cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
