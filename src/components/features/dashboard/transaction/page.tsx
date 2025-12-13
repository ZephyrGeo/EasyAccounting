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
} from "@/api/transactions";

// Add onTransactionUpdate property to TransactionsTable component
interface TransactionsTableProps extends TransactionProps {
  onTransactionUpdate?: () => Promise<void>;
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

        // Update database
        await updateTransaction(id, updatedTransaction);
        console.log("API update successful");

        // Clear edit state
        setEditingTransaction(undefined);
        setIsEditDialogOpen(false);

        // Notify parent component to refresh data
        if (onTransactionUpdate) {
          await onTransactionUpdate();
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
          // Delete from database
          await deleteTransaction(id);

          // Notify parent component to refresh data
          if (onTransactionUpdate) {
            await onTransactionUpdate();
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
        // Add to database
        await addTransaction(newTransaction);

        // Notify parent component to refresh data
        if (onTransactionUpdate) {
          await onTransactionUpdate();
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
    </div>
  );
}
