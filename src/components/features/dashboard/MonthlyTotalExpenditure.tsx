import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TransactionProps } from "@/types/transaction";
import MonthlyExpenseBarChart from "./MonthlyExpensePieChart";

const momGrowthRate: number = -0.8;

export default function MonthlyTotalExpenditure({
  transactions,
}: TransactionProps) {
  const totalExpenditure = transactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const formattedTotalExpenditure = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(totalExpenditure);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Total Expenditure</CardTitle>
        <CardTitle className="text-3xl font-bold">
          {formattedTotalExpenditure}
        </CardTitle>
        {momGrowthRate > 0 ? (
          <CardDescription className="flex items-center gap-2">
            Trending up by {momGrowthRate}% this month
            <TrendingUp className="h-4 w-4" />
          </CardDescription>
        ) : momGrowthRate < 0 ? (
          <CardDescription className="flex items-center gap-2">
            Trending down by {Math.abs(momGrowthRate)}% this month
            <TrendingDown className="h-4 w-4" />
          </CardDescription>
        ) : (
          <CardDescription className="flex items-center gap-2">
            No change this month
            <TrendingUp className="h-4 w-4" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <MonthlyExpenseBarChart transactions={transactions} />
      </CardContent>
    </Card>
  );
}
