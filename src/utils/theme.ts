/**
 * 主题相关的工具函数
 */

/**
 * 根据主题模式返回对应的 CSS 类名
 * 用于在运行时动态选择浅色或深色模式的样式类
 *
 * @param isDark - 是否为深色模式
 * @param darkClass - 深色模式下使用的类名
 * @param lightClass - 浅色模式下使用的类名
 * @returns 对应主题模式的类名
 *
 * @example
 * ```tsx
 * const textClass = getThemeClass(isDarkMode, 'text-white', 'text-slate-900');
 * // 深色模式: 'text-white'
 * // 浅色模式: 'text-slate-900'
 * ```
 */
export function getThemeClass(isDark: boolean, darkClass: string, lightClass: string): string {
  return isDark ? darkClass : lightClass;
}
