import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col">
      <h3 className="font-bold text-lg text-slate-800 mb-4">
        Structure (Top Categories)
      </h3>

      <div className="w-full h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
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
        {data.slice(0, 3).map((cat) => (
          <div key={cat.name} className="flex justify-between items-center text-sm">
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
    </div>
  );
}
