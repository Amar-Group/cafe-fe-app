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
  useCreateReservation,
  useUpdateReservation,
} from "@/features/billiard/reservation/hooks/use-reservation";
import { useReservationStore } from "@/features/billiard/reservation/store";
import { useBilliardTables } from "@/features/billiard/table/hooks/use-table";
import { useSchedules } from "@/features/billiard/schedule/hooks/use-schedule";

const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-card";

export function ReservationFormModal() {
  const { isModalOpen, editingItem: editingReservation, closeModal } = useReservationStore();
  const { add } = useNotification();
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  
  const { data: tables = [] } = useBilliardTables();
  const { data: schedules = [] } = useSchedules();

  const [formTableId, setFormTableId] = useState<number | "">("");
  const [formGuestName, setFormGuestName] = useState("");
  const [formGuestPhone, setFormGuestPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formScheduleId, setFormScheduleId] = useState<number | "">("");
  const [formGuestCount, setFormGuestCount] = useState<number | "">("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<"pending" | "confirmed" | "preparing" | "completed" | "cancelled">("pending");

  useEffect(() => {
    if (isModalOpen) {
      if (editingReservation) {
        setFormTableId(editingReservation.billiard_table_id);
        setFormGuestName(editingReservation.guest_name);
        setFormGuestPhone(editingReservation.guest_phone);
        // Format date to YYYY-MM-DD
        const formattedDate = new Date(editingReservation.date).toISOString().split('T')[0];
        setFormDate(formattedDate);
        setFormScheduleId(editingReservation.schedule_id);
        setFormGuestCount(editingReservation.guest_count);
        setFormNotes(editingReservation.notes || "");
        setFormStatus(editingReservation.status);
      } else {
        setFormTableId("");
        setFormGuestName("");
        setFormGuestPhone("");
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setFormDate(today);
        setFormScheduleId("");
        setFormGuestCount(2);
        setFormNotes("");
        setFormStatus("pending");
      }
    }
  }, [isModalOpen, editingReservation]);

  const handleSave = async () => {
    if (formTableId === "" || !formGuestName.trim() || !formGuestPhone.trim() || !formDate || formScheduleId === "" || formGuestCount === "") return;

    try {
      const payload = {
        billiard_table_id: Number(formTableId),
        guest_name: formGuestName,
        guest_phone: formGuestPhone,
        date: formDate,
        schedule_id: Number(formScheduleId),
        guest_count: Number(formGuestCount),
        notes: formNotes || null,
        status: formStatus,
      };

      if (editingReservation) {
        await updateReservation.mutateAsync({
          id: editingReservation.id,
          data: payload,
        });
        add({
          title: "Berhasil",
          message: "Reservasi berhasil diperbarui.",
          variant: "success",
        });
      } else {
        await createReservation.mutateAsync(payload);
        add({
          title: "Berhasil",
          message: "Reservasi berhasil ditambahkan.",
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

  const isSaving = createReservation.isPending || updateReservation.isPending;

  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSaving && closeModal()}
      className="max-w-lg"
    >
      <ModalHeader>
        <ModalTitle>
          {editingReservation ? "Edit Reservasi" : "Tambah Reservasi"}
        </ModalTitle>
        <ModalClose onClose={() => !isSaving && closeModal()} />
      </ModalHeader>
      <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Nama Tamu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formGuestName}
              onChange={(e) => setFormGuestName(e.target.value)}
              placeholder="Jhon Doe"
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              No HP Tamu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formGuestPhone}
              onChange={(e) => setFormGuestPhone(e.target.value)}
              placeholder="08123456789"
              className={inputCls}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Pilih Meja Billiard <span className="text-red-500">*</span>
          </label>
          <select
            value={formTableId}
            onChange={(e) => setFormTableId(Number(e.target.value))}
            className={inputCls}
            disabled={isSaving}
          >
            <option value="" disabled>Pilih meja</option>
            {tables.filter(t => t.is_active).map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Jadwal Waktu <span className="text-red-500">*</span>
            </label>
            <select
              value={formScheduleId}
              onChange={(e) => setFormScheduleId(Number(e.target.value))}
              className={inputCls}
              disabled={isSaving}
            >
              <option value="" disabled>Pilih jadwal</option>
              {schedules.map((sched) => (
                <option key={sched.id} value={sched.id}>
                  {sched.start_time.substring(0, 5)} - {sched.end_time.substring(0, 5)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              Jumlah Orang <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formGuestCount}
              onChange={(e) => setFormGuestCount(e.target.value === "" ? "" : Number(e.target.value))}
              className={inputCls}
              disabled={isSaving}
            />
          </div>
          {editingReservation && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
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
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Catatan Tambahan
          </label>
          <textarea
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            placeholder="Minta dibersihkan mejanya sebelum main"
            className={inputCls}
            rows={3}
            disabled={isSaving}
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
          disabled={formTableId === "" || !formGuestName.trim() || !formGuestPhone.trim() || !formDate || formScheduleId === "" || formGuestCount === "" || isSaving}
        >
          {isSaving
            ? "Menyimpan..."
            : editingReservation
            ? "Simpan Perubahan"
            : "Tambah Reservasi"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
