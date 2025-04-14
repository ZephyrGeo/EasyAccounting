// App.tsx
import Layouts from "@/components/layouts/Layouts";
import DashBoard from "@/components/features/dashboard/DashBoard";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

// 后端API基础URL
const BASE_URL = "http://localhost:8000";

// 示例数据，可在API不可用时使用
const sampleTransactions: Transaction[] = [
  {
    id: "T1713084000000",
    amount: 3800,
    category: "食品",
    subCategory: "午餐",
    merchant: "寿司餐厅",
    date: "2025-04-14",
    time: "12:30:00",
    tags: ["商务", "客户"],
  },
  {
    id: "T1713070000000",
    amount: 12000,
    category: "交通",
    subCategory: "出租车",
    merchant: "东京出租车",
    date: "2025-04-13",
    time: "19:45:00",
    tags: ["商务"],
  },
  {
    id: "T1712980000000",
    amount: 5600,
    category: "购物",
    subCategory: "服装",
    merchant: "优衣库",
    date: "2025-04-12",
    time: "15:20:00",
    tags: ["个人"],
  },
];

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/transactions`);
        if (!response.ok) {
          throw new Error(`API响应错误: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error("获取交易数据失败:", err);
        setError("无法连接到服务器，使用示例数据");
        // 使用示例数据作为后备
        setTransactions(sampleTransactions);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <Layouts>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">加载数据中...</p>
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
  );
}

export default App;
