import { useState, useMemo, useEffect, useCallback } from "react";
import MonthlyTotalExpenditure from "./MonthlyTotalExpenditure";
import { Transaction, TransactionProps } from "@/types/transaction";
import TransactionsTable from "./transaction/page";
import YearSelector from "./transaction/dateselector/YearSelector";
import MonthSelector from "./transaction/dateselector/MonthSelector";

// 只显示需要修改的部分
export default function DashBoard({ transactions }: TransactionProps) {
  // 添加年份和月份的状态
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  // 添加状态来跟踪所有交易数据，包括新添加的
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactions);

  // 当传入的transactions变化时更新allTransactions
  useEffect(() => {
    setAllTransactions(transactions);
  }, [transactions]);

  // 提取可用的年份
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    allTransactions.forEach(transaction => {
      const year = transaction.date.substring(0, 2); // 只取前两位作为年份
      years.add(year);
    });
    return Array.from(years).sort().reverse(); // 降序排列，最新年份在前
  }, [allTransactions]);

  // 提取可用的月份（只有月份，不包含年份）
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    const filteredByYear = selectedYear 
      ? allTransactions.filter(t => t.date.startsWith(selectedYear))
      : allTransactions;
    
    filteredByYear.forEach(transaction => {
      const month = transaction.date.substring(3, 5);
      months.add(month);
    });
    return Array.from(months).sort();
  }, [allTransactions, selectedYear]);

  // 初始化选择第一个可用的年份
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // 修改这部分逻辑，避免在有新月份时自动重置选择
  useEffect(() => {
    if (selectedYear) {
      // 只有当当前选中的月份不在可用月份列表中时，才设置为第一个可用月份
      if (selectedMonth && !availableMonths.includes(selectedMonth)) {
        if (availableMonths.length > 0) {
          setSelectedMonth(availableMonths[0]);
        } else {
          setSelectedMonth(null);
        }
      } else if (!selectedMonth && availableMonths.length > 0) {
        // 如果没有选中月份且有可用月份，选择第一个
        setSelectedMonth(availableMonths[0]);
      }
    } else {
      // 如果没有选中年份，重置月份选择
      setSelectedMonth(null);
    }
  }, [selectedYear, availableMonths, selectedMonth]);

  // 根据选择的年份和月份筛选交易数据
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // 如果选择了年份，筛选该年的交易
    if (selectedYear) {
      filtered = filtered.filter(transaction => 
        transaction.date.startsWith(selectedYear)
      );
    }

    // 如果选择了月份，进一步筛选该月的交易
    if (selectedMonth) {
      filtered = filtered.filter(transaction => 
        transaction.date.substring(3, 5) === selectedMonth
      );
    }

    return filtered;
  }, [allTransactions, selectedYear, selectedMonth]);

  // 处理交易数据更新
  const handleTransactionUpdate = useCallback((updatedTransactions: Transaction[]) => {
    setAllTransactions(updatedTransactions);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <YearSelector 
            transactions={allTransactions} 
            onYearChange={setSelectedYear} 
            selectedYear={selectedYear}
            availableYears={availableYears}
            showAllOption={true}
          />
          {selectedYear && (
            <MonthSelector 
              transactions={allTransactions.filter(t => t.date.startsWith(selectedYear))} 
              onMonthChange={setSelectedMonth}
              selectedMonth={selectedMonth}
              availableMonths={availableMonths}
              showAllOption={true}
            />
          )}
        </div>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <MonthlyTotalExpenditure transactions={filteredTransactions} />
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>Showing 各项支出占比 with 横Bar Chart</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>Showing前6个月的竖柱状图 or 环比：上个月</p>
        </div>
      </div>

      <TransactionsTable 
        transactions={filteredTransactions} 
        onTransactionUpdate={handleTransactionUpdate}
      />
    </div>
  );
}
