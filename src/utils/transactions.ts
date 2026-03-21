import { Transaction } from "@/types/transaction";
import { FilterMode } from "@/components/transactions/TagFilterBar";

/**
 * 业务工具类：专门处理账单数据的过滤与结构重组
 */

/**
 * 核心过滤函数：处理搜索关键词、标签及其匹配模式
 */
export function filterTransactions(
  transactions: Transaction[],
  query: string,
  selectedTags: string[],
  mode: FilterMode,
): Transaction[] {
  if (!transactions) return [];

  const search = query.toLowerCase().trim();

  return transactions.filter((t) => {
    // 1. 搜索词匹配 (Merchant 或 Category)
    const matchesSearch =
      !search || t.merchant?.name.toLowerCase().includes(search) || t.category?.name.toLowerCase().includes(search);

    // 2. 标签匹配
    const matchesTags =
      selectedTags.length === 0 ||
      (mode === "AND"
        ? selectedTags.every((tag) => t.tags?.includes(tag))
        : selectedTags.some((tag) => t.tags?.includes(tag)));

    return matchesSearch && matchesTags;
  });
}

/**
 * 分组函数：将扁平数组转换为按日期排列的结构化数据
 */
export interface TransactionGroup {
  date: string;
  items: Transaction[];
}

export function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
  const dateGroups: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    if (!dateGroups[t.date]) dateGroups[t.date] = [];
    dateGroups[t.date].push(t);
  });

  return Object.keys(dateGroups)
    .sort((a, b) => b.localeCompare(a)) // 日期倒序
    .map((date) => ({
      date,
      items: dateGroups[date],
    }));
}
