import { useState, useEffect, useCallback } from "react";
import MonthlyTotalExpenditure from "./MonthlyTotalExpenditure";
import MonthlyTrendChart from "./MonthlyTrendChart";
import ExpenseCalendar from "./ExpenseCalendar";
import { Transaction } from "@/types/transaction";
import TransactionsTable from "./transaction/page";
import YearSelector from "./transaction/dateselector/YearSelector";
import MonthSelector from "./transaction/dateselector/MonthSelector";
import BillUploadForm from "./transaction/BillUploadForm";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  getTransactions,
  addTransaction,
  getMonthlyAggregates,
  getAvailableYearsMonths,
} from "@/api/transactions";

export default function DashBoard() {
  // 年份/月份选择状态
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // 三个独立的数据源
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [monthlyAggregates, setMonthlyAggregates] = useState<Array<{ month: string; total: number }>>([]);
  const [availableYearsMonths, setAvailableYearsMonths] = useState<{
    years: string[];
    monthsByYear: Record<string, string[]>;
  }>({ years: [], monthsByYear: {} });

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false);

  // 初始化：获取元数据和聚合数据
  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        const [metadata, aggregates] = await Promise.all([
          getAvailableYearsMonths(),
          getMonthlyAggregates(6),
        ]);

        setAvailableYearsMonths(metadata);
        setMonthlyAggregates(aggregates);

        // 自动选择当前年份和月份（如果存在）
        if (metadata.years.length > 0) {
          const now = new Date();
          const currentYear = now.getFullYear().toString().slice(-2);
          const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");

          const yearToSelect = metadata.years.includes(currentYear)
            ? currentYear
            : metadata.years[0];
          setSelectedYear(yearToSelect);

          const monthsForYear = metadata.monthsByYear[yearToSelect] || [];
          const monthToSelect = monthsForYear.includes(currentMonth)
            ? currentMonth
            : monthsForYear[monthsForYear.length - 1];

          if (monthToSelect) {
            setSelectedMonth(monthToSelect);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // 当年份或月份变化时，获取过滤后的交易数据
  useEffect(() => {
    async function fetchFilteredData() {
      if (!selectedYear || !selectedMonth) return;

      setIsLoadingFiltered(true);
      try {
        const data = await getTransactions({
          year: selectedYear,
          month: selectedMonth
        });
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Failed to fetch filtered transactions:", error);
        setFilteredTransactions([]);
      } finally {
        setIsLoadingFiltered(false);
      }
    }

    fetchFilteredData();
  }, [selectedYear, selectedMonth]);

  // 处理年份变化，重置月份选择
  const handleYearChange = useCallback((year: string | null) => {
    setSelectedYear(year);
    if (year && availableYearsMonths.monthsByYear[year]) {
      const months = availableYearsMonths.monthsByYear[year];
      setSelectedMonth(months[months.length - 1] || null);
    }
  }, [availableYearsMonths]);

  // 处理交易数据更新（添加/编辑/删除后）
  const handleTransactionUpdate = useCallback(async () => {
    try {
      const [filtered, aggregates, metadata] = await Promise.all([
        selectedYear && selectedMonth
          ? getTransactions({ year: selectedYear, month: selectedMonth })
          : Promise.resolve([]),
        getMonthlyAggregates(6),
        getAvailableYearsMonths(),
      ]);

      setFilteredTransactions(filtered);
      setMonthlyAggregates(aggregates);
      setAvailableYearsMonths(metadata);
    } catch (error) {
      console.error("Failed to refresh data after update:", error);
    }
  }, [selectedYear, selectedMonth]);

  // 处理批量添加交易（从上传文件）
  const handleBatchAddTransactions = useCallback(
    async (transactions: Transaction[]) => {
      try {
        for (const transaction of transactions) {
          await addTransaction(transaction);
        }
        await handleTransactionUpdate();
      } catch (error) {
        console.error("Failed to batch add transactions:", error);
      }
    },
    [handleTransactionUpdate],
  );

  // 计算可用的年份和月份列表
  const availableYears = availableYearsMonths.years;
  const availableMonths = selectedYear
    ? (availableYearsMonths.monthsByYear[selectedYear] || [])
    : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading data...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <YearSelector
                onYearChange={handleYearChange}
                selectedYear={selectedYear}
                availableYears={availableYears}
              />
              <MonthSelector
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

          {isLoadingFiltered ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-lg">Loading transactions...</p>
            </div>
          ) : (
            <>
              <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MonthlyTotalExpenditure transactions={filteredTransactions} />
                <ExpenseCalendar
                  transactions={filteredTransactions}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
                <MonthlyTrendChart aggregates={monthlyAggregates} />
              </div>

              <TransactionsTable
                transactions={filteredTransactions}
                onTransactionUpdate={handleTransactionUpdate}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </>
          )}

          {/* Upload bill dialog */}
          <BillUploadForm
            onAdd={handleBatchAddTransactions}
            open={uploadOpen}
            setOpen={setUploadOpen}
          />
        </>
      )}
    </div>
  );
}
