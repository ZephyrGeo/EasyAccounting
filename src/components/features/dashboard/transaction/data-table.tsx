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
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onAdd,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    // 默认按日期降序排序（最新的在前面）
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // 本地数据状态
  const [localData, setLocalData] = React.useState<TData[]>(data);

  // 当传入的数据变化时更新本地数据
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const table = useReactTable({
    data: localData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: 10, // 每页显示10条记录
      },
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
      <div className="flex items-center py-4">
        <Input
          placeholder="筛选商家..."
          value={
            (table.getColumn("merchant")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("merchant")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onAdd && <AddTransaction onAdd={handleAddTransaction} />}
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
                          header.getContext()
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
                        cell.getContext()
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
                  无数据。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页控件 */}
      {table.getRowModel().rows?.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          {/* <div className="flex-1 text-sm text-muted-foreground">
            共 {table.getFilteredRowModel().rows.length} 条记录
          </div> */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>

              {/* 显示页码 */}
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
                      Math.min(currentPage - 2, table.getPageCount() - 5)
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
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
