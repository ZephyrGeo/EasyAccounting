import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/categories';
import { FORM_STYLES } from './formStyles';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'expense' | 'income';
  disabled?: boolean;
}

export default function CategorySelect({ value, onChange, type, disabled }: CategorySelectProps) {
  const categoryOptions = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div>
      <label className={FORM_STYLES.label}>Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FORM_STYLES.input}
        disabled={disabled}
      >
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
