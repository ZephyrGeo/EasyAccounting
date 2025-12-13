import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { Calculator, TrendingUp, Receipt, Calendar } from "lucide-react";

interface QuickStatsCardsProps {
  transactions: Transaction[];
}

export default function QuickStatsCards({
  transactions,
}: QuickStatsCardsProps) {
  const stats = React.useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalAmount: 0,
        averageDaily: 0,
        maxTransaction: 0,
        transactionCount: 0,
      };
    }

    // 计算总支出
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    // 计算最大单笔支出
    const maxTransaction = Math.max(...transactions.map((t) => t.amount));

    // 计算平均每日支出
    const uniqueDates = new Set(transactions.map((t) => t.date));
    const dayCount = uniqueDates.size || 1;
    const averageDaily = totalAmount / dayCount;

    return {
      totalAmount,
      averageDaily,
      maxTransaction,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: "本月总支出",
      value: formatCurrency(stats.totalAmount),
      icon: Calculator,
      description: "当前筛选期间的总支出",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "平均每日支出",
      value: formatCurrency(stats.averageDaily),
      icon: Calendar,
      description: "基于有交易的天数计算",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "最大单笔支出",
      value: formatCurrency(stats.maxTransaction),
      icon: TrendingUp,
      description: "单笔最高消费金额",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "交易笔数",
      value: stats.transactionCount.toString(),
      icon: Receipt,
      description: "总交易记录数量",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
