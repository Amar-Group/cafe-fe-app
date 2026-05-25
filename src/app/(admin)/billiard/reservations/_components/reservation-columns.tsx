"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/features/billiard/reservation/types";
import { useReservationStore } from "@/features/billiard/reservation/store";
import { useBilliardTables } from "@/features/billiard/table/hooks/use-table";

type UseReservationColumnsProps = {
  permissions: {
    can_update: boolean;
    can_delete: boolean;
  };
};

export function useReservationColumns({ permissions }: UseReservationColumnsProps) {
  const { openEdit, openDelete } = useReservationStore();
  const { data: tables = [] } = useBilliardTables();

  const tableMap = useMemo(() => {
    return tables.reduce((acc, t) => {
      acc[t.id] = t.name;
      return acc;
    }, {} as Record<number, string>);
  }, [tables]);

  return useMemo<ColumnDef<Reservation, any>[]>(
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
        accessorKey: "billiard_table_id",
        header: "Meja",
        cell: (info) => {
          const val = info.getValue() as number;
          return <span className="font-medium">{tableMap[val] || `Meja #${val}`}</span>;
        },
        size: 150,
      },
      {
        accessorKey: "guest_name",
        header: "Nama Tamu",
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue() as string}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: "guest_phone",
        header: "No. HP",
        cell: (info) => (
          <span className="text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: (info) => {
          const date = info.getValue() as string;
          return <span>{new Date(date).toLocaleDateString("id-ID")}</span>;
        },
        size: 120,
      },
      {
        accessorKey: "start_time",
        header: "Waktu",
        cell: ({ row }) => {
          const start = row.original.start_time;
          const end = row.original.end_time;
          return <span>{start.substring(0, 5)} - {end.substring(0, 5)}</span>;
        },
        size: 130,
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
        size: 100,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          if (!permissions.can_update && !permissions.can_delete)
            return <span className="text-muted-foreground text-xs">-</span>;
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
        size: 100,
      },
    ],
    [permissions, openEdit, openDelete, tableMap]
  );
}
