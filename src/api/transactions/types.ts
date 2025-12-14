/**
 * 交易查询过滤条件
 */
export interface TransactionFilters {
  /** 年份，格式为 "25" 表示 2025年 */
  year?: string;
  /** 月份，格式为 "12" 表示12月 */
  month?: string;
}

/**
 * 数据库交易记录的原始返回类型（从 Supabase 查询返回）
 */
export interface DatabaseTransaction {
  id: string;
  amount: number;
  merchant_id: string;
  category_id: string;
  date: string;
  time: string;
  labels: string[];
  notes: string | null;
  updated_at: string;
  is_modified: boolean;
  version: number;
  // 关联表查询结果
  category: {
    id: string;
    name: string;
  } | null;
  merchant: {
    id: string;
    name: string;
  } | null;
}
