export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subCategory: string;
  merchant: string;
  date: string;
  time: string;
  tags: string[];
}

export interface TransactionProps {
  transactions: Transaction[];
}
