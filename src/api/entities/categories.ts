import { supabase } from "@/lib/supabase";

/**
 * 获取或创建分类
 * 如果分类不存在则自动创建新分类记录
 * @param categoryName - 分类名称
 * @returns 分类ID
 * @throws 如果创建分类失败则抛出错误
 */
export async function getOrCreateCategory(categoryName: string): Promise<number> {
  // 先查询是否存在
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (existing) {
    return existing.id;
  }

  // 不存在则创建
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert([{ name: categoryName }])
    .select('id')
    .single();

  if (error || !newCategory) {
    throw new Error(`Failed to create category: ${categoryName}`);
  }

  return newCategory.id;
}
