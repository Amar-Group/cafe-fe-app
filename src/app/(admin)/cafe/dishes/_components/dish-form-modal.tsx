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
import {
  useCreateDish,
  useUpdateDish,
} from "@/features/cafe/dish/hooks/use-dish";
import { useDishStore } from "@/features/cafe/dish/store";
import { useDishCategories } from "@/features/cafe/dish-category/hooks/use-dish-category";
import { useCloudinaryUpload } from "@/features/upload/hooks/use-cloudinary-upload";
import { ImagePlus, X } from "lucide-react";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function DishFormModal() {
  const { isModalOpen, editingItem: editingDish, closeModal } = useDishStore();
  const { add } = useNotification();
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  
  const { data: categories = [] } = useDishCategories();
  const { uploadImage, isUploading } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState<number | "">("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailPublicId, setThumbnailPublicId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      if (editingDish) {
        setFormName(editingDish.name);
        setFormCategoryId(editingDish.dish_category_id);
        setFormPrice(editingDish.price.toString());
        setFormDescription(editingDish.description || "");
        setFormIsAvailable(editingDish.is_available);
        setThumbnailUrl(editingDish.thumbnail);
        setThumbnailPublicId(editingDish.thumbnail_public_id);
        setSelectedFile(null);
      } else {
        setFormName("");
        setFormCategoryId("");
        setFormPrice("");
        setFormDescription("");
        setFormIsAvailable(true);
        setThumbnailUrl(null);
        setThumbnailPublicId(null);
        setSelectedFile(null);
      }
    }
  }, [isModalOpen, editingDish]);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setThumbnailUrl(URL.createObjectURL(file));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setThumbnailUrl(null);
    setThumbnailPublicId(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (!formName.trim() || formCategoryId === "" || !formPrice.trim()) return;

    let finalThumbnailUrl = thumbnailUrl;
    let finalThumbnailPublicId = thumbnailPublicId;

    try {
      if (selectedFile) {
        const result = await uploadImage(selectedFile, "cafe");
        finalThumbnailUrl = result.secure_url;
        finalThumbnailPublicId = result.public_id;
      }

      const payload = {
        name: formName,
        slug: generateSlug(formName),
        dish_category_id: Number(formCategoryId),
        price: formPrice,
        description: formDescription || null,
        thumbnail: finalThumbnailUrl,
        thumbnail_public_id: finalThumbnailPublicId,
        is_available: formIsAvailable,
        is_active: true, // Auto active by default
      };

      if (editingDish) {
        await updateDish.mutateAsync({
          id: editingDish.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Menu berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createDish.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Menu berhasil ditambahkan.",
          variant: "success",
        });
      }
      closeModal();
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Terjadi kesalahan sistem.",
        variant: "danger",
      });
    }
  };

  const isSaving = createDish.isPending || updateDish.isPending || isUploading;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-lg"
    >
      <ModalHeader>
        <ModalTitle>
          {editingDish ? "Edit Menu" : "Tambah Menu"}
        </ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
        
        {/* Image Upload Area */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Gambar / Thumbnail
          </label>
          <div className="flex flex-col items-start gap-3">
            {thumbnailUrl ? (
              <div className="relative group">
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail" 
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus gambar"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'border-border'}`}
              >
                {isUploading ? (
                  <span className="size-6 border-[3px] border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="size-6 mb-2 text-muted-foreground/60" />
                    <span className="text-xs">Upload Image</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Nasi Goreng"
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(Number(e.target.value))}
              className={inputCls}
              disabled={isSaving}
            >
              <option value="" disabled>Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={formPrice}
            onChange={(e) => setFormPrice(e.target.value)}
            placeholder="35000"
            className={inputCls}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Deskripsi Singkat
          </label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Nasi goreng lezat dengan bumbu rahasia"
            className={inputCls}
            rows={3}
            disabled={isSaving}
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formIsAvailable}
            onChange={(e) => setFormIsAvailable(e.target.checked)}
            disabled={isSaving}
            className="rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-foreground select-none cursor-pointer">
            Menu Tersedia (Ready)
          </label>
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
          disabled={!formName.trim() || formCategoryId === "" || !formPrice.trim() || isSaving}
        >
          {isSaving
            ? "Menyimpan..."
            : editingDish
            ? "Simpan Perubahan"
            : "Tambah Menu"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
