"use client";

import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

import {
  useBilliardTableTypes,
  useDeleteBilliardTableType,
} from "@/features/billiard/table-type/hooks/use-table-type";
import { useBilliardTableTypeStore } from "@/features/billiard/table-type/store";

import { useBilliardTableTypeColumns } from "./_components/table-type-columns";
import { BilliardTableTypeFormModal } from "./_components/table-type-form-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export default function BilliardTableTypesPage() {
  const { data: tableTypes = [], isLoading } = useBilliardTableTypes();
  const { add } = useNotification();
  const deleteTableType = useDeleteBilliardTableType();
  const permissions = usePermissions();

  const { openCreate, deleteId, closeDelete } = useBilliardTableTypeStore();

  const columns = useBilliardTableTypeColumns({ permissions });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTableType.mutateAsync(deleteId);
      add({
        title: "Berhasil",
        message: "Tipe meja berhasil dihapus.",
        variant: "success",
      });
      closeDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus tipe meja.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tipe Meja Billiard"
        description="Kelola kategori atau tipe untuk meja-meja billiard."
        breadcrumbs={[
          { label: "Billiard", href: "#" },
          { label: "Tipe Meja" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Tipe Meja</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Tipe Meja
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={tableTypes}
            columns={columns}
            searchPlaceholder="Cari tipe meja..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="billiard-table-types"
          />
        </CardContent>
      </Card>

      <BilliardTableTypeFormModal />

      <DeleteConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={handleDelete}
        isPending={deleteTableType.isPending}
        description="Apakah kamu yakin ingin menghapus tipe meja ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
