import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction";

interface TransactionFormProps {
  onAdd?: (transaction: Transaction) => void;
  onEdit?: (id: string, transaction: Transaction) => void;
  transaction?: Transaction;
  mode: "add" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function TransactionForm({
  onAdd,
  onEdit,
  transaction,
  mode = "add",
  open,
  setOpen,
  trigger,
}: TransactionFormProps) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    subCategory: "",
    merchant: "",
    date: "",
    tags: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 当编辑模式下，初始化表单数据
  useEffect(() => {
    if (isEditMode && transaction) {
      // 转换日期格式从 YY/MM/DD 到 YYYYMMDD (用于表单编辑)
      const dateParts = transaction.date.split("/");
      const formattedDate =
        dateParts.length === 3
          ? `20${dateParts[0]}${dateParts[1]}${dateParts[2]}`
          : "";

      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        subCategory: transaction.subCategory || "",
        merchant: transaction.merchant,
        date: formattedDate,
        tags: Array.isArray(transaction.tags)
          ? transaction.tags.join(", ")
          : "",
      });
    } else {
      // 添加模式时重置表单
      resetForm();
    }
  }, [transaction, isEditMode, open]);

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      subCategory: "",
      merchant: "",
      date: "",
      tags: "",
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleFocus = (field: string) => {
    // 当输入框获得焦点时清除该字段的错误状态
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateDate = (dateStr: string) => {
    // 简单验证日期格式 YYYYMMDD
    const dateRegex = /^(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
    return dateRegex.test(dateStr);
  };

  const validateAmount = (amountStr: string) => {
    // 验证金额是否为有效数字
    return !isNaN(parseFloat(amountStr)) && parseFloat(amountStr) > 0;
  };

  const handleSubmit = () => {
    // 验证必填字段
    const newErrors: Record<string, boolean> = {};

    // 验证金额
    if (!formData.amount || !validateAmount(formData.amount)) {
      newErrors.amount = true;
    }

    // 验证类别
    if (!formData.category) {
      newErrors.category = true;
    }

    // 验证商家
    if (!formData.merchant) {
      newErrors.merchant = true;
    }

    // 验证日期
    if (!formData.date || !validateDate(formData.date)) {
      newErrors.date = true;
    }

    // 如果有错误，更新错误状态并返回
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 格式化日期显示为 YY/MM/DD 格式
    const formattedDate = formData.date.replace(
      /^(20(\d{2}))(\d{2})(\d{2})$/,
      "$2/$3/$4"
    );

    // 创建交易记录对象
    const transactionData: Transaction = {
      id: isEditMode && transaction ? transaction.id : `T${Date.now()}`,
      amount: parseFloat(formData.amount),
      category: formData.category,
      subCategory: formData.subCategory || "",
      merchant: formData.merchant,
      date: formattedDate, // 使用YY/MM/DD格式
      time:
        isEditMode && transaction
          ? transaction.time
          : new Date().toLocaleTimeString(),
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
    };

    // 根据模式调用相应的回调函数
    if (isEditMode && onEdit && transaction) {
      onEdit(transaction.id, transactionData);
    } else if (onAdd) {
      onAdd(transactionData);
    }

    // 关闭对话框并重置表单
    setOpen(false);
    resetForm();
  };

  const dialogTitle = isEditMode ? "编辑交易" : "添加交易";
  const dialogDescription = isEditMode
    ? "请修改下方的交易信息并提交以更新记录。带 * 的字段为必填项。"
    : "请在下方输入交易信息并提交以更新您的记录。带 * 的字段为必填项。";
  const submitButtonText = isEditMode ? "更新" : "添加";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              金额 *
            </Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onFocus={() => handleFocus("amount")}
              placeholder="例如: 24.99"
              className={
                errors.amount ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.amount && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                请输入有效金额
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              类别 *
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              onFocus={() => handleFocus("category")}
              placeholder="例如: 食品"
              className={
                errors.category ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.category && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                类别为必填项
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subCategory" className="text-right">
              子类别
            </Label>
            <Input
              id="subCategory"
              value={formData.subCategory}
              onChange={(e) => handleChange("subCategory", e.target.value)}
              placeholder="例如: 午餐"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="merchant" className="text-right">
              商家 *
            </Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={(e) => handleChange("merchant", e.target.value)}
              onFocus={() => handleFocus("merchant")}
              placeholder="例如: 星巴克"
              className={
                errors.merchant ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.merchant && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                商家为必填项
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              日期 *
            </Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              onFocus={() => handleFocus("date")}
              placeholder="格式: 20250105"
              className={
                errors.date ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.date && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                请输入有效日期 (YYYYMMDD)
              </p>
            )}
            <p className="col-span-3 col-start-2 text-xs text-gray-500">
              输入格式为YYYYMMDD，将显示为YY/MM/DD
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              标签
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="例如: 月付, 家庭"
              className="col-span-3"
            />
            <p className="col-span-3 col-start-2 text-xs text-gray-500">
              多个标签请用逗号分隔
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 为了保持向后兼容性，提供一个添加交易的组件
export function AddTransaction({
  onAdd,
}: {
  onAdd: (transaction: Transaction) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TransactionForm
      mode="add"
      onAdd={onAdd}
      open={open}
      setOpen={setOpen}
      trigger={<Button className="ml-2">添加</Button>}
    />
  );
}
