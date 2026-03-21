import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionList from "@/components/transactions/TransactionList";
import DeleteConfirmModal from "@/components/transactions/DeleteConfirmModal";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import TagFilterBar from "@/components/transactions/TagFilterBar";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionsFilters } from "@/hooks/useTransactionsFilters";
import { deleteTransaction } from "@/api/transactions";
import { getActiveRoute } from "@/utils/routing";
import { Transaction } from "@/types/transaction";

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);

  // 1. 数据获取
  const { data: allTransactions, loading, refetch } = useTransactions();

  // 2. 逻辑中枢：通过自定义 Hook 处理所有过滤、分组与 URL 同步
  const {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedTags,
    setSelectedTags,
    filterMode,
    setFilterMode,
    availableTags,
    groupedTransactions, // 已经是按日期分组且过滤后的最终数据
    handleTagToggle,
  } = useTransactionsFilters(allTransactions || []);

  // 3. 删除逻辑 (局部 UI 状态)
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
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Transactions"
        description="Review and manage your complete financial history."
        activeRoute={activeRoute}
        onNavigate={(route) => navigate(route === "dashboard" ? "/" : `/${route}`)}
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
      onNavigate={(route) => navigate(route === "dashboard" ? "/" : `/${route}`)}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content Area (Now a pure renderer) */}
        <div className="w-full lg:flex-1 order-2 lg:order-1">
          <TransactionList
            groupedTransactions={groupedTransactions}
            onDelete={(id) => {
              const target = allTransactions?.find((t) => t.id === id);
              if (target) setDeleteTarget(target);
            }}
            onRefresh={refetch}
          />
        </div>

        {/* Sidebar Filter Panel (Controls all logic via Hook) */}
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
              {/* Keyword Search */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    Keywords
                  </label>
                  <Search className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-[#F0F0EA] dark:border-[#333333] rounded-xl text-[13.5px] outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all text-[#1A1A1A] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    Time Period
                  </label>
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                </div>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full" />
              </div>

              {/* Tag Selection */}
              <div className="pt-2">
                <TagFilterBar
                  allTags={availableTags}
                  selectedTags={selectedTags}
                  filterMode={filterMode}
                  onTagToggle={handleTagToggle}
                  onClearTags={() => setSelectedTags([])}
                  onModeToggle={() => setFilterMode((prev) => (prev === "AND" ? "OR" : "AND"))}
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
