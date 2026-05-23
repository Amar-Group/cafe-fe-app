"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DishCategory } from "@/features/cafe/dish-category/types";
import { useDishCategoryStore } from "@/features/cafe/dish-category/store";

type UseDishCategoryColumnsProps = {
  permissions: {
    can_update: boolean;
    can_delete: boolean;
  };
};

export function useDishCategoryColumns({ permissions }: UseDishCategoryColumnsProps) {
  const { openEdit, openDelete } = useDishCategoryStore();

  return useMemo<ColumnDef<DishCategory, any>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const idx = table
            .getRowModel()
            .rows.findIndex((r) => r.id === row.id);
          return (
            <span className="text-muted-foreground text-sm">
              {pageIndex * pageSize + idx + 1}
            </span>
          );
        },
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Nama Kategori",
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "icon",
        header: "Icon",
        cell: (info) => {
          const iconName = info.getValue() as string | null;
          if (!iconName) {
            return <span className="text-muted-foreground">—</span>;
          }
          
          // Attempt to render Lucide icon dynamically
          const Icon = (LucideIcons as any)[iconName];
          return (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="size-4 text-muted-foreground" />}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                {iconName}
              </code>
            </div>
          );
        },
        size: 180,
      },
      {
        accessorKey: "created_at",
        header: "Dibuat",
        cell: (info) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {new Date(info.getValue() as string).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
        size: 140,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          if (!permissions.can_update && !permissions.can_delete)
            return (
              <span className="text-muted-foreground text-xs">-</span>
            );
          return (
            <div className="flex items-center gap-1">
              {permissions.can_update && (
                <button
                  onClick={() => openEdit(row.original)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit"
                >
                  <Edit className="size-3.5" />
                </button>
              )}
              {permissions.can_delete && (
                <button
                  onClick={() => openDelete(row.original.id)}
                  className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 90,
      },
    ],
    [permissions, openEdit, openDelete]
  );
}
