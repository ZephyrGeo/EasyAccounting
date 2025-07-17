import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { DayButton } from "react-day-picker";
import { cn } from "@/lib/utils";

interface ExpenseCalendarProps {
  transactions: Transaction[];
  selectedYear?: string | null;
  selectedMonth?: string | null;
}

interface DailyExpense {
  amount: number;
  hasData: boolean;
}

// Date format conversion function
const formatDateToTransactionFormat = (date: Date): string => {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// Custom date button component
const ExpenseDayButton = ({
  day,
  dailyExpenses,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  dailyExpenses: Record<string, DailyExpense>;
}) => {
  const dateStr = formatDateToTransactionFormat(day.date);
  const expense = dailyExpenses[dateStr];

  const formatAmount = (amount: number): string => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}w`;
    }
    return amount.toLocaleString();
  };

  return (
    <DayButton
      day={day}
      {...props}
      className={cn(
        "h-auto min-h-[50px] w-full flex flex-col items-center justify-start p-1 text-center relative",
        "hover:bg-accent hover:text-accent-foreground",
        props.className,
      )}
    >
      <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>

      {expense?.hasData ? (
        <div className="flex flex-col items-center">
          <div className="text-xs font-medium text-red-600">
            -{formatAmount(expense.amount)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-400">-0.00</div>
        </div>
      )}
    </DayButton>
  );
};

export default function ExpenseCalendar({
  transactions,
  selectedYear,
  selectedMonth: selectedMonthProp,
}: ExpenseCalendarProps) {
  // Construct Date object based on externally passed year and month, use current date if not passed
  const getInitialDate = () => {
    if (selectedYear && selectedMonthProp) {
      // Convert YY format to full year, MM format to month index
      const fullYear = 2000 + parseInt(selectedYear);
      const monthIndex = parseInt(selectedMonthProp) - 1; // Month index starts from 0
      return new Date(fullYear, monthIndex, 1);
    }
    return new Date();
  };

  const [selectedMonth, setSelectedMonth] = useState<Date>(getInitialDate());

  // Calculate daily expense data
  const dailyExpenses = useMemo(() => {
    const expenses: Record<string, DailyExpense> = {};

    // Aggregate expenses by date
    transactions.forEach((transaction) => {
      const dateStr = transaction.date;
      const currentAmount = expenses[dateStr]?.amount || 0;
      expenses[dateStr] = {
        amount: currentAmount + transaction.amount,
        hasData: true,
      };
    });

    return expenses;
  }, [transactions]);

  // Update calendar display month when external year/month selector changes
  useEffect(() => {
    if (selectedYear && selectedMonthProp) {
      const fullYear = 2000 + parseInt(selectedYear);
      const monthIndex = parseInt(selectedMonthProp) - 1;
      const newDate = new Date(fullYear, monthIndex, 1);
      setSelectedMonth(newDate);
    }
  }, [selectedYear, selectedMonthProp]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className=" font-semibold">Daily Expense Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => date && setSelectedMonth(date)}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            className="p-0"
            showOutsideDays={false}
            classNames={{
              months: "flex flex-col sm:flex-row",
              month: "flex w-full flex-col",
              caption: "flex justify-center items-center gap-4 relative",
              caption_label: "text-sm font-medium",
              nav: "hidden", // Hide navigation arrows
              nav_button: "hidden", // Hide navigation buttons
              nav_button_previous: "hidden", // Hide previous month button
              nav_button_next: "hidden", // Hide next month button
              table: "w-full border-collapse",
              head_row: "flex justify-center",
              head_cell:
                "text-muted-foreground rounded-md flex-1 text-center font-normal text-[0.8rem]",
              row: "flex justify-center",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                "h-auto min-h-[50px] flex-1",
              ),
              day: "h-auto min-h-[50px] w-full p-0 font-normal aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected: "",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "hidden", // Hide dates outside current month
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              DayButton: (props) => (
                <ExpenseDayButton {...props} dailyExpenses={dailyExpenses} />
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
