// @/components/features/dashboard/transaction/dateselector/YearSelector.tsx
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface YearSelectorProps {
  transactions: Transaction[];
  onYearChange: (year: string | null) => void;
  selectedYear: string | null;
  availableYears?: string[];
  showAllOption?: boolean;
}

export default function YearSelector({
  transactions,
  onYearChange,
  selectedYear,
  availableYears: propAvailableYears,
  showAllOption = true,
}: YearSelectorProps) {
  // 使用传入的可用年份或从交易数据中提取
  // 修复：从日期中正确提取年份部分 (YY)
  const availableYears = propAvailableYears || transactions.reduce((years, transaction) => {
    // 从 YY/MM/DD 格式中提取 YY 部分
    const year = transaction.date.substring(0, 2);
    if (!years.includes(year)) {
      years.push(year);
    }
    return years;
  }, [] as string[]).sort().reverse();

  // 当没有年份时，初始化为第一个可用年份
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      onYearChange(availableYears[0]);
    }
  }, [availableYears, selectedYear, onYearChange]);

  // 处理年份变更
  const handleYearChange = (value: string) => {
    onYearChange(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedYear || "all"} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="选择年份" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">全部</SelectItem>}
          {availableYears.map((year) => (
            <SelectItem key={year} value={year}>
              20{year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
