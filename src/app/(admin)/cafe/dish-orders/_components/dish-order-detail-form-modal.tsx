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
  useCreateDishOrderDetail,
  useUpdateDishOrderDetail,
} from "@/features/cafe/dish-order/hooks/use-dish-order-detail";
import { useDishOrderDetailStore } from "@/features/cafe/dish-order/store";
import { useDishes } from "@/features/cafe/dish/hooks/use-dish";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

type DishOrderDetailFormModalProps = {
  // We need to know which order we are adding items to
  dishOrderId: number | null;
};

export function DishOrderDetailFormModal({ dishOrderId }: DishOrderDetailFormModalProps) {
  const { isModalOpen, editingItem, closeModal } = useDishOrderDetailStore();
  const { add } = useNotification();
  
  const createDetail = useCreateDishOrderDetail();
  const updateDetail = useUpdateDishOrderDetail();
  const { data: dishes = [] } = useDishes();

  const [formDishId, setFormDishId] = useState<number | "">("");
  const [formQty, setFormQty] = useState<number>(1);
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<string>("pending");

  useEffect(() => {
    if (isModalOpen) {
      if (editingItem) {
        setFormDishId(editingItem.dish_id);
        setFormQty(editingItem.quantity);
        setFormNotes(editingItem.notes || "");
        setFormStatus(editingItem.status);
      } else {
        setFormDishId("");
        setFormQty(1);
        setFormNotes("");
        setFormStatus("pending");
      }
    }
  }, [isModalOpen, editingItem]);

  const handleSave = async () => {
    if (!dishOrderId || formDishId === "" || formQty < 1) return;

    const payload = {
      dish_order_id: dishOrderId,
      dish_id: Number(formDishId),
      quantity: formQty,
      notes: formNotes || null,
      status: formStatus as any,
    };

    try {
      if (editingItem) {
        await updateDetail.mutateAsync({
          id: editingItem.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Item pesanan berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createDetail.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Item berhasil ditambahkan ke pesanan.",
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

  const isSaving = createDetail.isPending || updateDetail.isPending;

  return (
    <Modal open={isModalOpen} onClose={() => !isSaving && closeModal()} className="max-w-md z-[60]">
      <ModalHeader>
        <ModalTitle>{editingItem ? "Edit Item" : "Tambah Item Pesanan"}</ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Menu <span className="text-red-500">*</span>
          </label>
          <select
            value={formDishId}
            onChange={(e) => setFormDishId(Number(e.target.value))}
            className={inputCls}
            disabled={isSaving}
          >
            <option value="" disabled>Pilih menu</option>
            {dishes.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name} - Rp {Number(dish.price).toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formQty}
              onChange={(e) => setFormQty(Number(e.target.value))}
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              className={inputCls}
              disabled={isSaving}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Catatan Tambahan
          </label>
          <textarea
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder="Contoh: Ekstra pedas, jangan pakai bawang"
            className={inputCls}
            rows={2}
            disabled={isSaving}
          />
        </div>

      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={() => closeModal()} disabled={isSaving}>
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={formDishId === "" || formQty < 1 || isSaving}
        >
          {isSaving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambahkan ke Pesanan"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
