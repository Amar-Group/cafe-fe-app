"use client";

import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import {
  useSchedules,
  useDeleteSchedule,
} from "@/features/billiard/schedule/hooks/use-schedule";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";
import { useScheduleStore } from "@/features/billiard/schedule/store";

import { useScheduleColumns } from "./_components/schedule-columns";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";
import { ScheduleFormModal } from "./_components/schedule-form-modal";

export default function SchedulesPage() {
  const { data: schedules = [], isLoading } = useSchedules();
  const { add } = useNotification();
  const deleteSchedule = useDeleteSchedule();
  const permissions = usePermissions();

  const { openCreate, deleteId, closeDelete } = useScheduleStore();

  const columns = useScheduleColumns({ permissions });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSchedule.mutateAsync(deleteId);
      add({
        title: "Berhasil",
        message: "Jadwal berhasil dihapus.",
        variant: "success",
      });
      closeDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus jadwal.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Jadwal Meja"
        description="Kelola slot waktu (jadwal) yang dapat dipesan untuk meja billiard."
        breadcrumbs={[
          { label: "Billiard Management", href: "#" },
          { label: "Schedules" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Jadwal</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Jadwal
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={schedules}
            columns={columns}
            searchPlaceholder="Cari jadwal..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="schedules"
          />
        </CardContent>
      </Card>

      <ScheduleFormModal />

      <DeleteConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={handleDelete}
        isPending={deleteSchedule.isPending}
        description="Apakah kamu yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
