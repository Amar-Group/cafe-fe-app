"use client";

import { useState, useEffect } from "react";
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
  useCreateDishCategory,
  useUpdateDishCategory,
} from "@/features/cafe/dish-category/hooks/use-dish-category";
import { useDishCategoryStore } from "@/features/cafe/dish-category/store";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function DishCategoryFormModal() {
  const { isModalOpen, editingItem: editingCategory, closeModal } = useDishCategoryStore();
  const { add } = useNotification();
  const createCategory = useCreateDishCategory();
  const updateCategory = useUpdateDishCategory();

  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      if (editingCategory) {
        setFormName(editingCategory.name);
        setFormIcon(editingCategory.icon || "");
      } else {
        setFormName("");
        setFormIcon("");
      }
    }
  }, [isModalOpen, editingCategory]);

  const handleSave = async () => {
    if (!formName.trim()) return;

    const payload = {
      name: formName,
      icon: formIcon || null,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Kategori berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createCategory.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Kategori berhasil ditambahkan.",
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

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-md"
    >
      <ModalHeader>
        <ModalTitle>
          {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
        </ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: Main Course"
            className={inputCls}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Icon (Lucide React)
          </label>
          <input
            type="text"
            value={formIcon}
            onChange={(e) => setFormIcon(e.target.value)}
            placeholder="Contoh: Coffee"
            className={inputCls}
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Nama icon dari library Lucide React (misal: Coffee, Pizza, Utensils).
          </p>
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
          disabled={!formName.trim() || isSaving}
        >
          {isSaving
            ? "Menyimpan..."
            : editingCategory
            ? "Simpan Perubahan"
            : "Tambah"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
