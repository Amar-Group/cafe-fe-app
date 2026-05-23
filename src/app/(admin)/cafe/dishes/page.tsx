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
  useDishes,
  useDeleteDish,
} from "@/features/cafe/dish/hooks/use-dish";
import { useDishStore } from "@/features/cafe/dish/store";
import type { Dish } from "@/features/cafe/dish/types";
import type { GroupedDishImage } from "@/features/cafe/dish-image/types";

import { useDishImages, useDeleteDishImage } from "@/features/cafe/dish-image/hooks/use-dish-image";
import { useDishImageStore } from "@/features/cafe/dish-image/store";

import { useDishColumns } from "./_components/dish-columns";
import { DishFormModal } from "./_components/dish-form-modal";
import { DishImageGalleryModal } from "./_components/dish-image-gallery-modal";
import { DishImageFormModal } from "./_components/dish-image-form-modal";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";

export default function DishesPage() {
  const { data: dishes = [], isLoading } = useDishes();
  const { add } = useNotification();
  const deleteDish = useDeleteDish();
  const permissions = usePermissions();

  const { openCreate, deleteId: dishDeleteId, closeDelete: closeDishDelete } = useDishStore();

  // Dish Images Hooks
  const { data: dishImages = [] } = useDishImages();
  const deleteDishImage = useDeleteDishImage();
  const { deleteId: imageDeleteId, closeDelete: closeImageDelete } = useDishImageStore();

  const [selectedGalleryDish, setSelectedGalleryDish] = useState<Dish | null>(null);

  const selectedGalleryDishGroup = useMemo<GroupedDishImage | null>(() => {
    if (!selectedGalleryDish) return null;
    const imagesForDish = dishImages.filter((img) => img.dish_id === selectedGalleryDish.id);
    return {
      dish_id: selectedGalleryDish.id,
      dish_name: selectedGalleryDish.name,
      dish_thumbnail: selectedGalleryDish.thumbnail,
      images: imagesForDish,
      total_images: imagesForDish.length,
    };
  }, [selectedGalleryDish, dishImages]);

  const columns = useDishColumns({ 
    permissions,
    onOpenGallery: (dish) => setSelectedGalleryDish(dish),
  });

  const handleDeleteDish = async () => {
    if (!dishDeleteId) return;
    try {
      await deleteDish.mutateAsync(dishDeleteId);
      add({
        title: "Berhasil",
        message: "Menu berhasil dihapus.",
        variant: "success",
      });
      closeDishDelete();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal menghapus menu.",
        variant: "danger",
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!imageDeleteId) return;
    try {
      await deleteDishImage.mutateAsync(imageDeleteId);
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
        title="Menu Makanan & Minuman"
        description="Kelola daftar menu yang akan ditampilkan kepada pelanggan."
        breadcrumbs={[
          { label: "Cafe", href: "#" },
          { label: "Daftar Menu" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Daftar Menu</CardTitle>
          {permissions.can_create && (
            <Button
              onClick={openCreate}
              size="sm"
              disabled={permissions.isLoading}
            >
              <Plus className="size-4 mr-1.5" />
              Tambah Menu
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={dishes}
            columns={columns}
            searchPlaceholder="Cari nama menu..."
            isLoading={isLoading}
            canExport={permissions.can_report}
            exportFilename="dishes"
          />
        </CardContent>
      </Card>

      <DishFormModal />

      <DishImageGalleryModal
        isOpen={!!selectedGalleryDishGroup}
        onClose={() => setSelectedGalleryDish(null)}
        data={selectedGalleryDishGroup}
        permissions={permissions}
      />

      <DishImageFormModal
        defaultDishId={selectedGalleryDish ? selectedGalleryDish.id : null}
      />

      <DeleteConfirmModal
        open={dishDeleteId !== null}
        onOpenChange={(open) => !open && closeDishDelete()}
        onConfirm={handleDeleteDish}
        isPending={deleteDish.isPending}
        description="Apakah kamu yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan."
      />

      <DeleteConfirmModal
        open={imageDeleteId !== null}
        onOpenChange={(open) => !open && closeImageDelete()}
        onConfirm={handleDeleteImage}
        isPending={deleteDishImage.isPending}
        description="Apakah kamu yakin ingin menghapus gambar ini? Tindakan ini akan menghapus file permanen dan tidak dapat dibatalkan."
      />
    </div>
  );
}
