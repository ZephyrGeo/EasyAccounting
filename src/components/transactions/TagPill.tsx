import { useTheme } from '@/contexts/ThemeContext';
import { getColorForLabel } from '@/constants/tagColors';
import { getThemeClass } from '@/utils/theme';

interface TagPillProps {
  label: string;
  variant?: 'default' | 'compact';
}

export default function TagPill({ label, variant = 'default' }: TagPillProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const color = getColorForLabel(label);

  const sizeClasses = variant === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const tagClasses = `
    inline-flex items-center rounded-full font-semibold
    transition-all duration-300 cursor-default whitespace-nowrap
    ${sizeClasses}
    ${color.bg}
    ${getThemeClass(isDarkMode, color.darkText, color.text)}
  `;

  return <span className={tagClasses}>{label}</span>;
}
