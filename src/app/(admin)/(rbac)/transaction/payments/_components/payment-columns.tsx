"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "@/features/payment/types";

export function usePaymentColumns() {
  return useMemo<ColumnDef<Payment, any>[]>(
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
        accessorKey: "transaction_id",
        header: "Transaction ID",
        cell: (info) => (
          <span className="font-medium text-foreground">{info.getValue() as string || "-"}</span>
        ),
        size: 200,
      },
      {
        accessorKey: "type",
        header: "Tipe Transaksi",
        cell: (info) => {
          const type = info.getValue() as string;
          return (
            <span className="capitalize text-muted-foreground">
              {type === "dish_order" ? "Pesanan Menu" : "Reservasi Billiard"}
            </span>
          );
        },
        size: 150,
      },
      {
        accessorKey: "gross_amount",
        header: "Total",
        cell: (info) => (
          <span className="font-semibold">
            Rp {Number(info.getValue()).toLocaleString("id-ID")}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "method",
        header: "Metode",
        cell: (info) => (
          <span className="uppercase text-muted-foreground font-medium text-xs">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                status === "paid"
                  ? "bg-green-500/10 text-green-500"
                  : status === "pending"
                  ? "bg-yellow-500/10 text-yellow-600"
                  : status === "failed" || status === "expired" || status === "cancelled"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
          );
        },
        size: 120,
      },
      {
        accessorKey: "created_at",
        header: "Tanggal Transaksi",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return (
            <span className="text-muted-foreground text-sm">
              {date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
        size: 200,
      },
    ],
    []
  );
}
