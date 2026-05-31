import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { DishImage, CreateDishImageRequest, UpdateDishImageRequest } from "../types";

export class DishImageService {
  static async getAll(): Promise<ApiResponse<DishImage[]>> {
    return apiClient<ApiResponse<DishImage[]>>("/api/dish-images");
  }

  static async getById(id: number): Promise<ApiResponse<DishImage>> {
    return apiClient<ApiResponse<DishImage>>(`/api/dish-images/${id}`);
  }

  static async create(payload: CreateDishImageRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/dish-images", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateDishImageRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-images/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-images/${id}`, {
      method: "DELETE",
    });
  }
}
