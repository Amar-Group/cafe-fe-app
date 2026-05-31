export type DishOrder = {
  id: number;
  guest_name: string;
  guest_phone: string;
  total: string;
  tax: string;
  service_fee: string;
  nett_price: string;
  payment_status?: string | null;
  payment_method?: string | null;
  status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type CreateDishOrderRequest = {
  guest_name: string;
  guest_phone: string;
  total: string;
  tax: string;
  service_fee: string;
  nett_price: string;
  status?: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
};

export type UpdateDishOrderRequest = Partial<CreateDishOrderRequest>;

export type DishOrderDetail = {
  id: number;
  dish_order_id: number;
  dish_id: number;
  quantity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateDishOrderDetailRequest = {
  dish_order_id: number;
  dish_id: number;
  quantity: number;
  notes?: string | null;
};

export type UpdateDishOrderDetailRequest = Partial<CreateDishOrderDetailRequest>;
