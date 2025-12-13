// @/components/features/dashboard/transaction/dateselector/YearSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

interface YearSelectorProps {
  onYearChange: (year: string | null) => void;
  selectedYear: string | null;
  availableYears: string[];
}

export default function YearSelector({
  onYearChange,
  selectedYear,
  availableYears,
}: YearSelectorProps) {
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
