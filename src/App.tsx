import Layouts from "@/components/layouts/Layouts";
import DashBoard from "@/components/features/dashboard/DashBoard";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

const BASE_URL = "http://localhost:8000";

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`${BASE_URL}/transactions`);
        const data = await response.json();
        setTransactions(data);
      } catch {
        alert("Failed to fetch transactions");
      }
    }
    fetchTransactions();
  }, []);
  return (
    <Layouts>
      <DashBoard transactions={transactions} />
    </Layouts>
  );
}

export default App;
