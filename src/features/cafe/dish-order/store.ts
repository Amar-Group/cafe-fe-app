import { createCrudStore } from "@/stores/create-crud-store";
import type { DishOrder, DishOrderDetail } from "./types";

// Standard CRUD store for Dish Orders (Headers)
export const useDishOrderStore = createCrudStore<DishOrder>();

// Standard CRUD store for Dish Order Details (Items)
export const useDishOrderDetailStore = createCrudStore<DishOrderDetail>();
