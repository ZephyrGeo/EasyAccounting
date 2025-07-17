export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subCategory: string;
  merchant: string;
  date: string;
  time: string;
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
