import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionProps } from "@/types/transaction";

export default function CategoryExpensePieChart({
  transactions,
}: TransactionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const { chartData, chartConfig, categories } = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get last month's year and month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Group by category and month
    const currentMonthData: Record<string, number> = {};
    const lastMonthData: Record<string, number> = {};

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (
        transactionYear === currentYear &&
        transactionMonth === currentMonth
      ) {
        if (!currentMonthData[transaction.category]) {
          currentMonthData[transaction.category] = 0;
        }
        currentMonthData[transaction.category] += transaction.amount;
      } else if (
        transactionYear === lastMonthYear &&
        transactionMonth === lastMonth
      ) {
        if (!lastMonthData[transaction.category]) {
          lastMonthData[transaction.category] = 0;
        }
        lastMonthData[transaction.category] += transaction.amount;
      }
    });

    // Get all categories
    const allCategories = new Set([
      ...Object.keys(currentMonthData),
      ...Object.keys(lastMonthData),
    ]);

    const categoriesArray = Array.from(allCategories).sort();

    // Generate chart data based on selected category
    let chartData;
    if (selectedCategory === "all") {
      // Show comparison of all categories
      chartData = categoriesArray
        .map((category) => ({
          category,
          currentMonth: currentMonthData[category] || 0,
          lastMonth: lastMonthData[category] || 0,
        }))
        .sort(
          (a, b) =>
            b.currentMonth + b.lastMonth - (a.currentMonth + a.lastMonth),
        )
        .slice(0, 6); // Show only top 6 categories
    } else {
      // Show current month/last month comparison for single category
      chartData = [
        {
          period: "Last Month",
          amount: lastMonthData[selectedCategory] || 0,
        },
        {
          period: "This Month",
          amount: currentMonthData[selectedCategory] || 0,
        },
      ];
    }

    // Generate configuration
    const config: ChartConfig =
      selectedCategory === "all"
        ? {
            currentMonth: {
              label: "This Month",
              color: "hsl(var(--chart-1))",
            },
            lastMonth: {
              label: "Last Month",
              color: "hsl(var(--chart-2))",
            },
          }
        : {
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-1))",
            },
          };

    return {
      chartData,
      chartConfig: config,
      categories: categoriesArray,
    };
  }, [transactions, selectedCategory]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              {selectedCategory === "all"
                ? "Comparison of expenses by category between this month and last month"
                : `${selectedCategory} category expense comparison between this month and last month`}
            </CardDescription>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {selectedCategory === "all" ? (
            <AreaChart
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
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={60}
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
                    labelFormatter={(value) => `${value}`}
                    formatter={(value, name) => [
                      formatCurrency(value as number),
                      name === "currentMonth" ? "This Month" : "Last Month",
                    ]}
                  />
                }
              />
              <Area
                dataKey="lastMonth"
                type="natural"
                fill="var(--color-lastMonth)"
                fillOpacity={0.4}
                stroke="var(--color-lastMonth)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="currentMonth"
                type="natural"
                fill="var(--color-currentMonth)"
                fillOpacity={0.4}
                stroke="var(--color-currentMonth)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          ) : (
            <BarChart
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
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
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
                    labelFormatter={(value) => `${value}`}
                    formatter={(value) => [
                      formatCurrency(value as number),
                      "Amount",
                    ]}
                  />
                }
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
