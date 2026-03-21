import React from "react";
import { Plus, Home, CreditCard, LogOut, LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          ? "bg-[#1A1A1A] text-white hover:bg-[#333333] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#E5E5E0] rounded-full w-9 h-9 mx-auto shadow-sm" 
          : "text-[#6B6B6B] hover:bg-[#F0F0EA] dark:hover:bg-[#2A2A2A] hover:text-[#1A1A1A] dark:text-[#8E8E8E] dark:hover:text-white rounded-lg h-9 mx-1.5"
      }`}
      title={label}
    >
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        <Icon
          className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
            isPrimary ? "text-current" : "text-[#8E8E8E] group-hover:text-[#1A1A1A] dark:group-hover:text-white"
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
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/5 dark:bg-black/40 z-40 md:hidden backdrop-blur-[2px]"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar - Fixed to mini width */}
      <aside
        className={`group/sidebar bg-[#F7F7F3] dark:bg-[#1A1A1A] border-r border-[#E5E5E0] dark:border-[#333333] flex flex-col pt-3 pb-3 z-50 transition-all duration-300 w-[var(--sb-mini)] min-w-[var(--sb-mini)] ${
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
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 flex flex-col justify-between">
          <div>
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

          <div className="mt-auto pb-4 border-t border-[#E5E5E0] dark:border-[#333333] mx-1.5 pt-4 flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:ring-0 group/avatar">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border border-[#E5E5E0] dark:border-[#444444] group-hover/avatar:border-blue-400 transition-colors shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#F0F0EA] dark:bg-[#2A2A2A] flex items-center justify-center text-[10px] text-[#8E8E8E] border border-[#E5E5E0] dark:border-[#444444] group-hover/avatar:border-blue-400 transition-colors">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                align="start" 
                sideOffset={12}
                alignOffset={-4}
                className="w-48 bg-white dark:bg-[#1A1A1A] border-[#E5E5E0] dark:border-[#333333] shadow-xl animate-in slide-in-from-bottom-2 duration-200 p-1"
              >
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-[12px] font-semibold text-[#1A1A1A] dark:text-white">Account</p>
                    <p className="text-[11px] text-[#8E8E8E] truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#F0F0EA] dark:bg-[#2A2A2A] mx-1" />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="px-2 py-2 text-[12px] text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer gap-2 transition-colors rounded-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}
