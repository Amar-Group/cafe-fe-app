import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type {
  DishCategory,
  CreateDishCategoryRequest,
  UpdateDishCategoryRequest,
} from "../types";

export class DishCategoryService {
  static async getAll(): Promise<ApiResponse<DishCategory[]>> {
    return apiClient<ApiResponse<DishCategory[]>>("/api/dish-categories");
  }

  static async getPublic(): Promise<ApiResponse<DishCategory[]>> {
    return apiClient<ApiResponse<DishCategory[]>>("/api/public/dish-categories", {
      skipAuth: true,
    });
  }

  static async getById(id: number): Promise<ApiResponse<DishCategory>> {
    return apiClient<ApiResponse<DishCategory>>(`/api/dish-categories/${id}`);
  }

  static async create(
    payload: CreateDishCategoryRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/dish-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(
    id: number,
    payload: UpdateDishCategoryRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/dish-categories/${id}`, {
      method: "DELETE",
    });
  }
}
