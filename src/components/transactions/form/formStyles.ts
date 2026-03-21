/**
 * Shared form styles for transaction forms
 */
export const FORM_STYLES = {
  label: "block text-xs font-semibold text-[#6B6B6B] dark:text-[#8E8E8E] mb-1.5 uppercase tracking-wider",
  input:
    "w-full px-4 py-2.5 rounded-xl bg-[#F7F7F3] dark:bg-[#2A2A2A] border border-[#E5E5E0] dark:border-[#333333] text-[#1A1A1A] dark:text-white text-[13.5px] focus:ring-1 focus:ring-[#1A1A1A] focus:border-transparent transition-all outline-none",
  button:
    "w-full py-3 mt-4 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl text-[14px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
} as const;
