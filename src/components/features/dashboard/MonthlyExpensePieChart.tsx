import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { TransactionProps } from "@/types/transaction";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function MonthlyExpenseBarChart({
  transactions,
}: TransactionProps) {
  const copiedTransactions = transactions;

  const totalAmount = copiedTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  // 按类别分组并计算金额
  const categoryAmounts: Record<string, number> = {};
  copiedTransactions.forEach((transaction) => {
    if (!categoryAmounts[transaction.category]) {
      categoryAmounts[transaction.category] = 0;
    }
    categoryAmounts[transaction.category] += transaction.amount;
  });

  const categoriesArray = Object.entries(categoryAmounts).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalAmount) * 100,
    })
  );

  categoriesArray.sort((a, b) => b.amount - a.amount);

  const topCategories = categoriesArray.slice(0, 3);

  const othersAmount = categoriesArray
    .slice(3)
    .reduce((sum, cat) => sum + cat.amount, 0);
  const othersPercentage = (othersAmount / totalAmount) * 100;

  const finalCategories = React.useMemo(
    () => [
      ...topCategories,
      {
        category: "Others",
        amount: othersAmount,
        percentage: othersPercentage,
      },
    ],
    [topCategories, othersAmount, othersPercentage]
  );

  // 生成图表数据和配置
  const { chartData, chartConfig } = React.useMemo(() => {
    const chartData = finalCategories.map((item, index) => ({
      category: item.category,
      amount: item.amount,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));

    // 生成配置
    const config = {
      Amount: {
        label: "Expense",
      },
      ...Object.fromEntries(
        finalCategories.map((item, index) => [
          item.category,
          {
            label:
              item.category.charAt(0).toUpperCase() + item.category.slice(1),
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          },
        ])
      ),
    } satisfies ChartConfig;

    return {
      chartData,
      chartConfig: config,
    };
  }, [finalCategories]); // 添加 finalCategories 作为依赖项

  const formatPercentage = React.useCallback(
    (value: number) => {
      const percentage = (value / totalAmount) * 100;
      return `${percentage.toFixed(1)}%`;
    },
    [totalAmount]
  );

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="amount" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar dataKey="amount" layout="vertical" fill="fill" radius={4}>
          <LabelList
            dataKey="category"
            position="insideLeft"
            offset={8}
            className="fill-white"
            fontSize={12}
          />
          <LabelList
            dataKey="amount"
            position="right"
            offset={8}
            fontSize={12}
            className="text-sm font-medium text-foreground"
            formatter={formatPercentage}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
