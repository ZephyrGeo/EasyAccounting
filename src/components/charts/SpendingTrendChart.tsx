import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useWeeklyComparison } from '@/hooks/useWeeklyComparison';
import { WEEK_COLORS } from '@/constants/colors';

interface SpendingTrendChartProps {
  selectedMonth: string;
}

export default function SpendingTrendChart({ selectedMonth }: SpendingTrendChartProps) {
  // 在组件内部获取数据
  const { data, weekCount, loading, error } = useWeeklyComparison(selectedMonth);

  return (
    <div className="group relative col-span-12 lg:col-span-8 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-indigo-500/10 dark:via-transparent dark:to-violet-500/10 pointer-events-none" />

      <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4 mb-6 relative z-10">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Weekly Spending Comparison</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Compare spending patterns across {weekCount} weeks</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-slate-400 dark:text-slate-500 text-sm">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-slate-400 dark:text-slate-500 text-sm">No data available</div>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 15, right: 15 }}>
              <defs>
                <linearGradient id="fillWeek1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WEEK_COLORS.week1} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={WEEK_COLORS.week1} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillWeek2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WEEK_COLORS.week2} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={WEEK_COLORS.week2} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillWeek3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WEEK_COLORS.week3} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={WEEK_COLORS.week3} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillWeek4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WEEK_COLORS.week4} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={WEEK_COLORS.week4} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillWeek5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WEEK_COLORS.week5} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={WEEK_COLORS.week5} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="dayOfWeek"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                interval={0}
              />
              <Tooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">
                          {payload[0].payload.dayOfWeek}
                        </p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-xs" style={{ color: entry.color }}>
                              {entry.name}:
                            </span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                              ¥{Math.abs(entry.value as number).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="line"
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              />
              <Area
                type="monotone"
                dataKey="week1"
                name="Week 1"
                stroke={WEEK_COLORS.week1}
                strokeWidth={2}
                fill="url(#fillWeek1)"
              />
              <Area
                type="monotone"
                dataKey="week2"
                name="Week 2"
                stroke={WEEK_COLORS.week2}
                strokeWidth={2}
                fill="url(#fillWeek2)"
              />
              <Area
                type="monotone"
                dataKey="week3"
                name="Week 3"
                stroke={WEEK_COLORS.week3}
                strokeWidth={2}
                fill="url(#fillWeek3)"
              />
              <Area
                type="monotone"
                dataKey="week4"
                name="Week 4"
                stroke={WEEK_COLORS.week4}
                strokeWidth={2}
                fill="url(#fillWeek4)"
              />
              {weekCount === 5 && (
                <Area
                  type="monotone"
                  dataKey="week5"
                  name="Week 5"
                  stroke={WEEK_COLORS.week5}
                  strokeWidth={2}
                  fill="url(#fillWeek5)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
