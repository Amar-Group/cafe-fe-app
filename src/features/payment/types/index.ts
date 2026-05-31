export type CreatePaymentRequest = {
  type: "dish_order" | "reservation";
  dish_order_id?: number | null;
  reservation_id?: number | null;
  method: "qris" | "bank_transfer" | "cash" | "ewallet" | "credit_card";
  provider: "midtrans" | "xendit" | "manual" | "cashier";
  gross_amount: string;
};

export type PaymentResponse = {
  id: number;
  snap_token?: string;
  url?: string;
  transaction_id?: string;
};

export type UpdatePaymentRequest = {
  status?: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded";
  paid_at?: string | null;
};

export type Payment = {
  id: number;
  type: "dish_order" | "reservation";
  dish_order_id?: number | null;
  reservation_id?: number | null;
  method: string;
  provider: string;
  transaction_id?: string | null;
  gross_amount: string;
  status: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded";
  url?: string | null;
  snap_token?: string | null;
  paid_at?: string | null;
  expired_at?: string | null;
  created_at: string;
  updated_at: string;
  dish_order?: any;
  reservation?: any;
};
