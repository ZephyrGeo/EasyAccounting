import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, isValid } from "date-fns";
import { Transaction } from "@/types/transaction";
import { FilterMode } from "@/components/transactions/TagFilterBar";
import { filterTransactions, groupTransactionsByDate, TransactionGroup } from "@/utils/transactions";

/**
 * 逻辑枢纽：统一管理过滤状态、URL 同步、以及最终的渲染数据加工
 */
export function useTransactionsFilters(allTransactions: Transaction[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. 基础过滤状态
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("AND");

  // 2. 日期范围初始化逻辑 (卫语句)
  const dateRange = useMemo(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (fromParam && toParam) {
      const from = parseISO(fromParam);
      const to = parseISO(toParam);
      if (isValid(from) && isValid(to)) return { from, to };
    }

    // 默认回退：最新账单月份或当月
    if (allTransactions?.length > 0) {
      const latestDate = parseISO(allTransactions[0].date);
      if (isValid(latestDate)) return { from: startOfMonth(latestDate), to: endOfMonth(latestDate) };
    }

    return { from: startOfMonth(new Date()), to: endOfMonth(new Date()) };
  }, [allTransactions, searchParams]);

  // 注意：我们通过 useEffect 来同步 URL，但不直接将 setDateRange 暴露为状态，
  // 而是通过 props 改变 URL 从而触发重新计算，或者保持本地状态同步。
  // 为了简单，我们保留一个本地 set 函数供 UI 使用。
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(dateRange);

  useEffect(() => {
    if (!localDateRange?.from) return;
    const params = new URLSearchParams(searchParams);
    params.set("from", format(localDateRange.from, "yyyy-MM-dd"));
    if (localDateRange.to) {
      params.set("to", format(localDateRange.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }
    setSearchParams(params, { replace: true });
  }, [localDateRange]);

  // 3. 数据加工流水线 (Pipeline)

  // Step 1: 时间范围硬过滤
  const timeFiltered = useMemo(() => {
    if (!localDateRange?.from || !allTransactions) return allTransactions || [];
    return allTransactions.filter((t) => {
      const txDate = parseISO(t.date);
      const start = localDateRange.from!;
      const end = localDateRange.to || localDateRange.from!;
      return isWithinInterval(txDate, { start, end });
    });
  }, [allTransactions, localDateRange]);

  // Step 2: 提取当前范围内的可用标签 (用于 FilterBar 展示)
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    timeFiltered.forEach((t) => t.tags?.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [timeFiltered]);

  // Step 3: 应用关键词和标签过滤
  const fullyFiltered = useMemo(
    () => filterTransactions(timeFiltered, searchQuery, selectedTags, filterMode),
    [timeFiltered, searchQuery, selectedTags, filterMode],
  );

  // Step 4: 最终分组
  const groupedTransactions: TransactionGroup[] = useMemo(
    () => groupTransactionsByDate(fullyFiltered),
    [fullyFiltered],
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return {
    // 状态
    searchQuery,
    setSearchQuery,
    dateRange: localDateRange,
    setDateRange: setLocalDateRange,
    selectedTags,
    setSelectedTags,
    filterMode,
    setFilterMode,

    // 加工后的数据
    availableTags,
    groupedTransactions,

    // 处理器
    handleTagToggle,
  };
}
