interface TypeSelectorProps {
  value: 'expense' | 'income';
  onChange: (type: 'expense' | 'income') => void;
  disabled?: boolean;
}

export default function TypeSelector({ value, onChange, disabled }: TypeSelectorProps) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
      {(['expense', 'income'] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          disabled={disabled}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
            value === type
              ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-600 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
