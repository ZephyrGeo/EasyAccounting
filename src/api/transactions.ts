import { Transaction } from "@/types/transaction";

// 后端API基础URL
const API_BASE_URL = "http://localhost:8000";

// 获取所有交易数据
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error(`获取交易数据失败: ${response.status}`);
    }
    const transactions = await response.json();
    return transactions;
  } catch (error) {
    console.error("获取交易数据失败:", error);
    // 如果后端不可用，尝试从本地JSON文件读取
    try {
      const response = await fetch("/data/transactions.json");
      if (response.ok) {
        const data = await response.json();
        return data.transactions || [];
      }
    } catch (fallbackError) {
      console.error("从本地文件读取数据也失败:", fallbackError);
    }
    return [];
  }
}

// 添加新交易
export async function addTransaction(
  newTransaction: Transaction,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add transaction: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Failed to add transaction:", error);
    throw error;
  }
}

// Update transaction
export async function updateTransaction(
  id: string,
  updatedTransaction: Transaction,
): Promise<void> {
  try {
    console.log("API call: update transaction", id, updatedTransaction);

    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTransaction),
    });

    console.log("API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(
        errorData.error || `Failed to update transaction: ${response.status}`,
      );
    }

    const result = await response.json();
    console.log("API update successful:", result);
  } catch (error) {
    console.error("Failed to update transaction:", error);
    throw error;
  }
}

// Delete transaction
export async function deleteTransaction(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to delete transaction: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw error;
  }
}

// Batch add transactions
export async function addTransactions(
  newTransactions: Transaction[],
): Promise<void> {
  try {
    // Add transactions one by one, as backend API is designed for single additions
    for (const transaction of newTransactions) {
      await addTransaction(transaction);
    }
  } catch (error) {
    console.error("Failed to batch add transactions:", error);
    throw error;
  }
}

// Batch update all transaction data (for operations like clearing)
export async function updateAllTransactions(
  transactions: Transaction[],
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to batch update transactions: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Failed to batch update transactions:", error);
    throw error;
  }
}
