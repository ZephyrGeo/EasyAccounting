import React from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";
interface MonthlyExpenseBarChartProps {
  transactions: Transaction[];
}
export default function MonthlyExpenseBarChart({
  transactions,
}: MonthlyExpenseBarChartProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.amount < 0);

    // 按category分组并计算总支出
    const expensesByCategory = expenseTransactions.reduce(
      (acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0;
        }
        acc[curr.category] += Math.abs(curr.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    //
    const categories = Object.keys(expensesByCategory);
    const chartData = categories.map((category, index) => ({
      category,
      amount: expensesByCategory[category],
      fill: `hsl(var(--chart-${(index % 5) + 1}))`, // 使用5种不同的预设颜色循环
    }));

    // 生成配置
    const config = {
      Amount: {
        label: "Expense",
      },
      ...Object.fromEntries(
        categories.map((category, index) => [
          category,
          {
            label: category.charAt(0).toUpperCase() + category.slice(1), // 首字母大写
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          },
        ]),
      ),
    } satisfies ChartConfig;

    return {
      chartData,
      chartConfig: config,
    };
  }, [transactions]);
  return (
    <ChartContainer config={chartConfig} className="w-[400px] basis-1/2">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 50, // 增加左边距
          right: 20, // 添加右边距
          top: 10, // 添加上边距
          bottom: 10, // 添加下边距
        }}
      >
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        <XAxis dataKey="amount" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="amount" layout="vertical" radius={5} />
        <LabelList
          dataKey="amount"
          position="right"
          offset={8}
          className="fill-foreground"
          fontSize={12}
        />
      </BarChart>
    </ChartContainer>
  );
}
