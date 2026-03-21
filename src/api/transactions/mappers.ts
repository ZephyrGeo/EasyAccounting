import { Transaction } from "@/types/transaction";
import { DatabaseTransaction } from "./types";
import { normalizeCategoryName } from "@/constants/categories";

/**
 * 将数据库交易记录转换为前端 Transaction 类型
 * 职责：执行底层数据清洗与分类名归一化
 */
export function mapDatabaseTransactions(items: DatabaseTransaction[]): Transaction[] {
  return items.map((item) => {
    // 强制执行分类名归一化，解决筛选不匹配问题
    const normalizedCategoryName = normalizeCategoryName(item.category?.name);

    return {
      id: item.id,
      amount: Number(item.amount),
      date: item.date,
      notes: item.notes || "",
      is_recurring: item.is_recurring,
      is_modified: item.is_modified,
      version: item.version,
      ai_metadata: item.ai_metadata,

      // 映射分类 (核心修正：统一使用归一化后的名称)
      category: {
        id: item.category?.id || "unknown",
        name: normalizedCategoryName,
        icon_name: item.category?.icon_name || "help-circle",
        color_code: item.category?.color_code || "#64748B",
      },

      // 映射商户与品牌
      merchant: {
        id: item.merchant?.id || "unknown",
        name: item.merchant?.name || "Unknown",
        brand: item.merchant?.brand
          ? {
              id: item.merchant.brand.id,
              name: item.merchant.brand.name,
              logo_url: item.merchant.brand.logo_url,
            }
          : null,
      },

      // 映射支付方式
      payment_method: item.payment_method
        ? {
            id: item.payment_method.id,
            name: item.payment_method.name,
            type: item.payment_method.type || "unknown",
          }
        : null,

      // 映射标签
      tags: item.transaction_tags?.map((t) => t.tag.name) || [],
    };
  });
}
