// @/components/features/dashboard/transaction/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// 创建一个类型，允许传递删除和编辑处理函数
interface ColumnOptions {
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

export const createColumns = (
  options?: ColumnOptions
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div className="ml-4">{date}</div>;
    },
  },
  {
    accessorKey: "merchant",
    header: () => <div>Merchants</div>,
    cell: ({ row }) => {
      const merchant = row.getValue("merchant") as string;
      return <div className="">{merchant}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formatted = new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
      }).format(amount);

      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="">Category</div>,
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const subCategory = row.original.subCategory as string;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">
            {category}
          </span>
          {subCategory && (
            <>
              <span className="text-xs text-muted-foreground">→</span>
              <Badge variant="outline">
                <span className=" text-muted-foreground">{subCategory}</span>
              </Badge>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tags",
    header: () => <div className="">Tag</div>,
    cell: ({ row }) => {
      const tags = row.original.tags as string[];

      if (!tags || tags.length === 0) {
        return <div>-</div>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      const handleEdit = () => {
        if (options?.onEdit) {
          options.onEdit(transaction);
        } else {
          console.log("Edit Transaction:", transaction.id);
        }
      };

      const handleDelete = () => {
        // 调用删除处理函数
        if (options?.onDelete) {
          options.onDelete(transaction.id);
        } else {
          console.log("Delete Transaction:", transaction.id);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Operation</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// 为了向后兼容，导出一个默认的columns数组
export const columns = createColumns();
