import { useState, useMemo, useEffect, useCallback } from "react";
import MonthlyTotalExpenditure from "./MonthlyTotalExpenditure";
// import CategoryExpensePieChart from "./CategoryExpensePieChart";
import MonthlyTrendChart from "./MonthlyTrendChart";
import ExpenseCalendar from "./ExpenseCalendar";
import { Transaction, TransactionProps } from "@/types/transaction";
import TransactionsTable from "./transaction/page";
import YearSelector from "./transaction/dateselector/YearSelector";
import MonthSelector from "./transaction/dateselector/MonthSelector";
import BillUploadForm from "./transaction/BillUploadForm";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { getTransactions, addTransaction } from "@/api/transactions";

// Only show the parts that need modification
export default function DashBoard({ transactions }: TransactionProps) {
  // Add year and month state
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  // Add state to track all transaction data, including newly added ones
  const [allTransactions, setAllTransactions] =
    useState<Transaction[]>(transactions);

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false);

  // Update allTransactions when incoming transactions change
  useEffect(() => {
    setAllTransactions(transactions);
  }, [transactions]);

  // Extract available years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allTransactions.forEach((transaction) => {
      const year = transaction.date.substring(0, 2); // Take only first two digits as year
      years.add(year);
    });
    return Array.from(years).sort().reverse(); // Sort in descending order, newest year first
  }, [allTransactions]);

  // Extract available months (only months, excluding years)
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    const filteredByYear = selectedYear
      ? allTransactions.filter((t) => t.date.startsWith(selectedYear))
      : allTransactions;

    filteredByYear.forEach((transaction) => {
      const month = transaction.date.substring(3, 5);
      months.add(month);
    });
    return Array.from(months).sort();
  }, [allTransactions, selectedYear]);

  // Initialize selection of current year and month
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      // Get current date
      const now = new Date();
      const currentYear = now.getFullYear().toString().slice(-2); // Get last two digits of year
      const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // Get month, pad with zero

      // If current year is in available years, use current year, otherwise use latest year
      const yearToSelect = availableYears.includes(currentYear)
        ? currentYear
        : availableYears[0];
      setSelectedYear(yearToSelect);

      // Check if current month is in available months for that year
      const monthsForYear = new Set<string>();
      allTransactions
        .filter((t) => t.date.startsWith(yearToSelect))
        .forEach((transaction) => {
          const month = transaction.date.substring(3, 5);
          monthsForYear.add(month);
        });

      const availableMonthsForYear = Array.from(monthsForYear).sort();
      const monthToSelect = availableMonthsForYear.includes(currentMonth)
        ? currentMonth
        : availableMonthsForYear[availableMonthsForYear.length - 1];

      if (monthToSelect) {
        setSelectedMonth(monthToSelect);
      }
    }
  }, [availableYears, selectedYear, allTransactions]);

  // Ensure there's always a selected month
  useEffect(() => {
    if (selectedYear && availableMonths.length > 0) {
      // If current selected month is not in available months list, or no month is selected, choose first available month
      if (!selectedMonth || !availableMonths.includes(selectedMonth)) {
        setSelectedMonth(availableMonths[0]);
      }
    }
  }, [selectedYear, availableMonths, selectedMonth]);

  // Filter transaction data based on selected year and month
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Always filter based on selected year
    if (selectedYear) {
      filtered = filtered.filter((transaction) =>
        transaction.date.startsWith(selectedYear),
      );

      // Always further filter based on selected month
      if (selectedMonth) {
        filtered = filtered.filter(
          (transaction) => transaction.date.substring(3, 5) === selectedMonth,
        );
      }
    }

    return filtered;
  }, [allTransactions, selectedYear, selectedMonth]);

  // Handle transaction data updates
  const handleTransactionUpdate = useCallback(
    async (updatedTransactions: Transaction[]) => {
      try {
        // Re-fetch latest data from JSON file to ensure synchronization
        const latestTransactions = await getTransactions();
        setAllTransactions(latestTransactions);
      } catch (error) {
        console.error("Failed to get latest transaction data:", error);
        // If fetch fails, use passed data as fallback
        setAllTransactions(updatedTransactions);
      }
    },
    [],
  );

  // Handle batch adding transactions (from uploaded files)
  const handleBatchAddTransactions = useCallback(
    async (transactions: Transaction[]) => {
      try {
        // Add transactions one by one
        for (const transaction of transactions) {
          await addTransaction(transaction);
        }
        // Re-fetch latest data
        const latestTransactions = await getTransactions();
        setAllTransactions(latestTransactions);
      } catch (error) {
        console.error("Failed to batch add transactions:", error);
      }
    },
    [],
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <YearSelector
            transactions={allTransactions}
            onYearChange={setSelectedYear}
            selectedYear={selectedYear}
            availableYears={availableYears}
          />
          <MonthSelector
            transactions={
              selectedYear
                ? allTransactions.filter((t) => t.date.startsWith(selectedYear))
                : []
            }
            onMonthChange={setSelectedMonth}
            selectedMonth={selectedMonth}
            availableMonths={availableMonths}
          />
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="h-4 w-4" />
          Import Bill
        </Button>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MonthlyTotalExpenditure transactions={filteredTransactions} />
        <ExpenseCalendar
          transactions={filteredTransactions}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <MonthlyTrendChart transactions={allTransactions} />
      </div>

      <TransactionsTable
        transactions={filteredTransactions}
        onTransactionUpdate={handleTransactionUpdate}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {/* Upload bill dialog */}
      <BillUploadForm
        onAdd={handleBatchAddTransactions}
        open={uploadOpen}
        setOpen={setUploadOpen}
      />
    </div>
  );
}
