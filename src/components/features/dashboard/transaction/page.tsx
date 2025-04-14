// @/components/features/dashboard/transaction/page.tsx
import { createColumns } from "./columns";
import DataTable from "./data-table";
import { Transaction, TransactionProps } from "@/types/transaction";
import { useState, useEffect, useCallback } from "react";
import TransactionForm from "./TransactionForm";

// localStorage的键名
const STORAGE_KEY = "transactions_data";

// 在TransactionsTable组件中添加onTransactionUpdate属性
interface TransactionsTableProps extends TransactionProps {
  onTransactionUpdate?: (transactions: Transaction[]) => void;
}

export default function TransactionsTable({
  transactions: initialTransactions,
  onTransactionUpdate,
}: TransactionsTableProps) {
  // 从localStorage初始化或使用props
  const [tableData, setTableData] = useState<Transaction[]>(() => {
    // 检查localStorage中是否有数据
    if (typeof window !== "undefined") {
      // 确保代码在浏览器环境执行
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error("解析localStorage数据失败:", e);
          return initialTransactions || [];
        }
      }
    }
    return initialTransactions || [];
  });

  // 移除内部的月份筛选逻辑
  // 删除 selectedMonth, transactionsByMonth, currentTransactions 和 handleMonthChange

  // 编辑功能的状态
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 处理编辑交易
  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  }, []);

  // 保存编辑后的交易
  const handleSaveEdit = useCallback(
    (id: string, updatedTransaction: Transaction) => {
      const updatedData = tableData.map((transaction) =>
        transaction.id === id ? updatedTransaction : transaction
      );

      setTableData(updatedData);

      // 保存到localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      }

      // 清除编辑状态
      setEditingTransaction(undefined);
      
      // 通知父组件交易数据已更新
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedData);
      }
    },
    [tableData, onTransactionUpdate]
  );

  // 处理删除交易
  const handleDeleteTransaction = useCallback(
    (id: string) => {
      if (window.confirm("确定要删除这条交易记录吗？此操作不可恢复。")) {
        const updatedData = tableData.filter(
          (transaction) => transaction.id !== id
        );
        setTableData(updatedData);

        // 保存到localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        }
        
        // 通知父组件交易数据已更新
        if (onTransactionUpdate) {
          onTransactionUpdate(updatedData);
        }
      }
    },
    [tableData, onTransactionUpdate]
  );
  
  // 处理添加新交易
  const handleAddTransaction = useCallback(
    (newTransaction: Transaction) => {
      const updatedData = [...tableData, newTransaction];
      setTableData(updatedData);
  
      // 添加日志，帮助调试
      console.log("添加新交易:", newTransaction);
      console.log("交易日期:", newTransaction.date);
  
      // 保存到localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      }
      
      // 通知父组件交易数据已更新
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedData);
      }
    },
    [tableData, onTransactionUpdate]
  );

  // 创建包含删除和编辑处理程序的列定义
  const columns = createColumns({
    onDelete: handleDeleteTransaction,
    onEdit: handleEditTransaction,
  });

  // 当初始交易数据变化且本地没有保存数据时更新tableData
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      initialTransactions &&
      initialTransactions.length > 0
    ) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      // 如果localStorage为空或数据不存在，则使用initialTransactions并保存
      if (!savedData) {
        setTableData(initialTransactions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions));
      } else {
        // 合并API数据和本地存储数据
        try {
          const localData = JSON.parse(savedData);
          // 使用ID作为唯一标识符合并数据
          const mergedData = mergeTransactions(localData, initialTransactions);
          setTableData(mergedData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
        } catch (e) {
          console.error("合并交易数据失败:", e);
        }
      }
    }
  }, [initialTransactions]);

  // 合并交易数据，保留本地添加的数据
  const mergeTransactions = (
    localData: Transaction[],
    apiData: Transaction[]
  ): Transaction[] => {
    // 创建ID到对象的映射以便快速查找
    const localMap = new Map(localData.map((item) => [item.id, item]));

    // 创建结果数组
    const result: Transaction[] = [];

    // 添加所有本地数据
    localData.forEach((item) => {
      result.push(item);
    });

    // 添加API中有但本地没有的数据
    apiData.forEach((item) => {
      if (!localMap.has(item.id)) {
        result.push(item);
      }
    });

    return result;
  };

  // 添加清除所有数据的功能（仅用于测试）
  const handleClearAllData = () => {
    if (window.confirm("确定要清除所有交易数据吗？此操作不可恢复。")) {
      setTableData([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      // 通知父组件数据已清除
      if (onTransactionUpdate) {
        onTransactionUpdate([]);
      }
    }
  };

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min"> 
      <DataTable
        columns={columns}
        data={initialTransactions} // 直接使用传入的已筛选数据
        onAdd={handleAddTransaction}
      />

      {/* 编辑交易对话框 */}
      <TransactionForm
        mode="edit"
        transaction={editingTransaction}
        onEdit={handleSaveEdit}
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
      />

      {/* 可选：添加一个清除数据按钮，仅用于开发测试 */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-right">
          <button
            onClick={handleClearAllData}
            className="text-xs text-red-500 hover:text-red-700"
          >
            清除所有数据（仅开发环境可见）
          </button>
        </div>
      )}
    </div>
  );
}
