import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { CreateBilliardTableImageRequest, UpdateBilliardTableImageRequest, BilliardTableImage } from "../types";

export class BilliardTableImageService {
  static async getAll(): Promise<ApiResponse<BilliardTableImage[]>> {
    return apiClient<ApiResponse<BilliardTableImage[]>>("/api/billiard-table-images");
  }

  static async getById(id: number): Promise<ApiResponse<BilliardTableImage>> {
    return apiClient<ApiResponse<BilliardTableImage>>(`/api/billiard-table-images/${id}`);
  }

  static async create(payload: CreateBilliardTableImageRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/billiard-table-images", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateBilliardTableImageRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-table-images/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-table-images/${id}`, {
      method: "DELETE",
    });
  }
}
