import React from 'react';
import { Home, CreditCard, PieChart, Settings, LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active = false, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

interface SidebarProps {
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function Sidebar({ activeRoute = 'dashboard', onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 hidden md:flex">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="text-xl font-bold tracking-tight">EasyAccount</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem
            icon={Home}
            label="Dashboard"
            active={activeRoute === 'dashboard'}
            onClick={() => onNavigate?.('dashboard')}
          />
          <NavItem
            icon={CreditCard}
            label="Transactions"
            active={activeRoute === 'transactions'}
            onClick={() => onNavigate?.('transactions')}
          />
          <NavItem
            icon={PieChart}
            label="Analytics"
            active={activeRoute === 'analytics'}
            onClick={() => onNavigate?.('analytics')}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            active={activeRoute === 'settings'}
            onClick={() => onNavigate?.('settings')}
          />
        </nav>
      </div>

      {/* Pro Plan Card */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs font-semibold text-slate-500 mb-2">PRO PLAN</p>
        <p className="text-sm font-medium mb-3">Upgrade to unlock AI insights.</p>
        <button className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg hover:bg-slate-800 transition">
          View Plans
        </button>
      </div>
    </aside>
  );
}
