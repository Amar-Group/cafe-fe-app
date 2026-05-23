"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, ListOrdered } from "lucide-react";
import type { DishOrder } from "@/features/cafe/dish-order/types";
import { useDishOrderStore } from "@/features/cafe/dish-order/store";

type UseDishOrderColumnsProps = {
  onOpenDetails: (order: DishOrder) => void;
  permissions: {
    can_update: boolean;
    can_delete: boolean;
  };
};

export function useDishOrderColumns({ onOpenDetails, permissions }: UseDishOrderColumnsProps) {
  const { openEdit, openDelete } = useDishOrderStore();

  return useMemo<ColumnDef<DishOrder, any>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const idx = table.getRowModel().rows.findIndex((r) => r.id === row.id);
          return <span className="text-muted-foreground text-sm">{pageIndex * pageSize + idx + 1}</span>;
        },
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "guest_name",
        header: "Nama Tamu",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{info.getValue() as string}</span>
            <span className="text-xs text-muted-foreground">{info.row.original.guest_phone}</span>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "total",
        header: "Subtotal",
        cell: (info) => (
          <span className="text-muted-foreground">
            Rp {Number(info.getValue()).toLocaleString("id-ID")}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "nett_price",
        header: "Nett Price",
        cell: (info) => (
          <span className="font-semibold text-primary">
            Rp {Number(info.getValue()).toLocaleString("id-ID")}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Tanggal Pesan",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return (
            <span className="text-muted-foreground text-sm">
              {date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          );
        },
        size: 200,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenDetails(row.original)}
              className="p-1.5 rounded-md hover:bg-blue-500/10 text-blue-500 transition-colors"
              title="Detail Pesanan"
            >
              <ListOrdered className="size-4" />
            </button>
            {permissions.can_update && (
              <button
                onClick={() => openEdit(row.original)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Edit Pesanan"
              >
                <Edit className="size-4" />
              </button>
            )}
            {permissions.can_delete && (
              <button
                onClick={() => openDelete(row.original.id)}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                title="Hapus Pesanan"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ),
        enableSorting: false,
        size: 120,
      },
    ],
    [onOpenDetails, permissions, openEdit, openDelete]
  );
}
