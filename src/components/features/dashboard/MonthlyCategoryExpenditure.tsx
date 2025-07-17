import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";

interface CategoryData {
  category: string;
  amount: number;
  fill: string;
}

interface MonthlyCategoryExpenditureProps {
  transactions: Transaction[];
  selectedMonth?: string | null;
}

export default function MonthlyCategoryExpenditure({
  transactions,
  selectedMonth,
}: MonthlyCategoryExpenditureProps) {
  // Generate category expense data for the selected month
  const generateCategoryData = (): CategoryData[] => {
    // Safety check: ensure transactions is an array
    if (!Array.isArray(transactions)) {
      return [];
    }

    // Filter transaction data for the selected month
    const filteredTransactions = selectedMonth
      ? transactions.filter((transaction) => {
          const monthKey = transaction.date.substring(0, 5); // YY/MM
          return monthKey === selectedMonth;
        })
      : transactions;

    // Aggregate expenses by category
    const categoryTotals: { [key: string]: number } = {};

    filteredTransactions.forEach((transaction) => {
      const category = transaction.category;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    // Convert to chart data format
    const categories = Object.entries(categoryTotals).slice(0, 8); // Show only top 8 categories

    // Define color array
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "#8884d8",
      "#82ca9d",
      "#ffc658",
    ];

    return categories.map(([category, amount], index) => ({
      category,
      amount,
      fill: colors[index % colors.length],
    }));
  };

  const chartData = generateCategoryData();
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Get the highest expense category
  const topCategory = chartData.length > 0 ? chartData[0] : null;
  const topCategoryPercentage = topCategory
    ? ((topCategory.amount / totalAmount) * 100).toFixed(1)
    : "0";

  // Dynamically generate chart configuration
  const chartConfig = chartData.reduce((config, item) => {
    config[item.category] = {
      label: item.category,
      color: item.fill,
    };
    return config;
  }, {} as ChartConfig);

  // Format month display
  const formatMonthDisplay = (monthKey: string | null | undefined) => {
    if (!monthKey) return "All Months";
    const [year, month] = monthKey.split("/");
    return `20${year}/${month}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Expense Distribution</CardTitle>
        <CardDescription>{formatMonthDisplay(selectedMonth)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[400px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />

            <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `¥${value.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {topCategory && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {topCategory.category} has the highest share {topCategoryPercentage}
            %
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing expense category distribution for{" "}
          {formatMonthDisplay(selectedMonth)}
        </div>
        {chartData.length === 0 && (
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
