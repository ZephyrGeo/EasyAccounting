import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { toDateInputValue, toISOString, getTodayDateString, getCurrentTimeString } from '@/utils/date';

export interface TransactionFormData {
  type: 'expense' | 'income';
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
  handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tagToRemove: string) => void;
  prepareTransaction: (transactionId?: string) => Transaction;
}

/**
 * Custom hook for managing transaction form state and logic
 */
export function useTransactionForm(
  transaction?: Transaction,
  isOpen?: boolean
): UseTransactionFormResult {
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: '',
    category: 'Other',
    merchant: '',
    date: getTodayDateString(),
    time: getCurrentTimeString(),
    tags: [],
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && transaction) {
      // Determine type based on amount
      const isIncome = transaction.amount > 0;

      setFormData({
        type: isIncome ? 'income' : 'expense',
        amount: Math.abs(transaction.amount).toString(),
        category: typeof transaction.category === 'string' ? transaction.category : transaction.category.name,
        merchant: typeof transaction.merchant === 'string' ? transaction.merchant : transaction.merchant.name,
        date: toDateInputValue(transaction.date),
        time: getCurrentTimeString(),
        tags: transaction.tags || [],
      });
    } else if (isOpen && !transaction) {
      // Reset form for create mode
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Other',
        merchant: '',
        date: getTodayDateString(),
        time: getCurrentTimeString(),
        tags: [],
      });
    }
    setTagInput('');
  }, [isOpen, transaction]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const prepareTransaction = (transactionId?: string): Transaction => {
    // Determine signed amount
    const amount = parseFloat(formData.amount);
    const signedAmount = formData.type === 'income' ? Math.abs(amount) : -Math.abs(amount);

    return {
      id: transactionId || '',
      amount: signedAmount,
      category: {
        id: 'temp',
        name: formData.category,
        color_code: '#64748B'
      },
      merchant: {
        id: 'temp',
        name: formData.merchant,
        brand: null
      },
      date: toISOString(formData.date),
      tags: formData.tags.length > 0 ? formData.tags : [],
    };
  };

  return {
    formData,
    setFormData,
    tagInput,
    setTagInput,
    handleAddTag,
    removeTag,
    prepareTransaction,
  };
}
