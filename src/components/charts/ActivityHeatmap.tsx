import { Activity } from 'lucide-react';
import MonthPicker from '@/components/ui/MonthPicker';
import { useActivityHeatmap } from '@/hooks/useActivityHeatmap';

interface ActivityHeatmapProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
}

export default function ActivityHeatmap({
  selectedMonth,
  onMonthChange,
  availableMonths,
}: ActivityHeatmapProps) {
  // 获取该月的交易活动热图数据
  const heatmapData = useActivityHeatmap(selectedMonth);

  return (
    <div className="group relative col-span-12 lg:col-span-4 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-cyan-500/10 dark:via-transparent dark:to-blue-500/10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Heat Map</h3>
          </div>
          <MonthPicker
            value={selectedMonth}
            onChange={onMonthChange}
            availableMonths={availableMonths}
          />
        </div>

        {/* 热图网格 */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {heatmapData.map((data, i) => (
            <div
              key={i}
              className={`aspect-square rounded transition-all duration-200 ${
                data.intensity > 2
                  ? 'bg-purple-500 dark:bg-purple-400'
                  : data.intensity > 0
                  ? 'bg-purple-300 dark:bg-purple-600'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}
              style={{ opacity: data.intensity > 0 ? 0.4 + data.intensity * 0.15 : 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
