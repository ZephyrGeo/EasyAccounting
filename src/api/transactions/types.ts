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
 * 标签数据库模型
 */
export interface DatabaseTag {
  id: string;
  name: string;
  color_code: string;
}

/**
 * 关联表中的嵌套结构
 */
export interface TransactionTagJoin {
  tag: DatabaseTag;
}

/**
 * 数据库交易记录的原始返回类型（从 Supabase 查询返回）
 */
export interface DatabaseTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  notes: string | null;
  is_recurring: boolean;
  ai_metadata: any;
  is_modified: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  
  // 关联表：分类
  category: {
    id: string;
    name: string;
    icon_name: string | null;
    color_code: string | null;
  } | null;

  // 关联表：商户 -> 品牌
  merchant: {
    id: string;
    name: string;
    brand: {
      id: string;
      name: string;
      logo_url: string | null;
    } | null;
  } | null;

  // 关联表：支付方式
  payment_method: {
    id: string;
    name: string;
    type: string | null;
  } | null;

  // 关联表：标签
  transaction_tags: TransactionTagJoin[];
}
