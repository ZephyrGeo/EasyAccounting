import React from 'react';
import ProgressBar from '../ui/ProgressBar';

interface BudgetCardProps {
  used: number;
  total: number;
  label?: string;
}

export default function BudgetCard({ used, total, label = 'Monthly Budget' }: BudgetCardProps) {
  const percentage = Math.round((used / total) * 100);
  const remaining = total - used;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 font-medium text-sm">{label}</span>
        <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-xs font-bold">
          {percentage}% Used
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-slate-900">
            ¥{remaining.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400 mb-1">Left</span>
        </div>
        <ProgressBar value={used} max={total} color="gradient" size="lg" />
      </div>
    </div>
  );
}
