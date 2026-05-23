import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { DishOrder, CreateDishOrderRequest, UpdateDishOrderRequest } from "../types";

export class DishOrderService {
  static async getAll(): Promise<ApiResponse<DishOrder[]>> {
    return apiClient<ApiResponse<DishOrder[]>>("/api/dish-orders");
  }

  static async getById(id: number): Promise<ApiResponse<DishOrder>> {
    return apiClient<ApiResponse<DishOrder>>(`/api/dish-orders/${id}`);
  }

  static async create(payload: CreateDishOrderRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/dish-orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateDishOrderRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-orders/${id}`, {
      method: "DELETE",
    });
  }
}
