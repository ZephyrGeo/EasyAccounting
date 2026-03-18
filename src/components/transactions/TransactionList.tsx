import React, { useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import TransactionItem from './TransactionItem';
import TagFilterBar, { FilterMode } from './TagFilterBar';

interface TransactionListProps {
  transactions: Transaction[];
  className?: string;
  onSeeAll?: () => void;
  onDelete?: (id: string) => void;
}

export default function TransactionList({
  transactions,
  className = "",
  onDelete,
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('AND');

  // 1. 获取所有可用标签
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    if (!transactions) return [];
    transactions.forEach(t => t.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [transactions]);

  // 2. 基础过滤逻辑
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const merchantName = t.merchant?.name || '';
      const categoryName = t.category?.name || '';

      const matchesSearch = 
        merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        (filterMode === 'AND' 
          ? selectedTags.every(tag => t.tags?.includes(tag))
          : selectedTags.some(tag => t.tags?.includes(tag)));

      return matchesSearch && matchesTags;
    });
  }, [transactions, searchQuery, selectedTags, filterMode]);

  // 3. 按日期分组
  const groupedTransactions = useMemo(() => {
    const groups: { date: string; items: Transaction[] }[] = [];
    const dateGroups: Record<string, Transaction[]> = {};
    
    filteredTransactions.forEach(t => {
      if (!dateGroups[t.date]) dateGroups[t.date] = [];
      dateGroups[t.date].push(t);
    });

    Object.keys(dateGroups).sort((a, b) => b.localeCompare(a)).forEach(date => {
      groups.push({
        date,
        items: dateGroups[date]
      });
    });

    return groups;
  }, [filteredTransactions]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-[#E5E5E0] overflow-hidden flex flex-col min-h-[600px] ${className}`}>
      {/* Header & Controls */}
      <div className="p-6 border-b border-[#F0F0EA]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-medium text-[#1A1A1A]">Transactions</h3>
            <p className="text-[13px] text-[#6B6B6B] mt-1">Manage your spending records</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E] group-focus-within:text-[#1A1A1A] transition-colors" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#F7F7F3] border border-[#E5E5E0] rounded-md text-[13px] focus:outline-none focus:border-[#6B6B6B] transition-all w-full md:w-64 text-[#1A1A1A] placeholder:text-[#8E8E8E]"
              />
            </div>
          </div>
        </div>

        {/* Tag Cloud Filter */}
        <TagFilterBar 
          allTags={allTags}
          selectedTags={selectedTags}
          filterMode={filterMode}
          onTagToggle={handleTagToggle}
          onClearTags={() => setSelectedTags([])}
          onModeToggle={() => setFilterMode(prev => prev === 'AND' ? 'OR' : 'AND')}
        />
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#8E8E8E]">
            <Calendar className="w-10 h-10 mb-4 opacity-30" />
            <p className="text-[14px]">No transactions found</p>
          </div>
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.date}>
              <div className="sticky top-0 z-10 bg-[#F7F7F3]/95 backdrop-blur-sm px-6 py-2 border-y border-[#E5E5E0]">
                <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                  {group.date}
                </span>
              </div>
              
              <div className="divide-y divide-[#F0F0EA]">
                {group.items.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
