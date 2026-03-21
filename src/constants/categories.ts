/**
 * SnowFlake 核心分类体系
 */

// 1. 标准支出分类 (Single Source of Truth for UI)
export const EXPENSE_CATEGORIES = [
  "Food & Drink",
  "Shopping",
  "Transport",
  "Housing",
  "Healthcare",
  "Entertainment",
  "Others",
] as const;

// 2. 标准收入分类
export const INCOME_CATEGORIES = ["Salary", "Investment", "Refund", "Gift", "Bonus", "Interest", "Income"] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const;

/**
 * 别名识别映射表 (Alias Map)
 * 职责：将数据库旧数据、AI 生成的变体、甚至是不同语言的输入，
 * 统一归一化为上述标准拼写。
 */
export const CATEGORY_ALIAS_MAP: Record<string, string> = {
  // 交通相关
  Transportation: "Transport",
  transport: "Transport",
  transportation: "Transport",
  Travel: "Transport",
  ETC: "Transport",

  // 医疗相关
  Medical: "Healthcare",
  medical: "Healthcare",
  Health: "Healthcare",
  Pharmacy: "Healthcare",

  // 餐饮相关
  Food: "Food & Drink",
  Drink: "Food & Drink",
  Dining: "Food & Drink",
  Restaurant: "Food & Drink",
  "Food&Drink": "Food & Drink",

  // 杂项
  Other: "Others",
  others: "Others",
  other: "Others",
  Misc: "Others",

  // 居住
  Rent: "Housing",
  Home: "Housing",
  Utilities: "Housing",
};

/**
 * 核心工具：分类归一化 (Normalize)
 */
export function normalizeCategoryName(name: string | undefined | null): string {
  if (!name) return "Others";
  const trimmed = name.trim();
  // 1. 直接命中标准列表
  if ((ALL_CATEGORIES as unknown as string[]).includes(trimmed)) return trimmed;
  // 2. 命中别名映射
  if (CATEGORY_ALIAS_MAP[trimmed]) return CATEGORY_ALIAS_MAP[trimmed];
  // 3. 容错处理 (可根据需要增加模糊逻辑)
  return "Others";
}

/**
 * 类型定义
 */
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory;
