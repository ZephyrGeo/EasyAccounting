import { FORM_STYLES } from './formStyles';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DateInput({ value, onChange, disabled }: DateInputProps) {
  return (
    <div>
      <label className={FORM_STYLES.label}>Date</label>
      <input
        type="date"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FORM_STYLES.input}
        disabled={disabled}
      />
    </div>
  );
}
