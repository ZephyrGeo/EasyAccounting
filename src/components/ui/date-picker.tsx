"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({ date, setDate, disabled, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal px-4 py-2.5 h-[46px] rounded-xl bg-[#F7F7F3] border-[#E5E5E0] text-[#1A1A1A] text-[13.5px] shadow-none hover:bg-[#F0F0EA] focus:ring-1 focus:ring-[#1A1A1A] transition-all",
            !date && "text-muted-foreground",
            className,
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-[#E5E5E0] shadow-xl" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
