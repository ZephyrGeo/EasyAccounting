import React from 'react';
import { Tag as TagIcon, X, Layers, Filter } from 'lucide-react';

export type FilterMode = 'AND' | 'OR';

interface TagFilterBarProps {
  allTags: string[];
  selectedTags: string[];
  filterMode: FilterMode;
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  onModeToggle: () => void;
}

export default function TagFilterBar({
  allTags,
  selectedTags,
  filterMode,
  onTagToggle,
  onClearTags,
  onModeToggle,
}: TagFilterBarProps) {
  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 text-sm font-medium">
          <TagIcon className="w-3.5 h-3.5" />
          <span>Filter by Tags</span>
        </div>

        {selectedTags.length > 1 && (
          <button
            onClick={onModeToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filterMode === 'AND'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
            }`}
          >
            {filterMode === 'AND' ? (
              <Filter className="w-3 h-3" />
            ) : (
              <Layers className="w-3 h-3" />
            )}
            {filterMode === 'AND' ? 'MATCH ALL (AND)' : 'MATCH ANY (OR)'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm ${
                isSelected
                  ? 'bg-blue-500 border-blue-500 text-white shadow-blue-200 dark:shadow-blue-900/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500'
              }`}
            >
              #{tag}
            </button>
          );
        })}

        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
