import React from 'react';
import {
  Home,
  CreditCard,
  PanelLeft,
  X,
  LucideIcon,
} from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
  collapsed = false,
}: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center rounded-xl cursor-pointer transition-all duration-300 ${
        active
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
      } ${
        collapsed
          ? active
            ? "justify-center py-3 px-5"
            : "justify-center py-3 px-5"
          : "gap-3 px-4 py-3"
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span
        className={`font-medium text-sm truncate transition-all duration-300 ${
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

interface SidebarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  activeRoute = "dashboard",
  onNavigate,
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        data-collapsible={collapsed ? "icon" : "none"}
        className={`group/sidebar bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border-r border-slate-100 dark:border-slate-700/50 flex flex-col p-6 transition-all duration-300 ease-in-out dark:shadow-[2px_0_10px_rgba(0,0,0,0.3)] ${
          collapsed ? "w-20" : "w-64"
        } ${
          // Desktop: always visible
          // Mobile: fixed position, slide in from left
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 md:relative"
            : "fixed inset-y-0 -left-64 z-50 md:relative md:left-0"
        }`}
      >
      <div className="space-y-4">
        {/* Logo and Toggle Button */}
        <div
          className={`flex items-center transition-all duration-300 ${
            collapsed ? "justify-center px-5" : "justify-between px-4"
          }`}
        >
          <span
            className={`text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            snowflake
          </span>
          <div className="flex items-center gap-2">
            {/* Close button for mobile */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-400 md:hidden"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {/* Toggle button for desktop */}
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-400 shrink-0 hidden md:block"
                title="Toggle sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <NavItem
            icon={Home}
            label="Dashboard"
            active={activeRoute === "dashboard"}
            onClick={() => onNavigate?.("dashboard")}
            collapsed={collapsed}
          />
          <NavItem
            icon={CreditCard}
            label="Transactions"
            active={activeRoute === "transactions"}
            onClick={() => onNavigate?.("transactions")}
            collapsed={collapsed}
          />
        </nav>
      </div>
    </aside>
    </>
  );
}
