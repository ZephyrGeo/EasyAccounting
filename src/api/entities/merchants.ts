import { supabase } from "@/lib/supabase";

/**
 * 获取或创建商户
 * 如果商户不存在则自动创建新商户记录
 * @param merchantName - 商户名称
 * @returns 商户ID
 * @throws 如果创建商户失败则抛出错误
 */
export async function getOrCreateMerchant(merchantName: string): Promise<number> {
  // 先查询是否存在
  const { data: existing } = await supabase
    .from('merchants')
    .select('id')
    .eq('name', merchantName)
    .single();

  if (existing) {
    return existing.id;
  }

  // 不存在则创建
  const { data: newMerchant, error } = await supabase
    .from('merchants')
    .insert([{ name: merchantName }])
    .select('id')
    .single();

  if (error || !newMerchant) {
    throw new Error(`Failed to create merchant: ${merchantName}`);
  }

  return newMerchant.id;
}
