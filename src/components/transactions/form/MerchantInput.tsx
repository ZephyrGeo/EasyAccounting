import { FORM_STYLES } from './formStyles';

interface MerchantInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MerchantInput({ value, onChange, disabled }: MerchantInputProps) {
  return (
    <div>
      <label className={FORM_STYLES.label}>Merchant / Title</label>
      <input
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FORM_STYLES.input}
        placeholder="e.g. Starbucks, Salary..."
        disabled={disabled}
      />
    </div>
  );
}
