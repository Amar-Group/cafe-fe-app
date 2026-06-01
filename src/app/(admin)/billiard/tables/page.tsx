"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

import {
  useBilliardTables,
  useDeleteBilliardTable,
} from "@/features/billiard/table/hooks/use-table";
import { useBilliardTableStore } from "@/features/billiard/table/store";
import type { BilliardTable } from "@/features/billiard/table/types";
import type { GroupedBilliardTableImage } from "@/features/billiard/table-image/types";

import { useBilliardTableImages, useDeleteBilliardTableImage } from "@/features/billiard/table-image/hooks/use-table-image";
import { useBilliardTableImageStore } from "@/features/billiard/table-image/store";

import { useBilliardTableColumns } from "./_components/table-columns";
import { BilliardTableFormModal } from "./_components/table-form-modal";
import { TableImageGalleryModal } from "./_components/table-image-gallery-modal";
import { TableImageFormModal } from "./_components/table-image-form-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export default function BilliardTablesPage() {
  const { data: tables = [], isLoading } = useBilliardTables();
  const { add } = useNotification();
  const deleteTable = useDeleteBilliardTable();
  const permissions = usePermissions();

  const { openCreate, deleteId: tableDeleteId, closeDelete: closeTableDelete } = useBilliardTableStore();

  // Table Images Hooks
  const { data: tableImages = [] } = useBilliardTableImages();
  const deleteTableImage = useDeleteBilliardTableImage();
  const { deleteId: imageDeleteId, closeDelete: closeImageDelete } = useBilliardTableImageStore();

  const [selectedGalleryTable, setSelectedGalleryTable] = useState<BilliardTable | null>(null);

  const selectedGalleryTableGroup = useMemo<GroupedBilliardTableImage | null>(() => {
    if (!selectedGalleryTable) return null;
    const imagesForTable = tableImages.filter((img) => img.billiard_table_id === selectedGalleryTable.id);
    return {
      table_id: selectedGalleryTable.id,
      table_name: selectedGalleryTable.name,
      table_thumbnail: selectedGalleryTable.thumbnail,
      images: imagesForTable,
      total_images: imagesForTable.length,
    };
  }, [selectedGalleryTable, tableImages]);

  const columns = useBilliardTableColumns({ 
    permissions,
    onOpenGallery: (table) => setSelectedGalleryTable(table),
  });

  const handleDeleteTable = async () => {
    if (!tableDeleteId) return;
    try {
      await deleteTable.mutateAsync(tableDeleteId);
      add({
        title: "Berhasil",
        message: "Meja billiard berhasil dihapus.",
        variant: "success",
      });
      closeTableDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus meja.",
        variant: "danger",
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!imageDeleteId) return;
    try {
      await deleteTableImage.mutateAsync(imageDeleteId);
      add({
        title: "Berhasil",
        message: "Gambar berhasil dihapus.",
        variant: "success",
      });
      closeImageDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus gambar.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meja Billiard"
        description="Kelola daftar meja billiard yang akan ditampilkan kepada pelanggan."
        breadcrumbs={[
          { label: "Billiard", href: "#" },
          { label: "Daftar Meja" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Meja</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Meja
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={tables}
            columns={columns}
            searchPlaceholder="Cari nama meja..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="billiard-tables"
          />
        </CardContent>
      </Card>

      <BilliardTableFormModal />

      <TableImageGalleryModal
        isOpen={!!selectedGalleryTableGroup}
        onClose={() => setSelectedGalleryTable(null)}
        data={selectedGalleryTableGroup}
        permissions={permissions}
      />

      <TableImageFormModal
        defaultTableId={selectedGalleryTable ? selectedGalleryTable.id : null}
      />

      <DeleteConfirmModal
        open={tableDeleteId !== null}
        onOpenChange={(open) => !open && closeTableDelete()}
        onConfirm={handleDeleteTable}
        isPending={deleteTable.isPending}
        description="Apakah kamu yakin ingin menghapus meja ini? Tindakan ini tidak dapat dibatalkan."
      />

      <DeleteConfirmModal
        open={imageDeleteId !== null}
        onOpenChange={(open) => !open && closeImageDelete()}
        onConfirm={handleDeleteImage}
        isPending={deleteTableImage.isPending}
        description="Apakah kamu yakin ingin menghapus gambar ini? Tindakan ini akan menghapus file permanen dan tidak dapat dibatalkan."
      />
    </div>
  );
}
