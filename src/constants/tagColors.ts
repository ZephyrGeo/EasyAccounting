/**
 * 标签颜色配置
 */

export interface TagColorConfig {
  bg: string; // 背景色类
  text: string; // 浅色模式文字颜色
  darkText: string; // 深色模式文字颜色
}

/**
 * 预定义的标签颜色映射
 * 用于为不同的标签提供一致的视觉识别
 */
export const TAG_COLORS: TagColorConfig[] = [
  { bg: 'bg-indigo-500/20', text: 'text-indigo-600', darkText: 'text-indigo-300' },
  { bg: 'bg-teal-500/20', text: 'text-teal-600', darkText: 'text-teal-300' },
  { bg: 'bg-pink-500/20', text: 'text-pink-600', darkText: 'text-pink-300' },
  { bg: 'bg-amber-500/20', text: 'text-amber-600', darkText: 'text-amber-300' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-600', darkText: 'text-cyan-300' },
  { bg: 'bg-purple-500/20', text: 'text-purple-600', darkText: 'text-purple-300' },
];

/**
 * 使用确定性哈希函数将标签字符串映射到颜色
 * @param label - 标签文本
 * @returns 对应的颜色配置
 */
export function getColorForLabel(label: string): TagColorConfig {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
