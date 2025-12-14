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
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-800">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <Header
          title={title}
          description={description}
          onAddBill={onAddBill}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        {children}
      </main>
    </div>
  );
}
