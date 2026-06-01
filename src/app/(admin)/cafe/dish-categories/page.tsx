"use client";

import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { useNotification } from "@/components/ui/notification";
import { usePermissions } from "@/features/rbac/user/hooks/use-user";

import {
  useDishCategories,
  useDeleteDishCategory,
} from "@/features/cafe/dish-category/hooks/use-dish-category";
import { useDishCategoryStore } from "@/features/cafe/dish-category/store";

import { useDishCategoryColumns } from "./_components/dish-category-columns";
import { DishCategoryFormModal } from "./_components/dish-category-form-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export default function DishCategoriesPage() {
  const { data: categories = [], isLoading } = useDishCategories();
  const { add } = useNotification();
  const deleteCategory = useDeleteDishCategory();
  const permissions = usePermissions();

  const { openCreate, deleteId, closeDelete } = useDishCategoryStore();

  const columns = useDishCategoryColumns({ permissions });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      add({
        title: "Berhasil",
        message: "Kategori menu berhasil dihapus.",
        variant: "success",
      });
      closeDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus kategori.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Menu"
        description="Kelola kategori untuk menu-menu yang tersedia di cafe."
        breadcrumbs={[
          { label: "Cafe", href: "#" },
          { label: "Kategori Menu" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Kategori</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Kategori
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={categories}
            columns={columns}
            searchPlaceholder="Cari kategori..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="dish-categories"
          />
        </CardContent>
      </Card>

      <DishCategoryFormModal />

      <DeleteConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && closeDelete()}
        onConfirm={handleDelete}
        isPending={deleteCategory.isPending}
        description="Apakah kamu yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
