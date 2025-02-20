import MonthlyTotalExpenditure from "./MonthlyTotalExpenditure";
import { TransactionProps } from "@/types/transaction";
import TransactionsTable from "./transaction/page";

export default function DashBoard({ transactions }: TransactionProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <MonthlyTotalExpenditure transactions={transactions} />
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>Showing 各项支出占比 with 横Bar Chart</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <p>Showing前6个月的竖柱状图 or 环比：上个月</p>
        </div>
      </div>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}
