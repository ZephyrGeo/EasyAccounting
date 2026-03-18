import React from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  title?: string;
  description?: string;
  onAddBill?: () => void;
  onMobileMenuToggle?: () => void;
}

export default function Header({
  title,
  description,
  onAddBill,
  onMobileMenuToggle,
}: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div className="flex items-start gap-4">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-1.5 rounded hover:bg-[#F0F0EA] transition md:hidden -ml-1"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-[#4A4A4A]" />
          </button>
        )}
        <div>
          {title && (
            <h1 className="text-[28px] font-medium text-[#1A1A1A] font-serif tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {description && (
            <p
              className={`text-[#6B6B6B] font-normal ${title ? "text-[15px] mt-1.5" : "text-[16px]"}`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
