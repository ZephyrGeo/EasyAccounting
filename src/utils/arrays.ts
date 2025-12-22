/**
 * 数组操作工具函数
 */

/**
 * 向数组添加唯一项
 * @param array - 源数组
 * @param item - 要添加的项
 * @returns 添加了项的新数组（如果不重复）
 */
export function addUniqueItem<T>(array: T[], item: T): T[] {
  return array.includes(item) ? array : [...array, item];
}

/**
 * 从数组中移除项
 * @param array - 源数组
 * @param item - 要移除的项
 * @returns 不包含该项的新数组
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter(i => i !== item);
}
