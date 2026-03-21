import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types/transaction";
import { getOrCreateCategory } from "../entities/categories";
import { getOrCreateMerchant } from "../entities/merchants";
import { getOrCreatePaymentMethod } from "../entities/paymentMethods";

/**
 * 将 AI 解析后的交易数据导入到数据库
 * 这个函数会处理所有外键关联（分类、商户、品牌、支付方式）
 */
export async function importAITransactions(transactions: Transaction[]): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  const userId = user.id;

  console.log(`Starting to import ${transactions.length} AI parsed transactions...`);

  // 由于存在外键约束，我们需要逐条处理或分批处理，并且先建立关联实体
  for (const t of transactions) {
    try {
      // 1. 获取或创建 Category
      const categoryId = await getOrCreateCategory(t.category.name);

      // 2. 获取或创建 Merchant (及关联的 Brand)
      const merchantId = await getOrCreateMerchant(t.merchant.name, t.merchant.brand?.name);

      // 3. 获取或创建 Payment Method
      let paymentMethodId = null;
      if (t.payment_method?.name) {
        paymentMethodId = await getOrCreatePaymentMethod(t.payment_method.name);
      }

      // 4. 插入主交易记录
      const { error } = await supabase.from("transactions").insert([
        {
          user_id: userId,
          amount: t.amount,
          date: t.date,
          merchant_id: merchantId,
          category_id: categoryId,
          payment_method_id: paymentMethodId,
          notes: t.notes || null,
          is_recurring: t.is_recurring || false,
          ai_metadata: { source: "claude_parsing", confidence: "high" }, // 可以在这里保存AI相关的原始数据
        },
      ]);

      if (error) {
        console.error(`Failed to insert transaction for merchant ${t.merchant.name}:`, error);
      }
    } catch (err) {
      console.error(`Error processing transaction:`, err);
      // 继续处理下一条
    }
  }

  console.log("Import completed.");
}
