// @/components/features/dashboard/transaction/dateselector/MonthSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  onMonthChange: (monthKey: string | null) => void;
  selectedMonth: string | null;
  availableMonths: string[];
}

export default function MonthSelector({
  onMonthChange,
  selectedMonth,
  availableMonths,
}: MonthSelectorProps) {
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
