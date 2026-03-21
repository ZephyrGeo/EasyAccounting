import React, { useState } from "react";
import { Tag as TagIcon, X, Layers, Filter, Settings2 } from "lucide-react";
import TagManagementModal from "./TagManagementModal";

export type FilterMode = "AND" | "OR";

interface TagFilterBarProps {
  allTags: string[];
  selectedTags: string[];
  filterMode: FilterMode;
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  onModeToggle: () => void;
  onTagsUpdated?: () => void;
}

export default function TagFilterBar({
  allTags,
  selectedTags,
  filterMode,
  onTagToggle,
  onClearTags,
  onModeToggle,
  onTagsUpdated,
}: TagFilterBarProps) {
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-medium text-[#6B6B6B]">Tags</label>
        </div>

        <div className="flex items-center gap-2">
          {selectedTags.length > 1 && (
            <button
              onClick={onModeToggle}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all border ${
                filterMode === "AND"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
              }`}
              title={filterMode === "AND" ? "Must include all selected tags" : "Can include any selected tag"}
            >
              {filterMode === "AND" ? <Filter className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
              {filterMode === "AND" ? "AND" : "OR"}
            </button>
          )}

          <button
            onClick={() => setIsManageOpen(true)}
            className="p-1 text-[#8E8E8E] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F0F0EA] dark:hover:bg-[#2A2A2A] rounded transition-all"
            title="Manage Tags"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium transition-all duration-200 border ${
                isSelected
                  ? "bg-blue-500 border-blue-500 text-white shadow-sm shadow-blue-200 dark:shadow-none"
                  : "bg-[#F7F7F3] dark:bg-[#2A2A2A] border-transparent text-[#6B6B6B] dark:text-[#8E8E8E] hover:border-[#E5E5E0] dark:hover:border-[#444444] hover:text-[#1A1A1A] dark:hover:text-white"
              }`}
            >
              <span className="opacity-60 mr-0.5 font-normal">#</span>
              {tag}
            </button>
          );
        })}

        {selectedTags.length > 0 && (
          <button
            onClick={onClearTags}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <TagManagementModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        allTags={allTags}
        onTagsUpdated={() => {
          if (onTagsUpdated) onTagsUpdated();
        }}
      />
    </div>
  );
}
