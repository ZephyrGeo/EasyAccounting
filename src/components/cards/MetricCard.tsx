import React from 'react';
import { CreditCard, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatting';
import { Transaction } from '@/types/transaction';

interface MetricCardProps {
  transactions: Transaction[];
}

export default function MetricCard({ transactions }: MetricCardProps) {
  // 计算总支出
  const totalExpense = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance */}
      <div className="bg-white p-6 rounded-lg border border-[#E5E5E0]">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-[#F7F7F3] rounded-md border border-[#E5E5E0]">
            <Wallet className="w-4.5 h-4.5 text-[#1A1A1A]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-[#6B6B6B] uppercase">OVERALL</span>
        </div>
        <p className="text-[#6B6B6B] text-[13px] mb-1">Total Assets</p>
        <h3 className="text-3xl font-medium text-[#1A1A1A] font-serif tabular-nums">¥1,245,000</h3>
        <p className="text-[12px] text-[#059669] mt-4 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +2.4% from last period
        </p>
      </div>

      {/* Monthly Expense */}
      <div className="bg-white p-6 rounded-lg border border-[#E5E5E0]">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-[#F7F7F3] rounded-md border border-[#E5E5E0]">
            <CreditCard className="w-4.5 h-4.5 text-[#1A1A1A]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-[#6B6B6B] uppercase">EXPENSES</span>
        </div>
        <p className="text-[#6B6B6B] text-[13px] mb-1">Total Expense</p>
        <h3 className="text-3xl font-medium text-[#1A1A1A] font-serif tabular-nums">
          {formatCurrency(totalExpense)}
        </h3>
        <p className="text-[12px] text-[#6B6B6B] mt-4">
          Calculated from all records
        </p>
      </div>

      {/* Budget Card */}
      <div className="bg-white p-6 rounded-lg border border-[#E5E5E0]">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-[#F7F7F3] rounded-md border border-[#E5E5E0]">
            <DollarSign className="w-4.5 h-4.5 text-[#1A1A1A]" />
          </div>
          <span className="text-[11px] font-bold tracking-wider text-[#6B6B6B] uppercase">SAVINGS</span>
        </div>
        <p className="text-[#6B6B6B] text-[13px] mb-1">Total Savings</p>
        <h3 className="text-3xl font-medium text-[#1A1A1A] font-serif tabular-nums">¥258,400</h3>
        <div className="w-full bg-[#F0F0EA] h-1.5 rounded-full mt-5 overflow-hidden">
          <div className="bg-[#1A1A1A] h-full w-[65%]" />
        </div>
      </div>
    </div>
  );
}
