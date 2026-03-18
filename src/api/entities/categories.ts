import { supabase } from "@/lib/supabase";

/**
 * 获取或创建分类
 * @param categoryName - 分类名称
 * @returns 分类ID
 */
export async function getOrCreateCategory(categoryName: string): Promise<number | null> {
  if (!categoryName) return null;

  // Hardcoded for testing
  const userId = 'd1beb15e-f484-49d7-89d9-ccdc622bf2bc';

  // 查询是否存在（系统预设的 user_id IS NULL，或者用户自定义的 user_id = userId）
  const { data: existing, error: searchError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();

  if (searchError) {
    console.error(`Category Search Error: ${categoryName}`, searchError);
  }

  if (existing) {
    return existing.id;
  }

  // 不存在则创建（归属于当前用户）
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert([{ 
      name: categoryName,
      user_id: userId
    }])
    .select('id')
    .single();

  if (error || !newCategory) {
    console.error(`Failed to create category: ${categoryName}`, error);
    return null; // 返回 null，不抛出错误中断流程
  }

  return newCategory.id;
}
