import ProgressBar from '@/components/ui/ProgressBar';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';

interface SavingGoalCardProps {
  title?: string;
  goalName: string;
  current: number;
  target: number;
  color?: 'blue' | 'green' | 'orange' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export default function SavingGoalCard({
  title = 'Saving Goal',
  goalName,
  current,
  target,
  color = 'green',
  size = 'md',
}: SavingGoalCardProps) {

  return (
    <div className="group relative bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700/50 hover:-translate-y-1 transition-all duration-300 dark:ring-1 dark:ring-white/5">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-green-500/10 dark:via-transparent dark:to-emerald-500/10 pointer-events-none" />

      <div className="relative z-10">
        {/* 标题 */}
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>

        {/* 目标名称 */}
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{goalName}</p>

        {/* 进度条 */}
        <ProgressBar
          value={current}
          max={target}
          color={color}
          size={size}
          className="mb-2"
        />

        {/* 金额显示 */}
        <div className="flex justify-between text-xs font-semibold dark:text-slate-300">
          <span>{formatCurrency(current)}</span>
          <span className="text-slate-400 dark:text-slate-500">Target: {formatCompactCurrency(target)}</span>
        </div>
      </div>
    </div>
  );
}
