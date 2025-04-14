// @/components/features/dashboard/transaction/MonthSelector.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface MonthSelectorProps {
  transactions: Transaction[];
  onMonthChange: (monthKey: string | null) => void;
}

export default function MonthSelector({
  transactions,
  onMonthChange,
}: MonthSelectorProps) {
  // 从交易数据中提取可用月份
  const availableMonths = useMemo(() => {
    const months = new Set<string>();

    transactions.forEach((transaction) => {
      // 从日期中提取年月部分 (YY/MM)
      const monthKey = transaction.date.substring(0, 5);
      months.add(monthKey);
    });

    // 将月份转换为数组并按降序排序（最新月份在前）
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // 添加一个"all"选项表示所有月份
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // 当没有月份时，初始化为"all"
  useEffect(() => {
    if (availableMonths.length > 0 && selectedMonth === "all") {
      // 默认选择最新月份
      setSelectedMonth(availableMonths[0]);
      onMonthChange(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth, onMonthChange]);

  // 处理月份变更
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    // 如果选择"all"，则传递null给父组件
    onMonthChange(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择月份" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部月份</SelectItem>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {month} 月
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
