// @/components/features/dashboard/transaction/dateselector/MonthSelector.tsx
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "@/types/transaction";

interface MonthSelectorProps {
  transactions: Transaction[];
  onMonthChange: (monthKey: string | null) => void;
  selectedMonth: string | null; // 添加selectedMonth属性
  availableMonths?: string[];
  showAllOption?: boolean;
}

export default function MonthSelector({
  transactions,
  onMonthChange,
  selectedMonth, // 接收selectedMonth属性
  availableMonths: propAvailableMonths,
  showAllOption = true,
}: MonthSelectorProps) {
  // 使用传入的可用月份或从交易数据中提取
  const availableMonths = propAvailableMonths || transactions.reduce((months, transaction) => {
    const month = transaction.date.substring(3, 5);
    if (!months.includes(month)) {
      months.push(month);
    }
    return months;
  }, [] as string[]).sort();

  // 当有可用月份但未选择月份时，选择第一个月份
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      onMonthChange(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth, onMonthChange]);

  // 处理月份变更
  const handleMonthChange = (value: string) => {
    onMonthChange(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select 
        value={selectedMonth || "all"} 
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="选择月份" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">全部</SelectItem>}
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {month}月
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
