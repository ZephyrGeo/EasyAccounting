import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { FORM_STYLES } from "./formStyles";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  type: "expense" | "income";
  disabled?: boolean;
}

export default function CategorySelect({ value, onChange, type, disabled }: CategorySelectProps) {
  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div>
      <label className={FORM_STYLES.label}>Category</label>
      <Select key={value} value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-[#F7F7F3] border-[#E5E5E0] focus:ring-0 focus:ring-offset-0 text-[13px] h-[46px] rounded-lg">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#E5E5E0]">
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="text-[13px] hover:bg-[#F0F0EA] transition-colors">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
