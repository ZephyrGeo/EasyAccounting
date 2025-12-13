// @/components/features/dashboard/transaction/page.tsx
import { createColumns } from "./columns";
import DataTable from "./data-table";
import { Transaction, TransactionProps } from "@/types/transaction";
import { useState, useEffect, useCallback } from "react";
import TransactionForm from "./TransactionForm";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  updateAllTransactions,
} from "@/api/transactions";

// Add onTransactionUpdate property to TransactionsTable component
interface TransactionsTableProps extends TransactionProps {
  onTransactionUpdate?: (transactions: Transaction[]) => void;
  selectedYear?: string | null;
  selectedMonth?: string | null;
}

export default function TransactionsTable({
  transactions: initialTransactions,
  onTransactionUpdate,
  selectedYear,
  selectedMonth,
}: TransactionsTableProps) {
  // Initialize data using props
  const [tableData, setTableData] = useState<Transaction[]>(
    initialTransactions || [],
  );

  // Remove internal month filtering logic
  // Delete selectedMonth, transactionsByMonth, currentTransactions and handleMonthChange

  // Edit functionality state
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Handle edit transaction
  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  }, []);

  // Save edited transaction
  const handleSaveEdit = useCallback(
    async (id: string, updatedTransaction: Transaction) => {
      try {
        console.log("Starting transaction update:", id, updatedTransaction);

        // Update JSON file
        await updateTransaction(id, updatedTransaction);
        console.log("API update successful");

        // Re-fetch data to ensure synchronization
        const refreshedData = await getTransactions();
        console.log(
          "Data re-fetch successful, data count:",
          refreshedData.length,
        );

        setTableData(refreshedData);

        // Clear edit state
        setEditingTransaction(undefined);
        setIsEditDialogOpen(false);

        // Notify parent component that transaction data has been updated
        if (onTransactionUpdate) {
          onTransactionUpdate(refreshedData);
        }

        console.log("Transaction update completed");
      } catch (error) {
        console.error("Failed to update transaction:", error);
        alert("Failed to update transaction, please try again");
      }
    },
    [onTransactionUpdate],
  );

  // Handle delete transaction
  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      if (
        window.confirm(
          "Are you sure you want to delete this transaction record? This action cannot be undone.",
        )
      ) {
        try {
          // Delete from JSON file
          await deleteTransaction(id);

          // Re-fetch data to ensure synchronization
          const refreshedData = await getTransactions();
          setTableData(refreshedData);

          // Notify parent component that transaction data has been updated
          if (onTransactionUpdate) {
            onTransactionUpdate(refreshedData);
          }
        } catch (error) {
          console.error("Failed to delete transaction:", error);
          alert("Failed to delete transaction, please try again");
        }
      }
    },
    [onTransactionUpdate],
  );

  // Handle add new transaction
  const handleAddTransaction = useCallback(
    async (newTransaction: Transaction) => {
      try {
        // Add to JSON file
        await addTransaction(newTransaction);

        // Re-fetch data to ensure synchronization
        const refreshedData = await getTransactions();
        setTableData(refreshedData);

        // Notify parent component that transaction data has been updated
        if (onTransactionUpdate) {
          onTransactionUpdate(refreshedData);
        }
      } catch (error) {
        console.error("Failed to add transaction:", error);
        alert("Failed to add transaction, please try again");
      }
    },
    [onTransactionUpdate],
  );

  // Create column definitions with delete and edit handlers
  const columns = createColumns({
    onDelete: handleDeleteTransaction,
    onEdit: handleEditTransaction,
  });

  // Update tableData when initial transaction data changes
  useEffect(() => {
    if (initialTransactions && initialTransactions.length > 0) {
      setTableData(initialTransactions);
    }
  }, [initialTransactions]);

  // Add clear all data functionality (for testing only)
  const handleClearAllData = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all transaction data? This action cannot be undone.",
      )
    ) {
      try {
        // Use batch update API to clear data
        await updateAllTransactions([]);

        // Re-fetch data
        const refreshedData = await getTransactions();
        setTableData(refreshedData);

        // Notify parent component that data has been cleared
        if (onTransactionUpdate) {
          onTransactionUpdate(refreshedData);
        }
      } catch (error) {
        console.error("Failed to clear data:", error);
        alert("Failed to clear data, please try again");
      }
    }
  };

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <DataTable
        columns={columns}
        data={tableData} // Use local state data, including newly added transactions
        onAdd={handleAddTransaction}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {/* Edit transaction dialog */}
      <TransactionForm
        mode="edit"
        transaction={editingTransaction}
        onEdit={handleSaveEdit}
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
      />

      {/* Optional: Add a clear data button for development testing only */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-right">
          <button
            onClick={handleClearAllData}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Clear All Data (Development Only)
          </button>
        </div>
      )}
    </div>
  );
}
