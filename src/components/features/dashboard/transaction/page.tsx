import { columns } from "./columns";
import DataTable from "./data-table";
import { TransactionProps } from "@/types/transaction";

import { useState } from "react";

export default function TransactionsTable({ transactions }: TransactionProps) {
  const [tableData, setTableData] = useState(transactions);

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl  md:min-h-min">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
