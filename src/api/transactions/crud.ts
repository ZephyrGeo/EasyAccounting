import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";
import { TransactionFilters } from "./types";
import { mapDatabaseTransactions } from "./mappers";

/**
 * 获取交易数据 (极限兼容版 - 忽略 Auth 状态)
 */
export async function getTransactions(
  _filters?: TransactionFilters 
): Promise<Transaction[]> {
  try {
    console.log("Attempting a pure select without any user context...");
    
    // 使用简单的 select，不带任何 where 子句
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
        payment_method:payment_methods(*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error("Supabase Error Details:", error);
      return [];
    }

    console.log("Success! Data received:", data);

    if (!data || data.length === 0) {
      console.warn("Table is confirmed EMPTY by the current client key.");
      return [];
    }

    return mapDatabaseTransactions(data as any[]);
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

/**
 * 其他 CRUD 保持基本结构
 */
export async function addTransaction(newTransaction: any) {
  return await supabase.from('transactions').insert([newTransaction]);
}
export async function updateTransaction(id: string, updatedTransaction: any) {
  return await supabase.from('transactions').update(updatedTransaction).eq('id', id);
}
export async function deleteTransaction(id: string) {
  return await supabase.from('transactions').delete().eq('id', id);
}
export async function addTransactions(newTransactions: any[]) {
  return await supabase.from('transactions').insert(newTransactions);
}
export async function updateAllTransactions(transactions: any[]) {
  await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (transactions.length > 0) await addTransactions(transactions);
}
