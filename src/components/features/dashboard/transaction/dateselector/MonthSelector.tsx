// @/components/features/dashboard/transaction/dateselector/MonthSelector.tsx
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
}

export default function MonthSelector({
  transactions,
  onMonthChange,
  selectedMonth, // 接收selectedMonth属性
  availableMonths: propAvailableMonths,
}: MonthSelectorProps) {
  // 使用传入的可用月份或从交易数据中提取
  const availableMonths =
    propAvailableMonths ||
    transactions
      .reduce((months, transaction) => {
        const month = transaction.date.substring(3, 5);
        if (!months.includes(month)) {
          months.push(month);
        }
        return months;
      }, [] as string[])
      .sort();

  // 移除自动初始化逻辑，避免flash问题
  // useEffect(() => {
  //   if (availableMonths.length > 0 && !selectedMonth) {
  //     onMonthChange(availableMonths[0]);
  //   }
  // }, [availableMonths, selectedMonth, onMonthChange]);

  // 处理月份变更
  const handleMonthChange = (value: string) => {
    onMonthChange(value);
  };

  // 如果没有选中月份且有可用月份，选择第一个；如果没有数据，显示"null"
  const displayValue =
    selectedMonth || (availableMonths.length > 0 ? availableMonths[0] : "null");

  return (
    <div className="flex items-center space-x-2">
      <Select value={displayValue} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.length === 0 ? (
            <SelectItem key="null" value="null">
              null
            </SelectItem>
          ) : (
            availableMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
