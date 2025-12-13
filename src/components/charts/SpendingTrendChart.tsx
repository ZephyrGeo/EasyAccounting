import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Select from '../ui/Select';

interface TrendDataPoint {
  name: string;
  value: number;
}

interface SpendingTrendChartProps {
  data: TrendDataPoint[];
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export default function SpendingTrendChart({
  data,
  period = 'This Week',
  onPeriodChange,
}: SpendingTrendChartProps) {
  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">Spending Trend (Last 6 Months)</h3>
        {onPeriodChange && (
          <Select
            value={period}
            onChange={onPeriodChange}
            options={periodOptions}
          />
        )}
      </div>

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
