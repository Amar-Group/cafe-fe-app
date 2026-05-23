"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Dish } from "@/features/cafe/dish/types";
import { useDishStore } from "@/features/cafe/dish/store";

type UseDishColumnsProps = {
  onOpenGallery: (dish: Dish) => void;
  permissions: {
    can_update: boolean;
    can_delete: boolean;
  };
};

export function useDishColumns({ onOpenGallery, permissions }: UseDishColumnsProps) {
  const { openEdit, openDelete } = useDishStore();

  return useMemo<ColumnDef<Dish, any>[]>(
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
        accessorKey: "thumbnail",
        header: "Gambar",
        cell: (info) => {
          const url = info.getValue() as string | null;
          if (!url) return <div className="size-10 bg-muted rounded object-cover border border-border flex items-center justify-center text-xs text-muted-foreground">No img</div>;
          return <img src={url} alt="Thumbnail" className="size-10 bg-muted rounded object-cover border border-border" />;
        },
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Nama Menu",
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue() as string}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "price",
        header: "Harga",
        cell: (info) => {
          const price = parseFloat(info.getValue() as string);
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(price);
        },
        size: 150,
      },
      {
        accessorKey: "is_available",
        header: "Ketersediaan",
        cell: (info) => {
          const available = info.getValue() as boolean;
          return available ? (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Tersedia</Badge>
          ) : (
            <Badge variant="destructive">Habis</Badge>
          );
        },
        size: 120,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          if (!permissions.can_update && !permissions.can_delete)
            return <span className="text-muted-foreground text-xs">-</span>;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenGallery(row.original)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Galeri Gambar"
              >
                <Images className="size-3.5" />
              </button>
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
        size: 110,
      },
    ],
    [permissions, openEdit, openDelete, onOpenGallery]
  );
}
