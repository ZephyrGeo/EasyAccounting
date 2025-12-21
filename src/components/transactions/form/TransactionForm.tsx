import { FormEvent } from 'react';
import { Save } from 'lucide-react';
import { TransactionFormData } from '@/hooks/useTransactionForm';
import TypeSelector from './TypeSelector';
import AmountInput from './AmountInput';
import DateInput from './DateInput';
import MerchantInput from './MerchantInput';
import CategorySelect from './CategorySelect';
import TagsInput from './TagsInput';
import { FORM_STYLES } from './formStyles';

interface TransactionFormProps {
  formData: TransactionFormData;
  onFormDataChange: (data: TransactionFormData) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  isEdit: boolean;
}

export default function TransactionForm({
  formData,
  onFormDataChange,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
  isLoading,
  isEdit,
}: TransactionFormProps) {
  const handleTypeChange = (type: 'expense' | 'income') => {
    // In edit mode, preserve the existing category when switching types
    // In create mode, set default category based on type
    const newCategory = isEdit
      ? formData.category
      : (type === 'income' ? 'Income' : 'Other');

    onFormDataChange({
      ...formData,
      type,
      category: newCategory,
    });
  };

  // Helper function to handle field changes
  const handleFieldChange = (field: keyof TransactionFormData) => (value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Type Selector */}
      <TypeSelector value={formData.type} onChange={handleTypeChange} disabled={isLoading} />

      {/* Amount & Date */}
      <div className="grid grid-cols-2 gap-4">
        <AmountInput
          value={formData.amount}
          onChange={handleFieldChange('amount')}
          disabled={isLoading}
        />
        <DateInput
          value={formData.date}
          onChange={handleFieldChange('date')}
          disabled={isLoading}
        />
      </div>

      {/* Merchant & Category */}
      <div className="grid grid-cols-2 gap-4">
        <MerchantInput
          value={formData.merchant}
          onChange={handleFieldChange('merchant')}
          disabled={isLoading}
        />
        <CategorySelect
          value={formData.category}
          onChange={handleFieldChange('category')}
          type={formData.type}
          disabled={isLoading}
        />
      </div>

      {/* Tags Input */}
      <TagsInput
        tags={formData.tags}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        disabled={isLoading}
      />

      {/* Submit Button */}
      <button type="submit" disabled={isLoading} className={FORM_STYLES.button}>
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEdit ? 'Update Transaction' : 'Save Transaction'}
          </>
        )}
      </button>
    </form>
  );
}
