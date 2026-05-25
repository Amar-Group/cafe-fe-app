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
  useCreateBilliardTableType,
  useUpdateBilliardTableType,
} from "@/features/billiard/table-type/hooks/use-table-type";
import { useBilliardTableTypeStore } from "@/features/billiard/table-type/store";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function BilliardTableTypeFormModal() {
  const { isModalOpen, editingItem: editingType, closeModal } = useBilliardTableTypeStore();
  const { add } = useNotification();
  const createType = useCreateBilliardTableType();
  const updateType = useUpdateBilliardTableType();

  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      if (editingType) {
        setFormName(editingType.name);
        setFormIcon(editingType.icon || "");
        setFormDescription(editingType.description || "");
      } else {
        setFormName("");
        setFormIcon("");
        setFormDescription("");
      }
    }
  }, [isModalOpen, editingType]);

  const handleSave = async () => {
    if (!formName.trim()) return;

    const payload = {
      name: formName,
      icon: formIcon || null,
      description: formDescription || null,
    };

    try {
      if (editingType) {
        await updateType.mutateAsync({
          id: editingType.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Tipe meja berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createType.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Tipe meja berhasil ditambahkan.",
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

  const isSaving = createType.isPending || updateType.isPending;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-md"
    >
      <ModalHeader>
        <ModalTitle>
          {editingType ? "Edit Tipe Meja" : "Tambah Tipe Meja"}
        </ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Nama Tipe Meja <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: Meja 9 Feet"
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
            placeholder="Contoh: Circle"
            className={inputCls}
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Nama icon dari library Lucide React (misal: Circle, Square).
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Deskripsi
          </label>
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Deskripsi singkat mengenai tipe meja ini"
            className={inputCls}
            disabled={isSaving}
            rows={3}
          />
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
            : editingType
            ? "Simpan Perubahan"
            : "Tambah"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
