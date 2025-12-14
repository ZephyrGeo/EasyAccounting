import React from 'react';
import {
  Home,
  CreditCard,
  PieChart,
  Settings,
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
          ? "bg-blue-50 text-blue-600"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        data-collapsible={collapsed ? "icon" : "none"}
        className={`group/sidebar bg-white border-r border-slate-100 flex flex-col p-6 transition-all duration-300 ease-in-out ${
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
            className={`text-xl font-bold tracking-tight transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            EasyAccount
          </span>
          <div className="flex items-center gap-2">
            {/* Close button for mobile */}
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 md:hidden"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {/* Toggle button for desktop */}
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 shrink-0 hidden md:block"
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
          <NavItem
            icon={PieChart}
            label="Analytics"
            active={activeRoute === "analytics"}
            onClick={() => onNavigate?.("analytics")}
            collapsed={collapsed}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            active={activeRoute === "settings"}
            onClick={() => onNavigate?.("settings")}
            collapsed={collapsed}
          />
        </nav>
      </div>
    </aside>
    </>
  );
}
