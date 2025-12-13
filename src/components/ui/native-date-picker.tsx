import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NativeDatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NativeDatePicker({
  date,
  onDateChange,
  placeholder = "选择日期",
  className,
  disabled = false,
}: NativeDatePickerProps) {
  // 将Date对象转换为YYYY-MM-DD格式
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 将YYYY-MM-DD格式转换为Date对象
  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const parsedDate = parseDateFromInput(dateString);
    console.log(
      "NativeDatePicker - date changed:",
      dateString,
      "->",
      parsedDate,
    );
    onDateChange?.(parsedDate);
  };

  return (
    <Input
      type="date"
      value={formatDateForInput(date)}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn("w-full", className)}
      disabled={disabled}
    />
  );
}
