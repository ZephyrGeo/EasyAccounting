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
import { NativeDatePicker } from "@/components/ui/native-date-picker";

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
  selectedYear?: string | null;
  selectedMonth?: string | null;
}

export default function TransactionForm({
  onAdd,
  onEdit,
  transaction,
  mode = "add",
  open,
  setOpen,
  trigger,
  selectedYear,
  selectedMonth,
}: TransactionFormProps) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    subCategory: "",
    merchant: "",
    date: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Initialize form data in edit mode
  useEffect(() => {
    if (isEditMode && transaction) {
      // Convert date format from YYYY-MM-DD to Date object
      const dateParts = transaction.date.split("-");
      let dateObj: Date | undefined = undefined;
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // JavaScript months start from 0
        const day = parseInt(dateParts[2]);
        dateObj = new Date(year, month, day);
      }

      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        subCategory: transaction.subCategory || "",
        merchant: transaction.merchant,
        date: transaction.date,
      });
      setSelectedDate(dateObj);
    } else {
      // Reset form in add mode
      resetForm();
    }
  }, [transaction, isEditMode, open]);

  const resetForm = () => {
    // In add mode, if year and month are selected, use them as default date
    let defaultDateObj: Date | undefined = undefined;
    if (mode === "add" && selectedYear && selectedMonth) {
      // Construct default date: first day of the month
      const year = parseInt(`20${selectedYear}`);
      const month = parseInt(selectedMonth) - 1; // JavaScript months start from 0
      defaultDateObj = new Date(year, month, 1);
    }

    setFormData({
      amount: "",
      category: "",
      subCategory: "",
      merchant: "",
      date: "",
    });
    setSelectedDate(defaultDateObj);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleFocus = (field: string) => {
    // Clear error state for the field when input gets focus
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateDate = (date: Date | undefined) => {
    // Validate if date is valid
    return date instanceof Date && !isNaN(date.getTime());
  };

  const validateAmount = (amountStr: string) => {
    // Validate if amount is a valid number
    return !isNaN(parseFloat(amountStr)) && parseFloat(amountStr) > 0;
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: Record<string, boolean> = {};

    // Validate amount
    if (!formData.amount || !validateAmount(formData.amount)) {
      newErrors.amount = true;
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = true;
    }

    // Validate merchant
    if (!formData.merchant) {
      newErrors.merchant = true;
    }

    // Validate date
    if (!validateDate(selectedDate)) {
      newErrors.date = true;
    }

    // If there are errors, update error state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format date as YYYY-MM-DD format to match database
    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`
      : "";

    // Create transaction record object
    const transactionData: Transaction = {
      id: isEditMode && transaction ? transaction.id : `T${Date.now()}`,
      amount: parseFloat(formData.amount),
      category: formData.category,
      subCategory: formData.subCategory || "",
      merchant: formData.merchant,
      date: formattedDate, // Use YYYY-MM-DD format
      time:
        isEditMode && transaction
          ? transaction.time
          : new Date().toLocaleTimeString(),
    };

    // Call appropriate callback function based on mode
    if (isEditMode && onEdit && transaction) {
      console.log("Edit mode: submit data", transaction.id, transactionData);
      onEdit(transaction.id, transactionData);
    } else if (onAdd) {
      console.log("Add mode: submit data", transactionData);
      onAdd(transactionData);
    }

    // Close dialog and reset form
    setOpen(false);
    resetForm();
  };

  const dialogTitle = isEditMode ? "Edit Transaction" : "Add Transaction";
  const dialogDescription = isEditMode
    ? "Please modify the transaction information below and submit to update the record. Fields marked with * are required."
    : "Please enter the transaction information below and submit to update your record. Fields marked with * are required.";
  const submitButtonText = isEditMode ? "Save" : "Apply";

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
            <Label htmlFor="date" className="text-right">
              Date *
            </Label>
            <div className="col-span-3">
              <NativeDatePicker
                date={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  setErrors((prev) => ({ ...prev, date: false }));
                }}
                placeholder="Select Date"
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a valid date
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount *
            </Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onFocus={() => handleFocus("amount")}
              placeholder="e.g. 24.99"
              className={
                errors.amount ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.amount && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Please enter a valid amount
              </p>
            )}
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
              placeholder="e.g. Food"
              className={
                errors.category ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.category && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Category is required
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subCategory" className="text-right">
              Subcategory
            </Label>
            <Input
              id="subCategory"
              value={formData.subCategory}
              onChange={(e) => handleChange("subCategory", e.target.value)}
              placeholder="e.g. Lunch"
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
              placeholder="e.g. Starbucks"
              className={
                errors.merchant ? "col-span-3 border-red-500" : "col-span-3"
              }
            />
            {errors.merchant && (
              <p className="col-span-3 col-start-2 text-xs text-red-500">
                Merchant is required
              </p>
            )}
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

// For backward compatibility, provide an add transaction component
export function AddTransaction({
  onAdd,
  selectedYear,
  selectedMonth,
}: {
  onAdd: (transaction: Transaction) => void;
  selectedYear?: string | null;
  selectedMonth?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <TransactionForm
      mode="add"
      onAdd={onAdd}
      open={open}
      setOpen={setOpen}
      trigger={<Button className="ml-auto">Add Transaction</Button>}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
    />
  );
}
