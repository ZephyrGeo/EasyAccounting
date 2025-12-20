import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAvailableMonths } from './useAvailableMonths';

interface UseSelectedMonthOptions {
  /**
   * 是否使用 URL 参数持久化选中的月份
   * @default true
   */
  persistInUrl?: boolean;
}

interface UseSelectedMonthReturn {
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
  loading: boolean;
  error: string | null;
}

/**
 * 管理选中月份的自定义 hook
 * - 自动从数据库获取可用月份列表
 * - 初始化为最新月份
 * - 默认使用 URL 参数持久化选择（刷新页面后保持）
 *
 * @param options - 配置选项
 * @returns 选中月份、设置函数、可用月份列表和加载状态
 */
export function useSelectedMonth(options: UseSelectedMonthOptions = {}): UseSelectedMonthReturn {
  const { persistInUrl = true } = options;

  // 获取可用月份
  const { months: availableMonths, loading: monthsLoading, error } = useAvailableMonths();
  const [selectedMonth, setSelectedMonthState] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // 从 URL 参数初始化选中的月份（如果启用了持久化），或者设置为最新月份
  useEffect(() => {
    if (monthsLoading || availableMonths.length === 0) return;

    // 如果启用了 URL 持久化，尝试从 URL 读取
    if (persistInUrl) {
      const monthFromUrl = searchParams.get('month');

      // 如果 URL 中有月份参数且该月份在可用月份列表中，使用它
      if (monthFromUrl && availableMonths.includes(monthFromUrl)) {
        setSelectedMonthState(monthFromUrl);
        return;
      }
    }

    // 否则使用最新月份
    if (!selectedMonth) {
      const latestMonth = availableMonths[0];
      setSelectedMonthState(latestMonth);

      // 如果启用了 URL 持久化，更新 URL
      if (persistInUrl) {
        setSearchParams({ month: latestMonth }, { replace: true });
      }
    }
  }, [availableMonths, monthsLoading, searchParams, selectedMonth, persistInUrl, setSearchParams]);

  // 月份改变处理函数
  const setSelectedMonth = (month: string) => {
    setSelectedMonthState(month);

    // 如果启用了 URL 持久化，同步更新 URL
    if (persistInUrl) {
      setSearchParams({ month });
    }
  };

  return {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    loading: monthsLoading,
    error,
  };
}
