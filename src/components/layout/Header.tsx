import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  description?: string;
  onAddBill?: () => void;
}

export default function Header({ title, description, onAddBill }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-slate-500 text-sm">{description}</p>}
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
    </header>
  );
}
