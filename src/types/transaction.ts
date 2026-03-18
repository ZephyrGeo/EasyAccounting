export interface Category {
  id: string;
  name: string;
  icon_name?: string;
  color_code?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string | null;
}

export interface Merchant {
  id: string;
  name: string;
  brand?: Brand | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  merchant: Merchant;
  category: Category;
  payment_method?: PaymentMethod | null;
  tags?: string[];
  notes?: string;
  is_recurring?: boolean;
  is_modified?: boolean;
  version?: number;
  // AI 相关
  ai_metadata?: any;
}

export interface TransactionProps {
  transactions: Transaction[];
}

export interface ParsedResult {
  transactions: Transaction[];
  summary: {
    totalAmount: number;
    transactionCount: number;
  };
}
