// App.tsx
import Layouts from "@/components/layouts/Layouts";
import DashBoard from "@/components/features/dashboard/DashBoard";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";
import { getTransactions } from "@/api/transactions";
import { BillBookProvider } from "@/contexts/BillBookContext";

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const data = await getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch transaction data:", err);
        setError("Unable to read transaction data file");
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <BillBookProvider>
      <Layouts>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-lg">Loading data...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}
            <DashBoard transactions={transactions} />
          </>
        )}
      </Layouts>
    </BillBookProvider>
  );
}

export default App;
