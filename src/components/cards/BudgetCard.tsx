import React from 'react';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/utils/formatting';
import { calculatePercentage } from '@/utils/math';

interface BudgetCardProps {
  used: number;
  total: number;
  label?: string;
}

export default function BudgetCard({ used, total, label = 'Monthly Budget' }: BudgetCardProps) {
  const percentage = calculatePercentage(used, total);
  const remaining = total - used;

  return (
    <div className="group relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-orange-500/10 dark:via-transparent dark:to-amber-500/10 pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{label}</span>
        <span className="bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md text-xs font-bold dark:ring-1 dark:ring-orange-500/30 backdrop-blur-sm">
          {percentage}% Used
        </span>
      </div>
      <div className="mt-4 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
            {formatCurrency(remaining)}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500 mb-1">Left</span>
        </div>
        <ProgressBar value={used} max={total} color="gradient" size="lg" />
      </div>
    </div>
  );
}
