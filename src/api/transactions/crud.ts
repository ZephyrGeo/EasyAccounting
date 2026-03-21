import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";
import { TransactionFilters } from "./types";
import { mapDatabaseTransactions } from "./mappers";
import { getOrCreateTags } from "../entities/tags";
import { getOrCreateCategory } from "../entities/categories";
import { getOrCreateMerchant } from "../entities/merchants";

/**
 * 核心逻辑：保存交易关联的标签
 */
async function syncTransactionTags(transactionId: string, tagNames: string[]) {
  console.log(`[Tags] Syncing tags for transaction ${transactionId}:`, tagNames);
  const tagIds = await getOrCreateTags(tagNames);
  console.log(`[Tags] Resolved tag IDs:`, tagIds);
  
  // 1. 清除旧关联
  const { error: deleteError } = await supabase
    .from('transaction_tags')
    .delete()
    .eq('transaction_id', transactionId);
  
  if (deleteError) {
    console.error("[Tags] Failed to clear old tags:", deleteError);
    throw deleteError;
  }

  // 2. 建立新关联
  if (tagIds.length > 0) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const associations = tagIds.map(tagId => ({
      transaction_id: transactionId,
      tag_id: tagId,
      user_id: user.id // 显式保存 user_id 到中间表
    }));
    
    console.log(`[Tags] Inserting ${associations.length} associations...`);
    const { data, error: insertError } = await supabase
      .from('transaction_tags')
      .insert(associations)
      .select();
      
    if (insertError) {
      console.error("[Tags] Failed to insert new tags:", insertError.message, insertError.details, insertError.hint);
      throw insertError;
    }
    console.log("[Tags] Successfully inserted associations:", data);
  } else {
    console.log("[Tags] No tags to associate.");
  }
}

/**
 * 预处理交易数据：显式映射到数据库字段，过滤掉 UI 冗余对象
 */
async function prepareDatabaseData(transaction: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  
  const { category, merchant, tags } = transaction;
  
  // 1. 处理分类 ID
  let categoryId = null;
  if (typeof category === 'string') {
    categoryId = await getOrCreateCategory(category);
  } else if (category && category.name) {
    categoryId = await getOrCreateCategory(category.name);
  }

  // 2. 处理商户 ID
  let merchantId = null;
  if (typeof merchant === 'string') {
    merchantId = await getOrCreateMerchant(merchant);
  } else if (merchant && merchant.name) {
    merchantId = await getOrCreateMerchant(merchant.name, merchant.brand?.name);
  }

  // 3. 构造干净的数据库对象
  const dbData: any = {
    user_id: user.id,
    amount: transaction.amount,
    date: transaction.date,
    notes: transaction.notes || '',
    is_recurring: !!transaction.is_recurring,
    category_id: categoryId,
    merchant_id: merchantId,
  };

  // 如果有支付方式 ID，也带上
  if (transaction.payment_method?.id && transaction.payment_method.id !== 'temp') {
    dbData.payment_method_id = transaction.payment_method.id;
  }

  return {
    data: dbData,
    tags
  };
}

/**
 * 获取交易数据
 */
export async function getTransactions(
  _filters?: TransactionFilters 
): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        date,
        notes,
        is_recurring,
        category:categories(*),
        merchant:merchants(
          id,
          name,
          brand:brands(*)
        ),
        payment_method:payment_methods(*),
        transaction_tags(
          tag:tags(*)
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error("Supabase Error Details:", error);
      return [];
    }

    console.log("[API] Raw transactions data from Supabase:", data);
    return mapDatabaseTransactions(data as any[] || []);
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

/**
 * 添加交易
 */
export async function addTransaction(transaction: any) {
  const { data, tags } = await prepareDatabaseData(transaction);
  
  const { data: record, error } = await supabase
    .from('transactions')
    .insert([data])
    .select('id')
    .single();

  if (error) {
    console.error("Add record failed:", error);
    throw error;
  }

  if (tags && tags.length > 0) {
    await syncTransactionTags(record.id, tags);
  }

  return record;
}

/**
 * 更新交易
 */
export async function updateTransaction(id: string, updatedTransaction: any) {
  const { data, tags } = await prepareDatabaseData(updatedTransaction);

  const { error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error("Update main record failed:", error);
    throw error;
  }

  if (tags !== undefined) {
    await syncTransactionTags(id, tags);
  }
}

/**
 * 删除交易
 */
export async function deleteTransaction(id: string) {
  return await supabase.from('transactions').delete().eq('id', id);
}

/**
 * 批量添加
 */
export async function addTransactions(newTransactions: any[]) {
  return await supabase.from('transactions').insert(newTransactions);
}

/**
 * 批量更新
 */
export async function updateAllTransactions(transactions: any[]) {
  await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (transactions.length > 0) await addTransactions(transactions);
}
