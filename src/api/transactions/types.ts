/**
 * 交易查询过滤条件
 */
export interface TransactionFilters {
  /** 年份，格式为 "25" 表示 2025年 */
  year?: string;
  /** 月份，格式为 "12" 表示12月 */
  month?: string;
}
