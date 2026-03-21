/**
 * Transaction categories constants
 */

export const EXPENSE_CATEGORIES = [
  "Food & Drink",
  "Shopping",
  "Transportation",
  "Housing",
  "Healthcare",
  "Entertainment",
  "Others",
] as const;

export const INCOME_CATEGORIES = ["Salary", "Investment", "Refund", "Gift", "Bonus", "Interest", "Income"] as const;

/**
 * All available categories
 */
export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const;

/**
 * Type definitions
 */
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory;
