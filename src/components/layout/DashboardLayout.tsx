import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
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
  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-800">
      <Sidebar activeRoute={activeRoute} onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto p-8">
        <Header title={title} description={description} onAddBill={onAddBill} />
        {children}
      </main>
    </div>
  );
}
