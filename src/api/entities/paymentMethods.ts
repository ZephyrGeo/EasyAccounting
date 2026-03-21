import { supabase } from "@/lib/supabase";

/**
 * 获取或创建支付方式
 * @param methodName - 支付方式名称
 * @returns 支付方式ID
 */
export async function getOrCreatePaymentMethod(methodName: string): Promise<number | null> {
  if (!methodName) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  const userId = user.id;

  // 查询是否存在
  const { data: existing, error: searchError } = await supabase
    .from("payment_methods")
    .select("id")
    .eq("name", methodName)
    .eq("user_id", userId)
    .maybeSingle();

  if (searchError) {
    console.error(`Error searching payment method: ${methodName}`, searchError);
  }

  if (existing) {
    return existing.id;
  }

  // 推测类型
  let type = "unknown";
  const lowerName = methodName.toLowerCase();
  if (lowerName.includes("visa") || lowerName.includes("mastercard") || lowerName.includes("credit")) type = "credit";
  else if (lowerName.includes("debit")) type = "debit";
  else if (lowerName.includes("cash")) type = "cash";
  else if (lowerName.includes("alipay") || lowerName.includes("wechat") || lowerName.includes("pay"))
    type = "mobile_pay";

  // 创建新支付方式
  const { data: newMethod, error } = await supabase
    .from("payment_methods")
    .insert([
      {
        name: methodName,
        type: type,
        user_id: userId,
      },
    ])
    .select("id")
    .single();

  if (error || !newMethod) {
    console.error(`Failed to create payment method: ${methodName}`, error);
    return null;
  }

  return newMethod.id;
}
