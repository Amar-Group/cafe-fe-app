import { createCrudStore } from "@/stores/create-crud-store";
import { create } from "zustand";
import type { Reservation } from "./types";

export const useReservationStore = createCrudStore<Reservation>();

type ReservationPaymentState = {
  reservationPayment: Reservation | null;
  openPaymentModal: (reservation: Reservation) => void;
  closePaymentModal: () => void;
};

export const useReservationPaymentStore = create<ReservationPaymentState>((set) => ({
  reservationPayment: null,
  openPaymentModal: (reservation) => set({ reservationPayment: reservation }),
  closePaymentModal: () => set({ reservationPayment: null }),
}));
