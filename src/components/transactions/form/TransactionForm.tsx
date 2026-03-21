import { FormEvent } from "react";
import { Save } from "lucide-react";
import { parseISO } from "date-fns";
import { TransactionFormData } from "@/hooks/useTransactionForm";
import TypeSelector from "./TypeSelector";
import AmountInput from "./AmountInput";
import { DatePicker } from "@/components/ui/date-picker";
import MerchantInput from "./MerchantInput";
import CategorySelect from "./CategorySelect";
import TagsInput from "./TagsInput";
import { FORM_STYLES } from "./formStyles";
import { formatToLocalDate } from "@/utils/date";

interface TransactionFormProps {
  formData: TransactionFormData;
  onFormDataChange: (data: TransactionFormData) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  allAvailableTags: string[];
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelectSuggestion: (tag: string) => void;
  onDeleteGlobalTag: (tag: string) => void;
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
  allAvailableTags,
  onAddTag,
  onSelectSuggestion,
  onDeleteGlobalTag,
  onRemoveTag,
  onSubmit,
  isLoading,
  isEdit,
}: TransactionFormProps) {
  const handleTypeChange = (type: "expense" | "income") => {
    const newCategory = isEdit ? formData.category : type === "income" ? "Income" : "Others";
    onFormDataChange({
      ...formData,
      type,
      category: newCategory,
    });
  };

  const handleFieldChange = (field: keyof TransactionFormData) => (value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onFormDataChange({ ...formData, date: formatToLocalDate(date) });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Type Selector */}
      <TypeSelector value={formData.type} onChange={handleTypeChange} disabled={isLoading} />

      {/* Amount & Date */}
      <div className="grid grid-cols-2 gap-4">
        <AmountInput value={formData.amount} onChange={handleFieldChange("amount")} disabled={isLoading} />
        <div className="flex flex-col">
          <label className={FORM_STYLES.label}>Date</label>
          <DatePicker date={parseISO(formData.date)} setDate={handleDateChange} disabled={isLoading} />
        </div>
      </div>

      {/* Merchant & Category */}
      <div className="grid grid-cols-2 gap-4">
        <MerchantInput value={formData.merchant} onChange={handleFieldChange("merchant")} disabled={isLoading} />
        <CategorySelect
          value={formData.category}
          onChange={handleFieldChange("category")}
          type={formData.type}
          disabled={isLoading}
        />
      </div>

      {/* Tags Input */}
      <TagsInput
        tags={formData.tags}
        tagInput={tagInput}
        allAvailableTags={allAvailableTags}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onSelectSuggestion={onSelectSuggestion}
        onDeleteGlobalTag={onDeleteGlobalTag}
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
            {isEdit ? "Update Transaction" : "Save Transaction"}
          </>
        )}
      </button>
    </form>
  );
}
