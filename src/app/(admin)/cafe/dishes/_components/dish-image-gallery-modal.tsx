"use client";

import { Modal, ModalHeader, ModalTitle, ModalBody, ModalClose } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { GroupedDishImage } from "@/features/cafe/dish-image/types";
import { useDishImageStore } from "@/features/cafe/dish-image/store";

type DishImageGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: GroupedDishImage | null;
  permissions: {
    can_create: boolean;
    can_delete: boolean;
  };
};

export function DishImageGalleryModal({ isOpen, onClose, data, permissions }: DishImageGalleryModalProps) {
  const { openCreate, openDelete } = useDishImageStore();

  if (!data) return null;

  return (
    <Modal open={isOpen} onClose={onClose} className="max-w-3xl">
      <ModalHeader className="flex-row items-center justify-between pb-2 border-b border-border mb-4">
        <ModalTitle>Galeri: {data.dish_name}</ModalTitle>
        <ModalClose onClose={onClose} />
      </ModalHeader>
      
      <ModalBody className="max-h-[70vh] overflow-y-auto no-scrollbar pb-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Menampilkan {data.total_images} gambar untuk menu ini.
          </p>
          {permissions.can_create && (
            <Button size="sm" onClick={() => openCreate()}>
              <Plus className="size-4 mr-1.5" />
              Tambah Gambar
            </Button>
          )}
        </div>

        {data.total_images === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">Belum ada gambar untuk menu ini.</p>
            {permissions.can_create && (
              <Button variant="outline" size="sm" onClick={() => openCreate()}>
                Upload Gambar Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                <img 
                  src={img.image} 
                  alt={data.dish_name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {permissions.can_delete && (
                    <button
                      onClick={() => openDelete(img.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm transform translate-y-2 group-hover:translate-y-0 duration-200"
                      title="Hapus gambar"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
