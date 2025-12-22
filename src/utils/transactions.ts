/**
 * 交易筛选和操作工具函数
 */
import { Transaction } from '@/types/transaction';
import { isIncomeCategory } from './colors/category';

export type FilterType = 'all' | 'expense' | 'income';

/**
 * 按类型筛选交易（expense/income/all）
 * @param transactions - 交易数组
 * @param filterType - 要应用的筛选类型
 * @returns 筛选后的交易
 */
export function filterTransactionsByType(
  transactions: Transaction[],
  filterType: FilterType
): Transaction[] {
  if (filterType === 'all') return transactions;

  if (filterType === 'expense') {
    return transactions.filter((tx) => !isIncomeCategory(tx.category));
  }

  return transactions.filter((tx) => isIncomeCategory(tx.category));
}

/**
 * 按搜索查询筛选交易
 * @param transactions - 交易数组
 * @param query - 搜索查询字符串
 * @returns 匹配查询的筛选后交易
 */
export function searchTransactions(
  transactions: Transaction[],
  query: string
): Transaction[] {
  if (!query.trim()) return transactions;

  const lowerQuery = query.toLowerCase();
  return transactions.filter(
    (tx) =>
      tx.merchant.toLowerCase().includes(lowerQuery) ||
      tx.category.toLowerCase().includes(lowerQuery) ||
      (tx.notes?.toLowerCase().includes(lowerQuery) ?? false) ||
      (tx.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ?? false)
  );
}

/**
 * 组合交易筛选
 * @param transactions - 交易数组
 * @param filterType - 类型筛选
 * @param searchQuery - 搜索查询
 * @returns 筛选后的交易
 */
export function filterTransactions(
  transactions: Transaction[],
  filterType: FilterType,
  searchQuery: string
): Transaction[] {
  let result = filterTransactionsByType(transactions, filterType);
  result = searchTransactions(result, searchQuery);
  return result;
}
