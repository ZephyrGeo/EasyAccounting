// @/components/features/dashboard/transaction/data-table.tsx
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTransaction } from "./TransactionForm";
import { Transaction } from "@/types/transaction";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAdd?: (transaction: Transaction) => void;
  selectedYear?: string | null;
  selectedMonth?: string | null;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
  selectedYear,
  selectedMonth,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    // 默认按日期降序排序（最新的在前面）
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  // 添加分页状态
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // 每页显示10条记录
  });

  // 从数据中提取所有唯一的类别
  const categories = React.useMemo(() => {
    const transactionData = data as Transaction[];
    const uniqueCategories = Array.from(
      new Set(transactionData.map((transaction) => transaction.category)),
    ).sort();
    return uniqueCategories;
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, // 添加分页状态更新函数
    state: {
      sorting,
      columnFilters,
      pagination, // 使用状态变量而不是固定值
    },
  });

  // 处理添加新交易
  const handleAddTransaction = (newTransaction: Transaction) => {
    if (onAdd) {
      onAdd(newTransaction);
    }
  };

  return (
    <>
      <div className="flex items-center py-4 gap-4 flex-wrap">
        <Input
          placeholder="Filter merchants..."
          value={
            (table.getColumn("merchant")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("merchant")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) =>
            table
              .getColumn("category")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter categories..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          {onAdd && (
            <AddTransaction
              onAdd={handleAddTransaction}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {table.getCanPreviousPage() ? (
                  <PaginationPrevious onClick={() => table.previousPage()} />
                ) : (
                  <PaginationPrevious
                    className="pointer-events-none opacity-50"
                    aria-disabled="true"
                  />
                )}
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, table.getPageCount()) }).map(
                (_, index) => {
                  // 显示当前页附近的页码
                  let pageIndex = 0;
                  if (table.getPageCount() <= 5) {
                    pageIndex = index;
                  } else {
                    const currentPage = table.getState().pagination.pageIndex;
                    const startPage = Math.max(
                      0,
                      Math.min(currentPage - 2, table.getPageCount() - 5),
                    );
                    pageIndex = startPage + index;
                  }

                  return (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        isActive={
                          table.getState().pagination.pageIndex === pageIndex
                        }
                        onClick={() => table.setPageIndex(pageIndex)}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              <PaginationItem>
                {table.getCanNextPage() ? (
                  <PaginationNext onClick={() => table.nextPage()} />
                ) : (
                  <PaginationNext
                    className="pointer-events-none opacity-50"
                    aria-disabled="true"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
