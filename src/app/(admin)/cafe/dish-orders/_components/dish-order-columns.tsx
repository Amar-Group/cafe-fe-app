"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, ListOrdered, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DishOrder } from "@/features/cafe/dish-order/types";
import { useDishOrderStore, useDishOrderPaymentStore } from "@/features/cafe/dish-order/store";

type UseDishOrderColumnsProps = {
  onOpenDetails: (order: DishOrder) => void;
  permissions: {
    can_update: boolean;
    can_delete: boolean;
  };
};

export function useDishOrderColumns({ onOpenDetails, permissions }: UseDishOrderColumnsProps) {
  const { openEdit, openDelete } = useDishOrderStore();
  const { openPaymentModal } = useDishOrderPaymentStore();

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
          <span className="font-medium text-foreground">{info.getValue() as string}</span>
        ),
        size: 200,
      },
      {
        accessorKey: "guest_phone",
        header: "No. HP",
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() as string}</span>
        ),
        size: 150,
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          let color = "bg-gray-100 text-gray-800";
          let label = "Pending";
          
          switch (status) {
            case "pending":
              color = "bg-yellow-100 text-yellow-800";
              label = "Pending";
              break;
            case "confirmed":
              color = "bg-blue-100 text-blue-800";
              label = "Confirmed";
              break;
            case "preparing":
              color = "bg-purple-100 text-purple-800";
              label = "Preparing";
              break;
            case "completed":
              color = "bg-emerald-100 text-emerald-800";
              label = "Completed";
              break;
            case "cancelled":
              color = "bg-red-100 text-red-800";
              label = "Cancelled";
              break;
          }
          
          return (
            <Badge className={`${color} hover:${color} capitalize`}>{label}</Badge>
          );
        },
        size: 120,
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
        cell: ({ row }) => {
          const isPaid = row.original.payment_status === "paid";
          return (
            <div className="flex items-center gap-1">
              {!isPaid && (
                <button
                  onClick={() => openPaymentModal(row.original)}
                  className="p-1.5 rounded-md hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                  title="Bayar Pesanan"
                >
                  <Wallet className="size-4" />
                </button>
              )}
              <button
                onClick={() => onOpenDetails(row.original)}
                className="p-1.5 rounded-md hover:bg-blue-500/10 text-blue-500 transition-colors"
                title="Detail Pesanan"
              >
                <ListOrdered className="size-4" />
              </button>
              {permissions.can_update && !isPaid && (
              <button
                onClick={() => openEdit(row.original)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Edit Pesanan"
              >
                <Edit className="size-4" />
              </button>
            )}
            {permissions.can_delete && !isPaid && (
              <button
                onClick={() => openDelete(row.original.id)}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                title="Hapus Pesanan"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
          );
        },
        enableSorting: false,
        size: 140,
      },
    ],
    [onOpenDetails, permissions, openEdit, openDelete, openPaymentModal]
  );
}
