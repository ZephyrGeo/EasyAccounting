import React, { useState } from 'react';
import { RefreshCw, Tag as TagIcon, FileText, CreditCard, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatting';
import TagPill from './TagPill';

interface TransactionItemProps {
  transaction: Transaction;
  bundle?: Transaction[];
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  // 获取 Logo URL (从品牌表中获取)
  const logoUrl = transaction.merchant.brand?.logo_url;
  const displayAmount = transaction.amount;

  // Main Row
  return (
    <div className="group border-b border-[#F0F0EA] last:border-0">
      <div 
        className="flex items-center justify-between py-4 px-6 hover:bg-[#F7F7F3] transition-colors cursor-pointer"
        onClick={() => onEdit?.(transaction)}
      >
        <div className="flex items-center gap-5 flex-1">
          {/* Logo Container - Simplified */}
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-white border border-[#E5E5E0] rounded-md overflow-hidden p-1 shadow-sm">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={transaction.merchant.brand?.name || transaction.merchant.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-sm opacity-60">❄️</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-medium text-[#1A1A1A] truncate">
                {transaction.merchant.name}
              </h4>
              {transaction.is_recurring && (
                <span title="Subscription">
                  <RefreshCw className="w-3 h-3 text-[#6B6B6B]" />
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              {/* Category indicator - more minimal */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: transaction.category.color_code }} />
                <span className="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider">
                  {transaction.category.name}
                </span>
              </div>

              {/* Payment method */}
              {transaction.payment_method && (
                <div className="flex items-center gap-1 text-[11px] text-[#8E8E8E] bg-[#F0F0EA] px-1.5 py-0.5 rounded border border-[#E5E5E0]">
                  <CreditCard className="w-2.5 h-2.5" />
                  {transaction.payment_method.name}
                </div>
              )}

              {/* Tags */}
              {transaction.tags?.map(tag => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>

            {/* Notes */}
            {transaction.notes && (
              <div className="flex items-center gap-1 mt-1.5 text-[12px] text-[#8E8E8E] italic line-clamp-1">
                <FileText className="w-3 h-3 flex-shrink-0" />
                {transaction.notes}
              </div>
            )}
          </div>
        </div>

        <div className="text-right ml-4 flex items-center gap-4">
          <div>
            <p className={`text-[15px] font-medium tabular-nums font-serif ${displayAmount < 0 ? 'text-[#059669]' : 'text-[#1A1A1A]'}`}>
              {displayAmount < 0 ? '+' : ''}{formatCurrency(Math.abs(displayAmount))}
            </p>
          </div>
          
          {/* Delete Action - Subtle */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(transaction.id);
              }}
              className="p-2 text-[#8E8E8E] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-all opacity-0 group-hover:opacity-100"
              title="Delete transaction"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
