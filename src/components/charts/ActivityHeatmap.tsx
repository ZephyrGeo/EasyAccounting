import React, { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { 
  generateHeatmapData, 
  getDayNames, 
  MONTH_LABELS,
  LEVEL_COLORS
} from '@/utils/heatmap';

interface ActivityHeatmapProps {
  transactions: Transaction[];
  className?: string;
}

export default function ActivityHeatmap({ 
  transactions, 
  className = "" 
}: ActivityHeatmapProps) {
  // 生成热图数据 (这里您可以根据需要调整为显示最近 12 个月或特定区间)
  const heatmapData = useMemo(() => {
    return generateHeatmapData(transactions);
  }, [transactions]);

  const days = getDayNames();

  return (
    <div className={`col-span-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Activity Overview
          </h3>
          <p className="text-sm text-slate-500">Your spending frequency</p>
        </div>
      </div>

      <div className="flex flex-col overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-1 mb-2">
          <div className="w-8" /> {/* Spacer for day labels */}
          <div className="flex flex-1 justify-between px-1">
            {MONTH_LABELS.map((month) => (
              <span key={month} className="text-[10px] font-medium text-slate-400 uppercase">
                {month}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-1">
          <div className="flex flex-col justify-between py-1 h-32">
            {days.map((day, i) => (
              <span key={day} className="text-[10px] font-medium text-slate-400 h-3 flex items-center">
                {i % 2 === 1 ? day : ''}
              </span>
            ))}
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-1 flex-1">
            {heatmapData.map((day, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:ring-2 hover:ring-blue-500/20 cursor-help ${LEVEL_COLORS[day.level]}`}
                title={`${day.date}: ${day.count} transactions`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <span className="text-[10px] font-medium text-slate-400 uppercase">Less</span>
        <div className="flex gap-1">
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
          ))}
        </div>
        <span className="text-[10px] font-medium text-slate-400 uppercase">More</span>
      </div>
    </div>
  );
}
