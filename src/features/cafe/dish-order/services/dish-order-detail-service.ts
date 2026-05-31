import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { DishOrderDetail, CreateDishOrderDetailRequest, UpdateDishOrderDetailRequest } from "../types";

export class DishOrderDetailService {
  static async getAll(): Promise<ApiResponse<DishOrderDetail[]>> {
    return apiClient<ApiResponse<DishOrderDetail[]>>("/api/dish-order-details");
  }

  static async getById(id: number): Promise<ApiResponse<DishOrderDetail>> {
    return apiClient<ApiResponse<DishOrderDetail>>(`/api/dish-order-details/${id}`);
  }

  static async create(payload: CreateDishOrderDetailRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/dish-order-details", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateDishOrderDetailRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-order-details/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-order-details/${id}`, {
      method: "DELETE",
    });
  }
}
