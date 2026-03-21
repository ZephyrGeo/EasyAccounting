import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Search, Filter, Tag as TagIcon, RotateCcw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionList from "@/components/transactions/TransactionList";
import DeleteConfirmModal from "@/components/transactions/DeleteConfirmModal";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import TagFilterBar from "@/components/transactions/TagFilterBar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionsFilters } from "@/hooks/useTransactionsFilters";
import { deleteTransaction } from "@/api/transactions";
import { getActiveRoute } from "@/utils/routing";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/formatters";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);

  // 1. 数据获取
  const { data: allTransactions, loading, refetch } = useTransactions();

  // 2. 逻辑中枢
  const {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedTags,
    setSelectedTags,
    filterMode,
    setFilterMode,
    selectedCategories,
    setSelectedCategories,
    availableTags,
    groupedTransactions,
    handleTagToggle,
    handleCategoryToggle,
  } = useTransactionsFilters(allTransactions || []);

  // 3. 汇总计算
  const totalAmount = useMemo(() => {
    return groupedTransactions.reduce((total, group) => {
      return total + group.items.reduce((groupSum, item) => groupSum + item.amount, 0);
    }, 0);
  }, [groupedTransactions]);

  const transactionCount = useMemo(() => {
    return groupedTransactions.reduce((total, group) => total + group.items.length, 0);
  }, [groupedTransactions]);

  // 4. 删除逻辑
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
        {/* Main Content Area */}
        <div className="w-full lg:flex-1 order-2 lg:order-1">
          <TransactionList
            groupedTransactions={groupedTransactions}
            onDelete={(id) => {
              const target = allTransactions?.find((t) => t.id === id);
              if (target) setDeleteTarget(target);
            }}
            onRefresh={refetch}
            className="shadow-none border-[#F0F0EA]"
          />
        </div>

        {/* Right Column: Sidebar Filter Panel */}
        <aside className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2 space-y-4">
          {/* 1. 总金额卡片 */}
          <Card className="relative overflow-hidden border-none bg-white dark:bg-[#1A1A1A] shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/40 dark:from-amber-900/10 to-transparent rounded-bl-full" />
            <CardContent className="pt-6">
              <div className="relative">
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Current View Total</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 font-serif">
                  {totalAmount < 0 ? "+" : ""}
                  {formatCurrency(Math.abs(totalAmount))}
                </p>
                <p className="text-[13px] font-medium text-amber-600 dark:text-amber-500 mt-1">
                  From {transactionCount} transactions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Period Card (Moved up, removed icons) */}
          <Card className="border-[#F0F0EA] dark:border-[#2A2A2A] shadow-none bg-white dark:bg-[#1A1A1A]">
            <CardContent className="pt-6 space-y-3">
              <div className="px-1">
                <span className="text-[13px] font-medium text-slate-900 dark:text-white">
                  Period
                </span>
              </div>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full" />
            </CardContent>
          </Card>

          {/* 3. Search & Categories Card */}
          <Card className="border-[#F0F0EA] dark:border-[#2A2A2A] shadow-none bg-white dark:bg-[#1A1A1A]">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-50 dark:border-slate-800/50">
                <Filter className="w-4 h-4" />
                <span className="text-[13px] font-medium">Refine Search</span>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-amber-600 dark:text-amber-500 flex items-center gap-2 ml-1">
                  <Search className="w-3.5 h-3.5" />
                  Search
                </label>
                <Input
                  placeholder="Anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50/50 dark:bg-[#2A2A2A]/30 border-[#F0F0EA] dark:border-[#333333] rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-amber-600 dark:text-amber-500">
                    Categories
                  </span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-[11px] font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-1">
                      Expenses
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {EXPENSE_CATEGORIES.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <span
                            className={`text-[13px] transition-colors ${selectedCategories.includes(category) ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}
                          >
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 ml-1">
                      Income
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {INCOME_CATEGORIES.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer group"
                        >
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <span
                            className={`text-[13px] transition-colors ${selectedCategories.includes(category) ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}
                          >
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Tags Card */}
          <Card className="border-[#F0F0EA] dark:border-[#2A2A2A] shadow-none bg-white dark:bg-[#1A1A1A]">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] font-medium text-slate-900 dark:text-white">
                  Tags
                </span>
                <TagIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="pt-1">
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
            </CardContent>
          </Card>

          <div className="text-center py-4">
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600 tracking-widest uppercase">
              Snowflake Intelligent Filter
            </p>
          </div>
        </aside>
      </div>

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
