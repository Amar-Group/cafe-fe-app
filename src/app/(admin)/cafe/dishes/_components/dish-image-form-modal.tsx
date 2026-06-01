"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";
import { useNotification } from "@/components/ui/notification";
import { useCreateDishImage } from "@/features/cafe/dish-image/hooks/use-dish-image";
import { useDishImageStore } from "@/features/cafe/dish-image/store";
import { useDishes } from "@/features/cafe/dish/hooks/use-dish";
import { useCloudinaryUpload } from "@/features/upload/hooks/use-cloudinary-upload";
import { ImagePlus, X } from "lucide-react";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

type DishImageFormModalProps = {
  // If provided, the dish_id dropdown is locked to this value
  defaultDishId?: number | null;
};

export function DishImageFormModal({ defaultDishId }: DishImageFormModalProps) {
  const { isModalOpen, closeModal } = useDishImageStore();
  const { add } = useNotification();
  const createDishImage = useCreateDishImage();
  
  const { data: dishes = [] } = useDishes();
  const { uploadImage, isUploading } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formDishId, setFormDishId] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      setFormDishId(defaultDishId || "");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isModalOpen, defaultDishId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSave = async () => {
    if (formDishId === "" || !selectedFile) return;

    try {
      // 1. Upload ke Cloudinary
      const uploadResult = await uploadImage(selectedFile, "cafe");

      // 2. Simpan ke database
      const payload = {
        dish_id: Number(formDishId),
        image: uploadResult.secure_url,
        image_public_id: uploadResult.public_id,
      };

      await createDishImage.mutateAsync(payload);
      
      add({
        title: "Berhasil",
        message: "Gambar menu berhasil diunggah.",
        variant: "success",
      });
      closeModal();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Terjadi kesalahan sistem saat menyimpan.",
        variant: "danger",
      });
    }
  };

  const isSaving = createDishImage.isPending || isUploading;

  // We only support creating new images in this modal.
  // Editing existing image directly is not supported in this UI flow (user can delete and re-add instead).
  
  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-md z-[60]" // Ensure it is above the gallery modal which defaults to z-[50]
    >
      <ModalHeader>
        <ModalTitle>Tambah Gambar Menu</ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Pilih Menu <span className="text-red-500">*</span>
          </label>
          <select
            value={formDishId}
            onChange={(e) => setFormDishId(Number(e.target.value))}
            className={inputCls}
            disabled={isSaving || !!defaultDishId}
          >
            <option value="" disabled>Pilih menu</option>
            {dishes.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Gambar <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col items-start gap-3">
            {previewUrl ? (
              <div className="relative group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                  title="Hapus gambar"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'border-border'}`}
              >
                {isUploading ? (
                  <span className="size-6 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="size-8 mb-3 text-muted-foreground/50" />
                    <span className="text-sm font-medium">Klik untuk upload gambar</span>
                    <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG, WEBP hingga 5MB</span>
                  </>
                )}
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>

      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          onClick={() => closeModal()}
          disabled={isSaving}
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={formDishId === "" || !selectedFile || isSaving}
        >
          {isSaving ? "Menyimpan..." : "Upload & Simpan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
