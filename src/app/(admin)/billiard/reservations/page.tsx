"use client";

import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

import {
  useReservations,
  useDeleteReservation,
} from "@/features/billiard/reservation/hooks/use-reservation";
import { useReservationStore } from "@/features/billiard/reservation/store";

import { useReservationColumns } from "./_components/reservation-columns";
import { ReservationFormModal } from "./_components/reservation-form-modal";
import { ReservationPaymentModal } from "./_components/reservation-payment-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export default function ReservationsPage() {
  const { data: reservations = [], isLoading } = useReservations();
  const { add } = useNotification();
  const deleteReservation = useDeleteReservation();
  const permissions = usePermissions();

  const { openCreate, deleteId, closeDelete } = useReservationStore();

  const columns = useReservationColumns({ permissions });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReservation.mutateAsync(deleteId);
      add({
        title: "Berhasil",
        message: "Reservasi berhasil dihapus.",
        variant: "success",
      });
      closeDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus reservasi.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservasi Meja"
        description="Kelola daftar pesanan atau booking meja billiard."
        breadcrumbs={[
          { label: "Billiard", href: "#" },
          { label: "Reservasi" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Reservasi</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Reservasi
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={reservations}
            columns={columns}
            searchPlaceholder="Cari nama tamu..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="billiard-reservations"
          />
        </CardContent>
      </Card>

      <ReservationFormModal />
      <ReservationPaymentModal />

      <DeleteConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={handleDelete}
        isPending={deleteReservation.isPending}
        description="Apakah kamu yakin ingin menghapus reservasi ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
