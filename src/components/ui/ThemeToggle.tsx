import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg" />

      <div className="relative z-10">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 text-slate-600 dark:text-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
