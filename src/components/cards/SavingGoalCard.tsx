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
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
      {/* 标题 */}
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>

      {/* 目标名称 */}
      <p className="text-xs text-slate-400 mb-4">{goalName}</p>

      {/* 进度条 */}
      <ProgressBar
        value={current}
        max={target}
        color={color}
        size={size}
        className="mb-2"
      />

      {/* 金额显示 */}
      <div className="flex justify-between text-xs font-semibold">
        <span>{formatCurrency(current)}</span>
        <span className="text-slate-400">Target: {formatCompactCurrency(target)}</span>
      </div>
    </div>
  );
}
