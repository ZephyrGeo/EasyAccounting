import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";
import { getOrCreateMerchant } from "@/api/entities/merchants";
import { getOrCreateCategory } from "@/api/entities/categories";
import { getNextMonth } from "@/api/utils/date-helpers";
import { TransactionFilters, DatabaseTransaction } from "./types";

/**
 * 获取交易数据（支持年份/月份过滤）
 * @param filters - 过滤条件，包含可选的年份和月份
 * @returns 交易记录数组
 */
export async function getTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(id, name),
        merchant:merchants(id, name)
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    // 应用日期过滤
    if (filters?.year) {
      const fullYear = `20${filters.year}`; // "25" → "2025"

      if (filters.month) {
        // 年份 + 月份过滤：例如 2025-12
        // 范围: >= 2025-12-01 AND < 2026-01-01
        const startDate = `${fullYear}-${filters.month}-01`;
        const endDate = getNextMonth(fullYear, filters.month);
        query = query.gte('date', startDate).lt('date', endDate);
      } else {
        // 仅年份过滤：例如 2025
        // 范围: >= 2025-01-01 AND < 2026-01-01
        const startDate = `${fullYear}-01-01`;
        const endDate = `${parseInt(fullYear) + 1}-01-01`;
        query = query.gte('date', startDate).lt('date', endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("获取交易数据失败:", error);
      throw error;
    }

    // 转换数据格式以匹配前端 Transaction 类型
    const transactions: Transaction[] = (data as DatabaseTransaction[] || []).map((item) => ({
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

    return transactions;
  } catch (error) {
    console.error("获取交易数据失败:", error);
    return [];
  }
}

/**
 * 添加新交易
 * @param newTransaction - 新交易记录
 */
export async function addTransaction(
  newTransaction: Transaction,
): Promise<void> {
  try {
    // 先获取或创建商户和分类
    const merchantId = await getOrCreateMerchant(newTransaction.merchant);
    const categoryId = await getOrCreateCategory(newTransaction.category);

    // 插入交易记录
    const { error } = await supabase
      .from('transactions')
      .insert([{
        id: newTransaction.id,
        amount: newTransaction.amount,
        merchant_id: merchantId,
        category_id: categoryId,
        date: newTransaction.date,
        time: newTransaction.time,
        labels: newTransaction.labels || [],
        notes: newTransaction.notes,
        is_modified: false,
        version: 1,
      }]);

    if (error) {
      console.error("Failed to add transaction:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to add transaction:", error);
    throw error;
  }
}

/**
 * 更新交易记录
 * @param id - 交易ID
 * @param updatedTransaction - 更新后的交易数据
 */
export async function updateTransaction(
  id: string,
  updatedTransaction: Transaction,
): Promise<void> {
  try {
    console.log("API call: update transaction", id, updatedTransaction);

    // 获取或创建商户和分类
    const merchantId = await getOrCreateMerchant(updatedTransaction.merchant);
    const categoryId = await getOrCreateCategory(updatedTransaction.category);

    // 先获取当前版本号
    const { data: current } = await supabase
      .from('transactions')
      .select('version')
      .eq('id', id)
      .single();

    const currentVersion = current?.version || 1;

    // 更新交易记录
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: updatedTransaction.amount,
        merchant_id: merchantId,
        category_id: categoryId,
        date: updatedTransaction.date,
        time: updatedTransaction.time,
        labels: updatedTransaction.labels || [],
        notes: updatedTransaction.notes,
        is_modified: true,
        version: currentVersion + 1,
      })
      .eq('id', id);

    if (error) {
      console.error("API error response:", error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    console.log("API update successful");
  } catch (error) {
    console.error("Failed to update transaction:", error);
    throw error;
  }
}

/**
 * 删除交易记录
 * @param id - 交易ID
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Failed to delete transaction:", error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw error;
  }
}

/**
 * 批量添加交易记录
 * @param newTransactions - 新交易记录数组
 */
export async function addTransactions(
  newTransactions: Transaction[],
): Promise<void> {
  try {
    // 批量准备数据
    const transactionsToInsert = [];

    for (const transaction of newTransactions) {
      // 获取或创建商户和分类
      const merchantId = await getOrCreateMerchant(transaction.merchant);
      const categoryId = await getOrCreateCategory(transaction.category);

      transactionsToInsert.push({
        id: transaction.id,
        amount: transaction.amount,
        merchant_id: merchantId,
        category_id: categoryId,
        date: transaction.date,
        time: transaction.time,
        labels: transaction.labels || [],
        notes: transaction.notes,
        is_modified: false,
        version: 1,
      });
    }

    // 批量插入（Supabase 支持批量插入）
    const { error } = await supabase
      .from('transactions')
      .insert(transactionsToInsert);

    if (error) {
      console.error("Failed to batch add transactions:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to batch add transactions:", error);
    throw error;
  }
}

/**
 * 批量更新所有交易数据（用于清空或替换操作）
 * @param transactions - 新的交易记录数组
 */
export async function updateAllTransactions(
  transactions: Transaction[],
): Promise<void> {
  try {
    // 先删除所有现有记录
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', ''); // 删除所有记录

    if (deleteError) {
      console.error("Failed to clear transactions:", deleteError);
      throw deleteError;
    }

    // 如果有新数据，批量插入
    if (transactions.length > 0) {
      await addTransactions(transactions);
    }
  } catch (error) {
    console.error("Failed to batch update transactions:", error);
    throw error;
  }
}
