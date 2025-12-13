import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";

// Helper: 计算下个月第一天的日期字符串（用于日期范围查询）
// 例如: getNextMonth("2025", "12") → "2026-01-01"
function getNextMonth(year: string, month: string): string {
  const date = new Date(`${year}-${month}-01`);
  date.setMonth(date.getMonth() + 1);
  const nextYear = date.getFullYear();
  const nextMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${nextYear}-${nextMonth}-01`;
}

// 获取交易数据（支持年份/月份过滤）
export async function getTransactions(
  filters?: { year?: string; month?: string }
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
    const transactions: Transaction[] = (data || []).map((item: any) => ({
      id: item.id,
      amount: item.amount,
      category: item.category?.name || 'Unknown',
      subCategory: item.labels?.[0] || '',
      merchant: item.merchant?.name || 'Unknown',
      date: item.date,
      time: item.time,
      tags: item.labels || [],
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

// 获取最近 N 个月的月度聚合数据（用于月度趋势图）
export async function getMonthlyAggregates(
  months: number = 6
): Promise<Array<{ month: string; total: number }>> {
  try {
    // 计算起始日期（N 个月前）
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const startDateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // 从数据库获取最近 N 个月的数据（只查询 date 和 amount 列）
    const { data, error } = await supabase
      .from('transactions')
      .select('date, amount')
      .gte('date', startDateStr)
      .order('date', { ascending: false });

    if (error) throw error;

    // 客户端聚合按月汇总
    const monthlyData: Record<string, number> = {};

    data?.forEach((item) => {
      // 提取 YY/MM 格式
      const year = item.date.substring(2, 4);  // "2025-12-14" → "25"
      const month = item.date.substring(5, 7); // "2025-12-14" → "12"
      const monthKey = `${year}/${month}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += item.amount;
    });

    // 转换为数组并排序，只取最近 N 个月
    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-months);

  } catch (error) {
    console.error("Failed to get monthly aggregates:", error);
    return [];
  }
}

// 获取可用的年份和月份元数据（用于年份/月份选择器）
export async function getAvailableYearsMonths(): Promise<{
  years: string[];
  monthsByYear: Record<string, string[]>;
}> {
  try {
    // 只查询 date 列（轻量级查询）
    const { data, error } = await supabase
      .from('transactions')
      .select('date')
      .order('date', { ascending: false });

    if (error) throw error;

    const yearMonthSet = new Set<string>();
    const monthsByYear: Record<string, Set<string>> = {};

    data?.forEach((item) => {
      const date = item.date; // "YYYY-MM-DD"
      const year = date.substring(2, 4);  // "25"
      const month = date.substring(5, 7); // "12"
      const yearMonth = `${year}-${month}`;

      yearMonthSet.add(yearMonth);

      if (!monthsByYear[year]) {
        monthsByYear[year] = new Set();
      }
      monthsByYear[year].add(month);
    });

    // 转换为排序数组
    const years = Array.from(
      new Set(Array.from(yearMonthSet).map(ym => ym.split('-')[0]))
    ).sort().reverse(); // 年份降序

    const monthsByYearArray: Record<string, string[]> = {};
    Object.keys(monthsByYear).forEach(year => {
      monthsByYearArray[year] = Array.from(monthsByYear[year]).sort(); // 月份升序
    });

    return { years, monthsByYear: monthsByYearArray };
  } catch (error) {
    console.error("Failed to get available years/months:", error);
    return { years: [], monthsByYear: {} };
  }
}
