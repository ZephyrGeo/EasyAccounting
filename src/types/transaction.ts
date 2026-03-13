export interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  date: string;
  time: string;
  tags?: string[];
  notes?: string;
  // 审计字段
  updated_at?: string;
  is_modified?: boolean;
  version?: number;
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
