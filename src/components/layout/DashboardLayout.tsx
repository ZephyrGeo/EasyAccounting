import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddBill?: () => void;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function DashboardLayout({
  children,
  title,
  description,
  onAddBill,
  activeRoute,
  onNavigate,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Subtle glow effect in dark mode */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/5 pointer-events-none" />

        <div className="relative z-10">
          <Header
            title={title}
            description={description}
            onAddBill={onAddBill}
            onMobileMenuToggle={handleMobileMenuToggle}
          />
          {children}
        </div>
      </main>
    </div>
  );
}
