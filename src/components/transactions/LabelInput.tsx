import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface LabelInputProps {
  labels: string[];
  onChange: (labels: string[]) => void;
}

export default function LabelInput({ labels, onChange }: LabelInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addLabel = (label: string) => {
    const trimmedLabel = label.trim();
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      onChange([...labels, trimmedLabel]);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    onChange(labels.filter((label) => label !== labelToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addLabel(inputValue);
        setInputValue('');
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <div
          key={label}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
        >
          <span>{label}</span>
          <button
            type="button"
            onClick={() => removeLabel(label)}
            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <input
        type="text"
        placeholder="Add label..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 min-w-[100px] px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm"
      />
    </div>
  );
}
