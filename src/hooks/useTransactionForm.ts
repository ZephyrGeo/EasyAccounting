import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import { toDateInputValue, toISOString, getTodayDateString, getCurrentTimeString } from "@/utils/date";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { getAllTags, deleteTag as apiDeleteTag } from "@/api/entities/tags";

export interface TransactionFormData {
  type: "expense" | "income";
  amount: string;
  category: string;
  merchant: string;
  date: string;
  time: string;
  tags: string[];
}

interface UseTransactionFormResult {
  formData: TransactionFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  allAvailableTags: string[];
  handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSelectSuggestion: (tag: string) => void;
  handleDeleteGlobalTag: (tag: string) => Promise<void>;
  removeTag: (tagToRemove: string) => void;
  prepareTransaction: (transactionId?: string) => Transaction;
}

// 卫语句映射表：处理历史数据兼容性与 AI 漂移
const CATEGORY_MAP: Record<string, string> = {
  Other: "Others",
  Transport: "Transportation",
  Medical: "Healthcare",
  Housing: "Housing",
  Entertainment: "Entertainment",
};

/**
 * Custom hook for managing transaction form state and logic
 */
export function useTransactionForm(transaction?: Transaction, isOpen?: boolean): UseTransactionFormResult {
  const [tagInput, setTagInput] = useState("");
  const [allAvailableTags, setAllAvailableTags] = useState<string[]>([]);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    category: "Others",
    merchant: "",
    date: getTodayDateString(),
    time: getCurrentTimeString(),
    tags: [],
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (transaction) {
      const isIncome = transaction.amount < 0;
      const type = isIncome ? "income" : "expense";

      let rawCategory = typeof transaction.category === "string" ? transaction.category : transaction.category.name;

      // 使用策略模式进行规格化
      const normalizedCategory = CATEGORY_MAP[rawCategory] || rawCategory;

      const allowedCategories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const isValid = (allowedCategories as readonly string[]).includes(normalizedCategory);
      const category = isValid ? normalizedCategory : isIncome ? "Income" : "Others";

      setFormData({
        type,
        amount: Math.abs(transaction.amount).toString(),
        category,
        merchant: typeof transaction.merchant === "string" ? transaction.merchant : transaction.merchant.name,
        date: toDateInputValue(transaction.date),
        time: getCurrentTimeString(),
        tags: transaction.tags || [],
      });
    } else {
      setFormData({
        type: "expense",
        amount: "",
        category: "Others",
        merchant: "",
        date: getTodayDateString(),
        time: getCurrentTimeString(),
        tags: [],
      });
    }
    setTagInput("");
  }, [isOpen, transaction]);

  // Load available tags for suggestions
  useEffect(() => {
    if (isOpen) {
      getAllTags().then(setAllAvailableTags);
    }
  }, [isOpen]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      if (!allAvailableTags.includes(trimmed)) {
        setAllAvailableTags((prev) => [...prev, trimmed].sort());
      }
    }
    setTagInput("");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSelectSuggestion = (tag: string) => {
    addTag(tag);
  };

  const handleDeleteGlobalTag = async (tag: string) => {
    try {
      await apiDeleteTag(tag);
      setAllAvailableTags((prev) => prev.filter((t) => t !== tag));
      removeTag(tag);
    } catch (error) {
      console.error("Delete global tag failed:", error);
    }
  };

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const prepareTransaction = (transactionId?: string): Transaction => {
    const amount = parseFloat(formData.amount) || 0;
    const signedAmount = formData.type === "income" ? -Math.abs(amount) : Math.abs(amount);

    // 自动合并输入框中还未按回车的文字
    const pendingTag = tagInput.trim();
    const finalTags = [...formData.tags];
    if (pendingTag && !finalTags.includes(pendingTag)) {
      finalTags.push(pendingTag);
    }

    return {
      id: transactionId || "",
      amount: signedAmount,
      category: { id: "temp", name: formData.category, color_code: "#64748B" },
      merchant: { id: "temp", name: formData.merchant, brand: null },
      date: toISOString(formData.date),
      tags: finalTags,
    };
  };

  return {
    formData,
    setFormData,
    tagInput,
    setTagInput,
    allAvailableTags,
    handleAddTag,
    handleSelectSuggestion,
    handleDeleteGlobalTag,
    removeTag,
    prepareTransaction,
  };
}
