import { Transaction } from "@/types/transaction";
import { DatabaseTransaction } from "./types";

/**
 * 将数据库交易记录转换为前端 Transaction 类型
 * @param items - 数据库交易记录数组
 * @returns 前端 Transaction 类型数组
 */
export function mapDatabaseTransactions(items: DatabaseTransaction[]): Transaction[] {
  return items.map((item) => ({
    id: item.id,
    amount: Number(item.amount),
    date: item.date,
    notes: item.notes || "",
    is_recurring: item.is_recurring,
    is_modified: item.is_modified,
    version: item.version,
    ai_metadata: item.ai_metadata,

    // 映射分类
    category: {
      id: item.category?.id || "unknown",
      name: item.category?.name || "Unknown",
      icon_name: item.category?.icon_name || "help-circle",
      color_code: item.category?.color_code || "#64748B",
    },

    // 映射商户与品牌 (获取品牌 Logo)
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
  }));
}
