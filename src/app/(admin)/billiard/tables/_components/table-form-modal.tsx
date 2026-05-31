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
  useCreateBilliardTable,
  useUpdateBilliardTable,
} from "@/features/billiard/table/hooks/use-table";
import { useBilliardTableStore } from "@/features/billiard/table/store";
import { useBilliardTableTypes } from "@/features/billiard/table-type/hooks/use-table-type";
import { useCloudinaryUpload } from "@/features/upload/hooks/use-cloudinary-upload";
import { ImagePlus, X } from "lucide-react";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function BilliardTableFormModal() {
  const { isModalOpen, editingItem: editingTable, closeModal } = useBilliardTableStore();
  const { add } = useNotification();
  const createTable = useCreateBilliardTable();
  const updateTable = useUpdateBilliardTable();
  
  const { data: tableTypes = [] } = useBilliardTableTypes();
  const { uploadImage, isUploading } = useCloudinaryUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formName, setFormName] = useState("");
  const [formTableTypeId, setFormTableTypeId] = useState<number | "">("");
  const [formPrice, setFormPrice] = useState("");
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailPublicId, setThumbnailPublicId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      if (editingTable) {
        setFormName(editingTable.name);
        setFormTableTypeId(editingTable.table_type_id);
        setFormPrice(editingTable.price.toString());
        setFormIsAvailable(editingTable.is_available);
        setThumbnailUrl(editingTable.thumbnail);
        setThumbnailPublicId(editingTable.thumbnail_public_id);
        setSelectedFile(null);
      } else {
        setFormName("");
        setFormTableTypeId("");
        setFormPrice("");
        setFormIsAvailable(true);
        setThumbnailUrl(null);
        setThumbnailPublicId(null);
        setSelectedFile(null);
      }
    }
  }, [isModalOpen, editingTable]);

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
    if (!formName.trim() || formTableTypeId === "" || !formPrice.trim()) return;

    let finalThumbnailUrl = thumbnailUrl;
    let finalThumbnailPublicId = thumbnailPublicId;

    try {
      if (selectedFile) {
        const result = await uploadImage(selectedFile, "billiard");
        finalThumbnailUrl = result.secure_url;
        finalThumbnailPublicId = result.public_id;
      }

      const payload = {
        name: formName,
        slug: generateSlug(formName),
        table_type_id: Number(formTableTypeId),
        price: formPrice,
        thumbnail: finalThumbnailUrl,
        thumbnail_public_id: finalThumbnailPublicId,
        is_available: formIsAvailable,
        is_active: true, // Auto active by default
      };

      if (editingTable) {
        await updateTable.mutateAsync({
          id: editingTable.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Meja billiard berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createTable.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Meja billiard berhasil ditambahkan.",
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

  const isSaving = createTable.isPending || updateTable.isPending || isUploading;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-lg"
    >
      <ModalHeader>
        <ModalTitle>
          {editingTable ? "Edit Meja Billiard" : "Tambah Meja Billiard"}
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
              Nama Meja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Meja 1"
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Tipe Meja <span className="text-red-500">*</span>
            </label>
            <select
              value={formTableTypeId}
              onChange={(e) => setFormTableTypeId(Number(e.target.value))}
              className={inputCls}
              disabled={isSaving}
            >
              <option value="" disabled>Pilih tipe meja</option>
              {tableTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Harga / Jam (Rp) <span className="text-red-500">*</span>
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
            Meja Tersedia (Ready)
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
          disabled={!formName.trim() || formTableTypeId === "" || !formPrice.trim() || isSaving}
        >
          {isSaving
            ? "Menyimpan..."
            : editingTable
            ? "Simpan Perubahan"
            : "Tambah Meja"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
