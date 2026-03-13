import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getColorForTag } from '@/utils/colors';
import { getThemeClass } from '@/utils/theme';

interface TagPillProps {
  tag: string;
  variant?: 'default' | 'compact';
  onRemove?: () => void;
}

export default function TagPill({ tag, variant = 'default', onRemove }: TagPillProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const color = getColorForTag(tag);

  const sizeClasses = variant === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const tagClasses = `
    inline-flex items-center rounded-full font-semibold
    transition-all duration-300 whitespace-nowrap
    ${sizeClasses}
    ${color.bg}
    ${getThemeClass(isDarkMode, color.darkText, color.text)}
    ${onRemove ? 'gap-1' : 'cursor-default'}
  `;

  return (
    <span className={tagClasses}>
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
