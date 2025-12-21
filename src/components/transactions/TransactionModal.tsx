import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import TransactionForm from './form/TransactionForm';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
  onSave: (transaction: Transaction) => Promise<void>;
}

export default function TransactionModal({
  isOpen,
  onClose,
  transaction,
  onSave,
}: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Use custom hook for form logic
  const {
    formData,
    setFormData,
    tagInput,
    setTagInput,
    handleAddTag,
    removeTag,
    prepareTransaction,
  } = useTransactionForm(transaction, isOpen);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const updatedTransaction = prepareTransaction(transaction?.id);
      await onSave(updatedTransaction);
      onClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md p-6 rounded-3xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <TransactionForm
          formData={formData}
          onFormDataChange={setFormData}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={removeTag}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={!!transaction}
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
