import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeDatePicker } from "@/components/ui/native-date-picker";
import { Transaction } from "@/types/transaction";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillTransactionEditorProps {
  transactions: Transaction[];
  onConfirm: (transactions: Transaction[]) => void;
  onCancel: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface EditingTransaction {
  index: number;
  data: {
    amount: string;
    category: string;
    subCategory: string;
    merchant: string;
    date: string;
  };
  dateObj?: Date;
}

export default function BillTransactionEditor({
  transactions: initialTransactions,
  onConfirm,
  onCancel,
  open,
  setOpen,
}: BillTransactionEditorProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [editingTransaction, setEditingTransaction] =
    useState<EditingTransaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [newTransactionForm, setNewTransactionForm] = useState({
    amount: "",
    category: "",
    subCategory: "",
    merchant: "",
    date: "",
  });

  const [newTransactionDate, setNewTransactionDate] = useState<
    Date | undefined
  >(undefined);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const validateDate = (date: Date | undefined) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateAmount = (amountStr: string) => {
    return !isNaN(parseFloat(amountStr)) && parseFloat(amountStr) > 0;
  };

  const formatDateForEdit = (date: string) => {
    // 转换日期格式从 YY/MM/DD 到 YYYYMMDD
    const dateParts = date.split("/");
    return dateParts.length === 3
      ? `20${dateParts[0]}${dateParts[1]}${dateParts[2]}`
      : "";
  };

  const handleEdit = (index: number) => {
    const transaction = transactions[index];

    // 转换日期格式从 YY/MM/DD 到 Date 对象
    const dateParts = transaction.date.split("/");
    let dateObj: Date | undefined = undefined;
    if (dateParts.length === 3) {
      const year = parseInt(`20${dateParts[0]}`);
      const month = parseInt(dateParts[1]) - 1; // JavaScript月份从0开始
      const day = parseInt(dateParts[2]);
      dateObj = new Date(year, month, day);
    }

    setEditingTransaction({
      index,
      data: {
        amount: transaction.amount.toString(),
        category: transaction.category,
        subCategory: transaction.subCategory || "",
        merchant: transaction.merchant,
        date: formatDateForEdit(transaction.date),
      },
      dateObj: dateObj,
    });
    setErrors({});
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    const newErrors: Record<string, boolean> = {};
    const { data } = editingTransaction;

    if (!data.amount || !validateAmount(data.amount)) {
      newErrors.amount = true;
    }
    if (!data.category) {
      newErrors.category = true;
    }
    if (!data.merchant) {
      newErrors.merchant = true;
    }
    if (!validateDate(editingTransaction.dateObj)) {
      newErrors.date = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 格式化日期显示为 YY/MM/DD 格式
    const formattedDate = editingTransaction.dateObj
      ? `${editingTransaction.dateObj.getFullYear().toString().slice(-2)}/${(editingTransaction.dateObj.getMonth() + 1).toString().padStart(2, "0")}/${editingTransaction.dateObj.getDate().toString().padStart(2, "0")}`
      : "";

    const updatedTransactions = [...transactions];
    updatedTransactions[editingTransaction.index] = {
      ...updatedTransactions[editingTransaction.index],
      amount: parseFloat(data.amount),
      category: data.category,
      subCategory: data.subCategory || "",
      merchant: data.merchant,
      date: formattedDate,
    };

    setTransactions(updatedTransactions);
    setEditingTransaction(null);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setErrors({});
  };

  const handleDelete = (index: number) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleAddNew = () => {
    const newErrors: Record<string, boolean> = {};

    if (
      !newTransactionForm.amount ||
      !validateAmount(newTransactionForm.amount)
    ) {
      newErrors.amount = true;
    }
    if (!newTransactionForm.category) {
      newErrors.category = true;
    }
    if (!newTransactionForm.merchant) {
      newErrors.merchant = true;
    }
    if (!validateDate(newTransactionDate)) {
      newErrors.date = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 格式化日期显示为 YY/MM/DD 格式
    const formattedDate = newTransactionDate
      ? `${newTransactionDate.getFullYear().toString().slice(-2)}/${(newTransactionDate.getMonth() + 1).toString().padStart(2, "0")}/${newTransactionDate.getDate().toString().padStart(2, "0")}`
      : "";

    const newTransaction: Transaction = {
      id: `T${Date.now()}`,
      amount: parseFloat(newTransactionForm.amount),
      category: newTransactionForm.category,
      subCategory: newTransactionForm.subCategory || "",
      merchant: newTransactionForm.merchant,
      date: formattedDate,
      time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
    };

    setTransactions([...transactions, newTransaction]);
    setNewTransactionForm({
      amount: "",
      category: "",
      subCategory: "",
      merchant: "",
      date: "",
    });
    setNewTransactionDate(undefined);
    setShowAddForm(false);
    setErrors({});
  };

  const handleConfirm = () => {
    onConfirm(transactions);
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderTransactionCard = (transaction: Transaction, index: number) => {
    const isEditing = editingTransaction?.index === index;

    return (
      <Card key={transaction.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">
              交易记录 #{index + 1}
            </CardTitle>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditing ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">日期 *</Label>
                  <NativeDatePicker
                    date={editingTransaction.dateObj}
                    onDateChange={(date) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        dateObj: date,
                      })
                    }
                    placeholder="选择日期"
                    className={errors.date ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label className="text-xs">金额 *</Label>
                  <Input
                    value={editingTransaction.data.amount}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        data: {
                          ...editingTransaction.data,
                          amount: e.target.value,
                        },
                      })
                    }
                    className={errors.amount ? "border-red-500" : ""}
                    placeholder="例如: 24.99"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">类别 *</Label>
                  <Input
                    value={editingTransaction.data.category}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        data: {
                          ...editingTransaction.data,
                          category: e.target.value,
                        },
                      })
                    }
                    className={errors.category ? "border-red-500" : ""}
                    placeholder="例如: 餐饮"
                  />
                </div>
                <div>
                  <Label className="text-xs">子类别</Label>
                  <Input
                    value={editingTransaction.data.subCategory}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        data: {
                          ...editingTransaction.data,
                          subCategory: e.target.value,
                        },
                      })
                    }
                    placeholder="例如: 晚餐"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">商家 *</Label>
                  <Input
                    value={editingTransaction.data.merchant}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        data: {
                          ...editingTransaction.data,
                          merchant: e.target.value,
                        },
                      })
                    }
                    className={errors.merchant ? "border-red-500" : ""}
                    placeholder="例如: 麦当劳"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">金额:</span>
                <span className="ml-2 font-medium">¥{transaction.amount}</span>
              </div>
              <div>
                <span className="text-gray-500">类别:</span>
                <span className="ml-2">{transaction.category}</span>
              </div>
              <div>
                <span className="text-gray-500">子类别:</span>
                <span className="ml-2">{transaction.subCategory || "无"}</span>
              </div>
              <div>
                <span className="text-gray-500">商家:</span>
                <span className="ml-2">{transaction.merchant}</span>
              </div>
              <div>
                <span className="text-gray-500">日期:</span>
                <span className="ml-2">{transaction.date}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑交易记录</DialogTitle>
          <DialogDescription>
            请检查并编辑从账单中提取的交易记录。您可以编辑、删除或添加新的交易记录。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              交易记录 ({transactions.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加交易
            </Button>
          </div>

          {transactions.map((transaction, index) =>
            renderTransactionCard(transaction, index),
          )}

          {showAddForm && (
            <Card className="mb-4 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  添加新交易
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">日期 *</Label>
                    <NativeDatePicker
                      date={newTransactionDate}
                      onDateChange={(date) => {
                        setNewTransactionDate(date);
                        setErrors((prev) => ({ ...prev, date: false }));
                      }}
                      placeholder="选择日期"
                      className={errors.date ? "border-red-500" : ""}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">金额 *</Label>
                    <Input
                      value={newTransactionForm.amount}
                      onChange={(e) =>
                        setNewTransactionForm({
                          ...newTransactionForm,
                          amount: e.target.value,
                        })
                      }
                      className={errors.amount ? "border-red-500" : ""}
                      placeholder="例如: 24.99"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">类别 *</Label>
                    <Input
                      value={newTransactionForm.category}
                      onChange={(e) =>
                        setNewTransactionForm({
                          ...newTransactionForm,
                          category: e.target.value,
                        })
                      }
                      className={errors.category ? "border-red-500" : ""}
                      placeholder="例如: 餐饮"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">子类别</Label>
                    <Input
                      value={newTransactionForm.subCategory}
                      onChange={(e) =>
                        setNewTransactionForm({
                          ...newTransactionForm,
                          subCategory: e.target.value,
                        })
                      }
                      placeholder="例如: 晚餐"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">商家 *</Label>
                    <Input
                      value={newTransactionForm.merchant}
                      onChange={(e) =>
                        setNewTransactionForm({
                          ...newTransactionForm,
                          merchant: e.target.value,
                        })
                      }
                      className={errors.merchant ? "border-red-500" : ""}
                      placeholder="例如: 麦当劳"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleAddNew}>
                    <Check className="h-3 w-3 mr-1" />
                    添加
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTransactionForm({
                        amount: "",
                        category: "",
                        subCategory: "",
                        merchant: "",
                        date: "",
                      });
                      setNewTransactionDate(undefined);
                      setErrors({});
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确定 ({transactions.length} 条记录)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
