export interface BillBook {
  id: string;
  name: string;
  description?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string;
  members?: string[];
  settings: {
    categories: string[];
    budgetLimits?: Record<string, number>;
    theme?: string;
  };
}

export interface BillBookSummary {
  id: string;
  name: string;
  isActive: boolean;
  totalTransactions: number;
  lastActivity: string;
}

export type BillBookType = "personal" | "family" | "business" | "shared";

export interface CreateBillBookRequest {
  name: string;
  description?: string;
  currency: string;
  type: BillBookType;
  settings?: {
    categories?: string[];
    budgetLimits?: Record<string, number>;
  };
}
