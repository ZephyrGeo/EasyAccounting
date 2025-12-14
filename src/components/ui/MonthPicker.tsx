import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_LABELS, ALL_MONTHS } from '@/constants/date';

interface MonthPickerProps {
  value: string; // 格式: "2024-11"
  onChange: (value: string) => void;
  availableMonths: string[]; // 可用的月份列表，格式: ["2024-11", "2024-12"]
  className?: string;
}

export default function MonthPicker({ value, onChange, availableMonths, className = '' }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 解析当前日期
  const [currentYear, currentMonth] = value.split('-');

  // 从可用月份中提取年份和月份映射
  const yearMonthMap: Record<string, string[]> = {};
  availableMonths.forEach(yearMonth => {
    const [year, month] = yearMonth.split('-');
    if (!yearMonthMap[year]) {
      yearMonthMap[year] = [];
    }
    yearMonthMap[year].push(month);
  });

  const availableYears = Object.keys(yearMonthMap).sort().reverse(); // 年份倒序
  const availableMonthsForYear = yearMonthMap[currentYear] || [];

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMonthSelect = (month: string) => {
    const newDate = `${currentYear}-${month}`;
    // 只允许选择可用的月份
    if (availableMonths.includes(newDate)) {
      onChange(newDate);
      setIsOpen(false);
    }
  };

  const changeYear = (delta: number) => {
    const currentYearIndex = availableYears.indexOf(currentYear);
    const newIndex = currentYearIndex + delta; // 因为是倒序，所以 +delta

    if (newIndex >= 0 && newIndex < availableYears.length) {
      const newYear = availableYears[newIndex];
      // 选择该年份的第一个可用月份
      const firstMonth = yearMonthMap[newYear]?.[0] || '01';
      onChange(`${newYear}-${firstMonth}`);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all duration-300 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 ${isOpen ? 'ring-2 ring-blue-500/50 border-transparent' : ''}`}
      >
        <Calendar className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-sm tabular-nums">
          {MONTH_LABELS[currentMonth]} {currentYear}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 p-4 rounded-2xl border shadow-2xl bg-white border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Year Navigator */}
          <div className="flex justify-between items-center mb-4 px-1">
            <button
              onClick={() => changeYear(1)}
              className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={availableYears.indexOf(currentYear) === availableYears.length - 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">{currentYear}</span>
            <button
              onClick={() => changeYear(-1)}
              className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={availableYears.indexOf(currentYear) === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {ALL_MONTHS.map((m) => {
              const isAvailable = availableMonthsForYear.includes(m.num);
              const isSelected = currentMonth === m.num;

              return (
                <button
                  key={m.num}
                  onClick={() => handleMonthSelect(m.num)}
                  disabled={!isAvailable}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : isAvailable
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
