// @/components/features/dashboard/transaction/dateselector/YearSelector.tsx
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
}

export default function YearSelector({
  transactions,
  onYearChange,
  selectedYear,
  availableYears: propAvailableYears,
}: YearSelectorProps) {
  // 使用传入的可用年份或从交易数据中提取
  // 修复：从日期中正确提取年份部分 (YY)
  const availableYears =
    propAvailableYears ||
    transactions
      .reduce((years, transaction) => {
        // 从 YY/MM/DD 格式中提取 YY 部分
        const year = transaction.date.substring(0, 2);
        if (!years.includes(year)) {
          years.push(year);
        }
        return years;
      }, [] as string[])
      .sort()
      .reverse();

  // 移除自动初始化逻辑，避免flash问题
  // useEffect(() => {
  //   if (availableYears.length > 0 && !selectedYear) {
  //     onYearChange(availableYears[0]);
  //   }
  // }, [availableYears, selectedYear, onYearChange]);

  // 处理年份变更
  const handleYearChange = (value: string) => {
    onYearChange(value);
  };

  // 如果没有选中年份且有可用年份，选择第一个；如果没有数据，显示"null"
  const displayValue =
    selectedYear || (availableYears.length > 0 ? availableYears[0] : "null");

  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <Select value={displayValue} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.length === 0 ? (
            <SelectItem key="null" value="null">
              null
            </SelectItem>
          ) : (
            availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                20{year}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
