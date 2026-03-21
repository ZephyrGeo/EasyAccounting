import React from 'react';
import { X } from 'lucide-react';

interface TagPillProps {
  tag: string;
  onRemove?: () => void;
}

export default function TagPill({ tag, onRemove }: TagPillProps) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#F0F0EA] text-[#6B6B6B] border border-[#E5E5E0]">
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-[#EF4444] transition-colors"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}
