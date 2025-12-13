import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendGood: boolean;
  subtext: string;
}

export default function MetricCard({ title, value, trend, trendGood, subtext }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition duration-300">
      <div>
        <h4 className="text-slate-500 font-medium text-sm mb-1">{title}</h4>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h2>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            trendGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {trendGood ? (
            <TrendingDown className="w-3 h-3 mr-1" />
          ) : (
            <TrendingUp className="w-3 h-3 mr-1" />
          )}
          {trend}
        </div>
        <span className="text-xs text-slate-400">{subtext}</span>
      </div>
    </div>
  );
}
