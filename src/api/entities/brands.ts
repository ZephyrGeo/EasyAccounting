import { supabase } from "@/lib/supabase";

/**
 * 获取或创建品牌
 * @param brandName - 品牌名称
 * @returns 品牌 ID (BIGINT)
 */
export async function getOrCreateBrand(brandName: string): Promise<number | null> {
  if (!brandName) return null;

  // 查询是否存在
  const { data: existing, error: searchError } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .maybeSingle(); // 使用 maybeSingle 替代 single 避免报错

  if (searchError) {
    console.error(`Error searching brand ${brandName}:`, searchError);
  }

  if (existing) {
    return existing.id;
  }

  // 不存在则创建
  const { data: newBrand, error } = await supabase
    .from('brands')
    .insert([{ name: brandName }])
    .select('id')
    .maybeSingle();

  if (error || !newBrand) {
    console.error(`Failed to create brand: ${brandName}`, error);
    return null; 
  }

  return newBrand.id;
}
