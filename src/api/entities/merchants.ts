import { supabase } from "@/lib/supabase";
import { getOrCreateBrand } from "./brands";

/**
 * 获取或创建商户，并自动关联品牌
 * @param merchantName - 商户具体名称（如“全家 二子玉川店”）
 * @param brandName - 品牌名称（如“FamilyMart”）
 * @returns 商户ID (BIGINT)
 */
export async function getOrCreateMerchant(
  merchantName: string,
  brandName?: string | null
): Promise<number | null> {
  if (!merchantName) return null;

  // 1. 获取品牌 ID (如果有)
  let brandId: number | null = null;
  if (brandName) {
    brandId = await getOrCreateBrand(brandName);
  }

  // 2. 查询商户是否存在
  const { data: existing, error: searchError } = await supabase
    .from('merchants')
    .select('id, brand_id')
    .eq('name', merchantName)
    .maybeSingle();

  if (searchError) {
    console.error(`Merchant Search Error: ${merchantName}`, searchError);
  }

  if (existing) {
    // 如果找到了商户，且传入了新的品牌，但该商户目前没有品牌，则更新它
    if (brandId && !existing.brand_id) {
      await supabase
        .from('merchants')
        .update({ brand_id: brandId })
        .eq('id', existing.id);
    }
    return existing.id;
  }

  // 3. 不存在则创建商户
  const { data: newMerchant, error } = await supabase
    .from('merchants')
    .insert([{ 
      name: merchantName,
      brand_id: brandId
    }])
    .select('id')
    .single();

  if (error || !newMerchant) {
    console.error(`Failed to create merchant: ${merchantName}`, error);
    return null;
  }

  return newMerchant.id;
}
