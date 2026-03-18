import React from 'react';

interface TagPillProps {
  tag: string;
}

export default function TagPill({ tag }: TagPillProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#F0F0EA] text-[#6B6B6B] border border-[#E5E5E0]">
      {tag}
    </span>
  );
}
