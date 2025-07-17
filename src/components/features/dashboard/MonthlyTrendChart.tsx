import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TransactionProps } from "@/types/transaction";

export default function MonthlyTrendChart({ transactions }: TransactionProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    // Group transaction data by month
    const monthlyData: Record<string, number> = {};

    transactions.forEach((transaction) => {
      // Assume date format is YY/MM/DD
      const monthKey = transaction.date.substring(0, 5); // Get YY/MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += transaction.amount;
    });

    // Convert to array and sort
    const sortedData = Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        amount,
        displayMonth: `20${month}`, // Convert to 20YY/MM format for display
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Take only the last 6 months

    const config = {
      amount: {
        label: "Expense Amount",
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;

    return {
      chartData: sortedData,
      chartConfig: config,
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonth = (value: string) => {
    // Convert YY/MM format to a more friendly display format
    const [, month] = value.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[parseInt(month) - 1];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trends</CardTitle>
        <CardDescription>Expense trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatMonth}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${formatMonth(value as string)}`}
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Expense Amount",
                  ]}
                />
              }
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-amount)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: "var(--color-amount)",
                strokeWidth: 2,
                fill: "var(--background)",
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
