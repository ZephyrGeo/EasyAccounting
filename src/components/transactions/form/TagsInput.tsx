import React, { useState } from 'react';
import { X, Trash2, Tag as TagIcon } from 'lucide-react';
import TagPill from '@/components/transactions/TagPill';
import { FORM_STYLES } from './formStyles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  tags: string[];
  tagInput: string;
  allAvailableTags: string[];
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelectSuggestion: (tag: string) => void;
  onDeleteGlobalTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  disabled?: boolean;
}

export default function TagsInput({
  tags,
  tagInput,
  allAvailableTags = [],
  onTagInputChange,
  onAddTag,
  onSelectSuggestion,
  onDeleteGlobalTag,
  onRemoveTag,
  disabled,
}: TagsInputProps) {
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  const unselectedTags = (allAvailableTags || []).filter(t => !tags.includes(t));
  const filteredSuggestions = tagInput.trim().length > 0
    ? unselectedTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()))
    : unselectedTags;

  return (
    <div className="space-y-4">
      {/* 1. Input & Applied Tags Area */}
      <div>
        <label className={FORM_STYLES.label}>Transaction Tags</label>
        <div
          className={cn(
            FORM_STYLES.input,
            "min-h-[46px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-blue-500/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {tags.map((tag) => (
            <TagPill key={tag} tag={tag} onRemove={() => onRemoveTag(tag)} />
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onAddTag}
            className="bg-transparent outline-none flex-1 min-w-[120px] text-[13.5px] placeholder:text-[#8E8E8E] text-[#1A1A1A] dark:text-white"
            placeholder={tags.length === 0 ? 'Type a new tag and press Enter...' : 'Add more...'}
            disabled={disabled}
          />
        </div>
      </div>

      {/* 2. Suggested / Available Tags Area */}
      {unselectedTags.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-300 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TagIcon className="w-3 h-3" />
            {tagInput.trim() ? 'Matching Suggestions' : 'Suggested Tags'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectSuggestion(tag)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span className="opacity-50 text-[10px]">#</span>
                  {tag}
                </button>
              ))
            ) : (
              <span className="text-[12px] text-slate-400 italic">Press Enter to create "{tagInput}"</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
