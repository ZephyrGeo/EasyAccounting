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

import { useState } from "react";
import { Transaction } from "@/types/transaction";

interface AddTransactionProps {
  onAdd: (transaction: Transaction) => void;
}

// 1. 添加*，必填项，apply时，必填项为空，input框变为红色。

export default function AddTransaction({ onAdd }: AddTransactionProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    subCategory: "",
    merchant: "",
    date: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleFocus = (field: string) => {
    // 当输入框获得焦点时清除该字段的错误状态
    setErrors((prev) => ({ ...prev, [field]: false }));
  };
  const handleSubmit = () => {
    // 验证必填字段
    const newErrors: Record<string, boolean> = {};
    if (!formData.amount) newErrors.amount = true;
    if (!formData.category) newErrors.category = true;
    if (!formData.merchant) newErrors.merchant = true;
    if (!formData.date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 创建新交易记录（还没搞懂）
    const newTransaction: Transaction = {
      id: `T${Date.now()}`,
      amount: parseFloat(formData.amount),
      category: formData.category,
      subCategory: formData.subCategory,
      merchant: formData.merchant,
      date: formData.date,
      time: new Date().toLocaleTimeString(),
      tags: formData.tags ? [formData.tags] : [],
    };

    onAdd(newTransaction);
    setOpen(false);
    setFormData({
      amount: "",
      category: "",
      subCategory: "",
      merchant: "",
      date: "",
      tags: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter transaction information below and apply to update your
            records.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount *
            </Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onFocus={() => handleFocus("amount")}
              placeholder="e.g., 24.99"
              className={
                errors.amount ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category *
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              onFocus={() => handleFocus("category")}
              placeholder="e.g., Food"
              className={
                errors.category ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subCategory" className="text-right">
              SubCategory
            </Label>
            <Input
              id="subCategory"
              value={formData.subCategory}
              onChange={(e) => handleChange("subCategory", e.target.value)}
              placeholder="e.g., Lunch"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="merchant" className="text-right">
              Merchant *
            </Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={(e) => handleChange("merchant", e.target.value)}
              onFocus={() => handleFocus("merchant")}
              placeholder="e.g., Starbucks"
              className={
                errors.merchant ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date *
            </Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              onFocus={() => handleFocus("date")}
              placeholder="e.g., 20250105"
              className={
                errors.date ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="e.g., Monthly Pay"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
