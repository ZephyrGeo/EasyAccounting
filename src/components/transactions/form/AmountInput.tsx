import { FORM_STYLES } from './formStyles';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function AmountInput({ value, onChange, disabled }: AmountInputProps) {
  return (
    <div>
      <label className={FORM_STYLES.label}>Amount</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
          ¥
        </span>
        <input
          type="number"
          step="0.01"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FORM_STYLES.input} pl-9`}
          placeholder="0.00"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
