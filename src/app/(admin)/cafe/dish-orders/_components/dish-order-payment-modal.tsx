"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/ui/notification";
import { useDishOrderPaymentStore } from "@/features/cafe/dish-order/store";
import { useCreatePayment, useUpdatePayment } from "@/features/payment/hooks/use-payment";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Banknote } from "lucide-react";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";

export function DishOrderPaymentModal() {
  const { isPaymentModalOpen, selectedOrderForPayment, closePaymentModal } = useDishOrderPaymentStore();
  const { add } = useNotification();
  const queryClient = useQueryClient();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris">("cash");

  if (!selectedOrderForPayment) return null;

  const handlePayment = async () => {
    try {
      const payload = {
        type: "dish_order" as const,
        dish_order_id: selectedOrderForPayment.id,
        gross_amount: selectedOrderForPayment.nett_price,
        method: paymentMethod,
        provider: paymentMethod === "cash" ? ("cashier" as const) : ("midtrans" as const),
      };

      const res = await createPayment.mutateAsync(payload);
      const result = res.data;

      if (paymentMethod === "cash") {
        add({
          title: "Berhasil",
          message: "Pembayaran tunai berhasil dicatat. Pesanan Lunas.",
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["dish-orders"] });
        closePaymentModal();
      } else if (paymentMethod === "qris" && result.snap_token) {
        // Trigger Midtrans Snap
        if (typeof (window as any).snap !== "undefined") {
          (window as any).snap.pay(result.snap_token, {
            onSuccess: async function () {
              try {
                await updatePayment.mutateAsync({
                  id: result.id,
                  data: { status: "paid", paid_at: new Date().toISOString() },
                });
                add({
                  title: "Berhasil",
                  message: "Pembayaran QRIS berhasil dan pesanan dilunasi.",
                  variant: "success",
                });
                queryClient.invalidateQueries({ queryKey: ["dish-orders"] });
                closePaymentModal();
              } catch (err: any) {
                add({
                  title: "Gagal Update",
                  message: "Pembayaran sukses namun gagal update status ke database.",
                  variant: "danger",
                });
              }
            },
            onPending: function () {
              add({
                title: "Menunggu",
                message: "Selesaikan pembayaran Anda.",
                variant: "info",
              });
            },
            onError: function (result: any) {
              add({
                title: "Gagal",
                message: "Pembayaran gagal diproses.",
                variant: "danger",
              });
            },
            onClose: function () {
              // Optionally do something
            },
          });
        } else {
          add({
            title: "Error",
            message: "Midtrans Snap script belum dimuat.",
            variant: "danger",
          });
        }
      }
    } catch (error: any) {
      add({
        title: "Gagal",
        message: error.message || "Gagal memproses pembayaran.",
        variant: "danger",
      });
    }
  };

  return (
    <Modal
      open={isPaymentModalOpen}
      onClose={closePaymentModal}
      className="max-w-md"
    >
      <ModalHeader>
        <ModalTitle>Pembayaran Pesanan</ModalTitle>
        <ModalClose onClose={closePaymentModal} />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-muted-foreground mb-4">
          Pilih metode pembayaran untuk {selectedOrderForPayment.guest_name} (Total: Rp {Number(
            selectedOrderForPayment.nett_price
          ).toLocaleString("id-ID")})
        </p>
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors ${
                paymentMethod === "cash"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <Banknote className="size-8" />
              <span className="font-medium">Tunai (Cash)</span>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors ${
                paymentMethod === "qris"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              }`}
              onClick={() => setPaymentMethod("qris")}
            >
              <CreditCard className="size-8" />
              <span className="font-medium">QRIS / Online</span>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closePaymentModal} disabled={createPayment.isPending || updatePayment.isPending}>
          Batal
        </Button>
        <Button onClick={handlePayment} disabled={createPayment.isPending || updatePayment.isPending}>
          {createPayment.isPending || updatePayment.isPending
            ? "Memproses..."
            : paymentMethod === "cash"
            ? "Pesanan Selesai"
            : "Bayar dengan QRIS"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
