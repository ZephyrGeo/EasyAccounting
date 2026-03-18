import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import UploadModal from '../transactions/UploadModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddBill?: () => void;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
  onRefresh?: () => void;
}

export default function DashboardLayout({
  children,
  title,
  description,
  onAddBill,
  activeRoute,
  onNavigate,
  onRefresh,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F3] font-sans text-[#1A1A1A] transition-colors duration-300">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        onUploadClick={() => setIsUploadModalOpen(true)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-[#F7F7F3]">
        <div className="max-w-7xl mx-auto relative z-10">
          <Header
            title={title}
            description={description}
            onAddBill={onAddBill}
            onMobileMenuToggle={handleMobileMenuToggle}
          />
          {children}
        </div>
      </main>

      {/* AI Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh();
          // 如果在首页，可能也需要刷新
          window.location.reload(); 
        }}
      />
    </div>
  );
}
