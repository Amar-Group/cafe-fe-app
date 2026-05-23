import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { Dish, CreateDishRequest, UpdateDishRequest } from "../types";

export class DishService {
  static async getAll(): Promise<ApiResponse<Dish[]>> {
    return apiClient<ApiResponse<Dish[]>>("/api/dishes");
  }

  static async getById(id: number): Promise<ApiResponse<Dish>> {
    return apiClient<ApiResponse<Dish>>(`/api/dishes/${id}`);
  }

  static async create(payload: CreateDishRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/dishes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateDishRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dishes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dishes/${id}`, {
      method: "DELETE",
    });
  }
}
