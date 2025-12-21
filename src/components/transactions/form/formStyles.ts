/**
 * Shared form styles for transaction forms
 */
export const FORM_STYLES = {
  label: 'block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5',
  input:
    'w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all',
  button:
    'w-full py-3 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
} as const;
