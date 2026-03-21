import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, isValid } from 'date-fns';
import { Loader2, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionList from '@/components/transactions/TransactionList';
import DeleteConfirmModal from '@/components/transactions/DeleteConfirmModal';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import TagFilterBar, { FilterMode } from '@/components/transactions/TagFilterBar';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransaction } from '@/api/transactions';
import { getActiveRoute } from '@/utils/routing';
import { Transaction } from '@/types/transaction';

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRoute = getActiveRoute(location.pathname);

  // Data fetching
  const { data: allTransactions, loading, refetch } = useTransactions();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('AND');

  // Date Range Initialization
  const initialRange = useMemo(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    
    if (fromParam && toParam) {
      const from = parseISO(fromParam);
      const to = parseISO(toParam);
      if (isValid(from) && isValid(to)) return { from, to };
    }

    if (allTransactions && allTransactions.length > 0) {
      const latestDate = parseISO(allTransactions[0].date);
      if (isValid(latestDate)) {
        return { from: startOfMonth(latestDate), to: endOfMonth(latestDate) };
      }
    }
    
    return { from: startOfMonth(new Date()), to: endOfMonth(new Date()) };
  }, [allTransactions, searchParams]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange);

  // Sync Date Range to URL
  useEffect(() => {
    if (dateRange?.from) {
      const params = new URLSearchParams(searchParams);
      params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
      if (dateRange.to) {
        params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
      } else {
        params.delete('to');
      }
      setSearchParams(params, { replace: true });
    }
  }, [dateRange, setSearchParams, searchParams]);

  // Derived Tags for Filter Bar
  const availableTagsInPeriod = useMemo(() => {
    if (!dateRange?.from || !allTransactions) return [];
    
    const tagsSet = new Set<string>();
    allTransactions.forEach(t => {
      const txDate = parseISO(t.date);
      const start = dateRange.from!;
      const end = dateRange.to || dateRange.from!;
      if (isWithinInterval(txDate, { start, end })) {
        t.tags?.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [allTransactions, dateRange]);

  // Combined Date Filter
  const dateFilteredTransactions = useMemo(() => {
    if (!dateRange?.from || !allTransactions) return allTransactions;
    return allTransactions.filter(t => {
      const txDate = parseISO(t.date);
      const start = dateRange.from!;
      const end = dateRange.to || dateRange.from!;
      return isWithinInterval(txDate, { start, end });
    });
  }, [allTransactions, dateRange]);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteTransaction(deleteTarget.id);
      await refetch();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Transactions"
        description="Review and manage your complete financial history."
        activeRoute={activeRoute}
        onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
      >
        <div className="flex items-center justify-center py-32 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Loading transactions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Transactions"
      description="Review and manage your complete financial history."
      activeRoute={activeRoute}
      onNavigate={(route) => navigate(route === 'dashboard' ? '/' : `/${route}`)}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: Transaction List (Main Content) */}
        <div className="w-full lg:flex-1 order-2 lg:order-1">
          <TransactionList
            transactions={dateFilteredTransactions}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            filterMode={filterMode}
            onDelete={(id) => {
              const target = allTransactions?.find(t => t.id === id);
              if (target) setDeleteTarget(target);
            }}
            onRefresh={refetch}
          />
        </div>

        {/* Right Column: Sidebar Filter Panel */}
        <aside className="w-full lg:w-[300px] flex-shrink-0 order-1 lg:order-2">
          <div className="bg-[#FBFBFA] dark:bg-[#1E1E1E]/50 rounded-[24px] border border-[#F0F0EA] dark:border-[#2A2A2A] p-6 shadow-sm sticky top-6">
            
            <div className="flex items-center gap-2 mb-8 border-b border-[#F0F0EA] dark:border-[#2A2A2A] pb-4">
              <div className="p-1.5 bg-white dark:bg-[#2A2A2A] rounded-lg border border-[#F0F0EA] dark:border-[#333333] shadow-sm">
                <Filter className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
              </div>
              <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                Refine Search
              </h3>
            </div>

            <div className="space-y-10">
              {/* Section 1: Keyword Search */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Keywords</label>
                  <Search className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-[#F0F0EA] dark:border-[#333333] rounded-xl text-[13.5px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all text-[#1A1A1A] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm"
                  />
                </div>
              </div>

              {/* Section 2: Date Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Time Period</label>
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="relative">
                  <DatePickerWithRange 
                    date={dateRange} 
                    setDate={setDateRange} 
                    className="w-full"
                  />
                </div>
              </div>

              {/* Section 3: Tags */}
              <div className="pt-2">
                <TagFilterBar 
                  allTags={availableTagsInPeriod}
                  selectedTags={selectedTags}
                  filterMode={filterMode}
                  onTagToggle={handleTagToggle}
                  onClearTags={() => setSelectedTags([])}
                  onModeToggle={() => setFilterMode(prev => prev === 'AND' ? 'OR' : 'AND')}
                  onTagsUpdated={refetch}
                />
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#F0F0EA] dark:border-[#2A2A2A]">
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600 uppercase tracking-widest text-center">
                SnowFlake Intelligent Filter
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          transaction={deleteTarget}
        />
      )}
    </DashboardLayout>
  );
}
