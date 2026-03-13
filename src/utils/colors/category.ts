/**
 * 分类颜色和图标工具
 */
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Film,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { INCOME_CATEGORIES } from '@/constants/categories';

/**
 * Category 图标和颜色配置
 */
export interface CategoryConfig {
  icon: LucideIcon;
  bgColor: string; // Tailwind 背景色类
  textColor: string; // Tailwind 文字色类
}

/**
 * Category 名称到图标配置的映射
 * 总共 7 个分类
 */
const CATEGORY_ICONS: Record<string, CategoryConfig> = {
  // 1. 餐饮
  'Food & Drink': {
    icon: Utensils,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600',
  },

  // 2. 购物
  'Shopping': {
    icon: ShoppingBag,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
  },

  // 3. 交通
  'Transportation': {
    icon: Car,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },

  // 4. 居住
  'Housing': {
    icon: Home,
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-600',
  },

  // 5. 医疗
  'Healthcare': {
    icon: Heart,
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },

  // 6. 娱乐
  'Entertainment': {
    icon: Film,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
  },

  // 7. 其他（也作为默认配置）
  'Other': {
    icon: Wallet,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
};

/**
 * 根据 category 名称获取图标配置
 * @param categoryName - Category 名称
 * @returns 图标配置对象
 */
export function getCategoryIcon(categoryName: string): CategoryConfig {
  return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS['Other'];
}

/**
 * 判断分类是否为收入类型
 * @param categoryName - Category 名称
 * @returns 是否为收入
 */
export function isIncomeCategory(categoryName: string): boolean {
  return (INCOME_CATEGORIES as readonly string[]).includes(categoryName);
}
