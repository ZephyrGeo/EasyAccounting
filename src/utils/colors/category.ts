/**
 * 类别颜色与图标配置
 */
import {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Activity,
  Gamepad2,
  HelpCircle,
  Briefcase,
  TrendingUp,
  RotateCcw,
  Gift,
  Coins,
  Wallet,
  DollarSign,
} from "lucide-react";

export const CATEGORY_COLORS: Record<string, string> = {
  // 支出
  "Food & Drink": "#FF6B6B",
  Shopping: "#4DABF7",
  Transport: "#51CF66",
  Housing: "#FCC419",
  Healthcare: "#FF922B",
  Entertainment: "#BE4BDB",
  Others: "#868E96",

  // 收入
  Salary: "#37B24D",
  Investment: "#228BE6",
  Refund: "#FAB005",
  Gift: "#F06595",
  Bonus: "#FD7E14",
  Interest: "#15AABF",
  Income: "#40C057",
};

export const CATEGORY_ICONS: Record<string, any> = {
  // 支出
  "Food & Drink": Utensils,
  Shopping: ShoppingBag,
  Transport: Car,
  Housing: Home,
  Healthcare: Activity,
  Entertainment: Gamepad2,
  Others: HelpCircle,

  // 收入
  Salary: Briefcase,
  Investment: TrendingUp,
  Refund: RotateCcw,
  Gift: Gift,
  Bonus: Coins,
  Interest: Wallet,
  Income: DollarSign,
};

/**
 * 获取分类图标
 */
export function getCategoryIcon(categoryName: string) {
  return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS["Others"];
}

/**
 * 获取分类颜色
 */
export function getCategoryColor(categoryName: string) {
  return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS["Others"];
}
