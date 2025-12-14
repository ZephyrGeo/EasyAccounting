import React from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title?: string;
  description?: string;
  onAddBill?: () => void;
  onMobileMenuToggle?: () => void;
}

export default function Header({ title, description, onAddBill, onMobileMenuToggle }: HeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-full hover:bg-slate-100 transition md:hidden -ml-2"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        )}
        <div>
          {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
          {description && <p className={`text-slate-500 ${title ? "text-sm mt-1" : "text-base"}`}>{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Button */}
        <button className="p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition">
          <Search className="w-5 h-5 text-slate-400" />
        </button>

        {/* Notification Bell */}
        <button className="p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition relative">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Add Bill Button */}
        <Button variant="primary" icon={Plus} onClick={onAddBill}>
          Add Bill
        </Button>
      </div>
    </div>
  );
}
