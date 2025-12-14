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
    amount: item.amount,
    category: item.category?.name || 'Unknown',
    merchant: item.merchant?.name || 'Unknown',
    date: item.date,
    time: item.time,
    labels: item.labels || [],
    notes: item.notes || '',
    // 审计字段
    updated_at: item.updated_at,
    is_modified: item.is_modified || false,
    version: item.version || 1,
  }));
}
