import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";

// 获取所有交易数据
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(id, name),
        merchant:merchants(id, name)
      `)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) {
      console.error("获取交易数据失败:", error);
      throw error;
    }

    // 转换数据格式以匹配前端 Transaction 类型
    const transactions: Transaction[] = (data || []).map((item: any) => ({
      id: item.id,
      amount: item.amount,
      category: item.category?.name || 'Unknown',
      subCategory: item.labels?.[0] || '',
      merchant: item.merchant?.name || 'Unknown',
      date: item.date,
      time: item.time,
      tags: item.labels || [],
      notes: item.notes,
      // 审计字段
      updated_at: item.updated_at,
      is_modified: item.is_modified,
      version: item.version,
    }));

    return transactions;
  } catch (error) {
    console.error("获取交易数据失败:", error);
    return [];
  }
}

// 添加新交易
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
        labels: newTransaction.tags || [],
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

// 辅助函数：获取或创建商户
async function getOrCreateMerchant(merchantName: string): Promise<number> {
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

// 辅助函数：获取或创建分类
async function getOrCreateCategory(categoryName: string): Promise<number> {
  // 先查询是否存在
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (existing) {
    return existing.id;
  }

  // 不存在则创建
  const { data: newCategory, error } = await supabase
    .from('categories')
    .insert([{ name: categoryName }])
    .select('id')
    .single();

  if (error || !newCategory) {
    throw new Error(`Failed to create category: ${categoryName}`);
  }

  return newCategory.id;
}

// Update transaction
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
        labels: updatedTransaction.tags || [],
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

// Delete transaction
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

// Batch add transactions
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
        labels: transaction.tags || [],
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

// Batch update all transaction data (for operations like clearing)
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
