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
  useCreateDishOrder,
  useUpdateDishOrder,
} from "@/features/cafe/dish-order/hooks/use-dish-order";
import { useDishOrderStore } from "@/features/cafe/dish-order/store";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function DishOrderFormModal() {
  const { isModalOpen, editingItem: editingOrder, closeModal } = useDishOrderStore();
  const { add } = useNotification();
  const createOrder = useCreateDishOrder();
  const updateOrder = useUpdateDishOrder();

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      if (editingOrder) {
        setFormName(editingOrder.guest_name);
        setFormPhone(editingOrder.guest_phone);
      } else {
        setFormName("");
        setFormPhone("");
      }
    }
  }, [isModalOpen, editingOrder]);

  const handleSave = async () => {
    if (!formName.trim() || !formPhone.trim()) return;

    // Untuk create, field perhitungan wajib, tapi backend akan merecalculate nanti.
    // Kita kirim 0.00 untuk create.
    const payload = {
      guest_name: formName,
      guest_phone: formPhone,
      total: "0.00",
      tax: "0.00",
      service_fee: "0.00",
      nett_price: "0.00",
    };

    try {
      if (editingOrder) {
        // Edit hanya mengubah nama dan telepon, biarkan total dkk tidak berubah
        await updateOrder.mutateAsync({
          id: editingOrder.id,
          data: {
            guest_name: formName,
            guest_phone: formPhone,
          },
        });
        add({
          title: "Berhasil",
          message: "Data tamu pesanan diperbarui.",
          variant: "success",
        });
      } else {
        await createOrder.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Pesanan baru dibuat, silakan tambahkan item pesanan.",
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

  const isSaving = createOrder.isPending || updateOrder.isPending;

  return (
    <Modal open={isModalOpen} onClose={() => !isSaving && closeModal()} className="max-w-md">
      <ModalHeader>
        <ModalTitle>{editingOrder ? "Edit Data Tamu" : "Buat Pesanan Baru"}</ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Nama Tamu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="John Doe"
            className={inputCls}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Nomor Telepon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="081234567890"
            className={inputCls}
            disabled={isSaving}
          />
        </div>

        {!editingOrder && (
          <div className="p-3 bg-blue-500/10 text-blue-500 text-sm rounded-lg border border-blue-500/20">
            <p><strong>Info:</strong> Setelah pesanan dibuat, Anda bisa menambahkan item menu (keranjang) melalui fitur Detail Pesanan.</p>
          </div>
        )}

      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={() => closeModal()} disabled={isSaving}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={!formName.trim() || !formPhone.trim() || isSaving}
        >
          {isSaving ? "Menyimpan..." : editingOrder ? "Simpan Perubahan" : "Buat Pesanan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
