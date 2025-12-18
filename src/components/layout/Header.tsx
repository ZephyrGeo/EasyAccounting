import React from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

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
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition md:hidden -ml-2"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        )}
        <div>
          {title && <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>}
          {description && <p className={`text-slate-500 dark:text-slate-400 ${title ? "text-sm mt-1" : "text-base"}`}>{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Search Button */}
        <button className="group relative p-2 bg-white dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md dark:hover:shadow-blue-500/20 transition-all duration-300 dark:ring-1 dark:ring-white/5 hover:scale-105">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-blue-400 transition-colors" />
        </button>

        {/* Notification Bell */}
        <button className="group relative p-2 bg-white dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md dark:hover:shadow-red-500/20 transition-all duration-300 dark:ring-1 dark:ring-white/5 hover:scale-105">
          <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-red-400 transition-colors" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-slate-800 shadow-sm dark:shadow-red-500/50 animate-pulse"></span>
        </button>

        {/* Add Bill Button */}
        <Button variant="primary" icon={Plus} onClick={onAddBill}>
          Add Bill
        </Button>
      </div>
    </div>
  );
}
