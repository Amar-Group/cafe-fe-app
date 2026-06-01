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
  useCreateSchedule,
  useUpdateSchedule,
} from "@/features/billiard/schedule/hooks/use-schedule";
import { useScheduleStore } from "@/features/billiard/schedule/store";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function ScheduleFormModal() {
  const { isModalOpen, editingItem: editingSchedule, closeModal } = useScheduleStore();
  const { add } = useNotification();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();

  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      if (editingSchedule) {
        setFormStartTime(editingSchedule.start_time);
        setFormEndTime(editingSchedule.end_time);
      } else {
        setFormStartTime("");
        setFormEndTime("");
      }
    }
  }, [isModalOpen, editingSchedule]);

  const handleSave = async () => {
    if (!formStartTime.trim() || !formEndTime.trim()) return;
    try {
      if (editingSchedule) {
        await updateSchedule.mutateAsync({
          id: editingSchedule.id,
          data: { start_time: formStartTime, end_time: formEndTime },
        });
        add({
          title: "Berhasil",
          message: "Jadwal berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createSchedule.mutateAsync({
          start_time: formStartTime,
          end_time: formEndTime,
        });
        add({
          title: "Berhasil",
          message: "Jadwal berhasil ditambahkan.",
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

  const isSaving = createSchedule.isPending || updateSchedule.isPending;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-md"
    >
      <ModalHeader>
        <ModalTitle>
          {editingSchedule ? "Edit Jadwal" : "Tambah Jadwal"}
        </ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Waktu Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            step="1"
            value={formStartTime}
            onChange={(e) => setFormStartTime(e.target.value)}
            className={inputCls}
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Pilih waktu mulai (contoh: 18:00:00).
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Waktu Selesai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            step="1"
            value={formEndTime}
            onChange={(e) => setFormEndTime(e.target.value)}
            className={inputCls}
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Pilih waktu selesai (contoh: 20:00:00).
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
          disabled={!formStartTime.trim() || !formEndTime.trim() || isSaving}
        >
          {isSaving
            ? "Menyimpan..."
            : editingSchedule
            ? "Simpan Perubahan"
            : "Tambah"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
