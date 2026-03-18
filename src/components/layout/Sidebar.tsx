import React from "react";
import { Plus, Home, CreditCard, LucideIcon } from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string; // Keep for title/accessibility
  onClick?: () => void;
  isPrimary?: boolean;
}

function NavItem({
  icon: Icon,
  label,
  onClick,
  isPrimary = false,
}: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center cursor-pointer group relative transition-all duration-200 ${
        isPrimary 
          ? "bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full w-9 h-9 mx-auto" 
          : "text-[#6B6B6B] hover:bg-[#F0F0EA] hover:text-[#1A1A1A] rounded-lg h-9 mx-1.5"
      }`}
      title={label}
    >
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        <Icon
          className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
            isPrimary ? "text-white" : "text-[#8E8E8E] group-hover:text-[#1A1A1A]"
          }`}
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onUploadClick?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  activeRoute = "dashboard",
  onNavigate,
  onUploadClick,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/5 z-40 md:hidden backdrop-blur-[2px]"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar - Fixed to mini width */}
      <aside
        className={`group/sidebar bg-[#F7F7F3] border-r border-[#E5E5E0] flex flex-col pt-3 pb-3 z-50 transition-all duration-[var(--duration)] ease-[var(--ease)] w-[var(--sb-mini)] min-w-[var(--sb-mini)] ${
          mobileOpen
            ? "fixed inset-y-0 left-0 md:relative"
            : "fixed inset-y-0 -left-64 md:relative md:left-0"
        }`}
      >
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-6 px-1.5">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
          {/* Add Icon - Now at the top of the list */}
          <NavItem
            icon={Plus}
            label="Add Bill"
            onClick={onUploadClick}
            isPrimary={true}
          />
          
          <div className="pt-2 space-y-1.5">
            <NavItem
              icon={Home}
              label="Dashboard"
              onClick={() => onNavigate?.("dashboard")}
            />
            <NavItem
              icon={CreditCard}
              label="Transactions"
              onClick={() => onNavigate?.("transactions")}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
