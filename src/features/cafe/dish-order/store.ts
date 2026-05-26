import { createCrudStore } from "@/stores/create-crud-store";
import type { DishOrder, DishOrderDetail } from "./types";
import { create } from "zustand";

// Standard CRUD store for Dish Orders (Headers)
export const useDishOrderStore = createCrudStore<DishOrder>();

// Standard CRUD store for Dish Order Details (Items)
export const useDishOrderDetailStore = createCrudStore<DishOrderDetail>();

type PaymentModalState = {
  isPaymentModalOpen: boolean;
  selectedOrderForPayment: DishOrder | null;
  openPaymentModal: (order: DishOrder) => void;
  closePaymentModal: () => void;
};

export const useDishOrderPaymentStore = create<PaymentModalState>((set) => ({
  isPaymentModalOpen: false,
  selectedOrderForPayment: null,
  openPaymentModal: (order) => set({ isPaymentModalOpen: true, selectedOrderForPayment: order }),
  closePaymentModal: () => set({ isPaymentModalOpen: false, selectedOrderForPayment: null }),
}));
