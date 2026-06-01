import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { CreateBilliardTableRequest, UpdateBilliardTableRequest, BilliardTable } from "../types";

export class BilliardTableService {
  static async getAll(): Promise<ApiResponse<BilliardTable[]>> {
    return apiClient<ApiResponse<BilliardTable[]>>("/api/billiard-tables");
  }

  static async getPublicAll(): Promise<ApiResponse<BilliardTable[]>> {
    return apiClient<ApiResponse<BilliardTable[]>>("/api/public/billiard-tables");
  }

  static async getById(id: number): Promise<ApiResponse<BilliardTable>> {
    return apiClient<ApiResponse<BilliardTable>>(`/api/billiard-tables/${id}`);
  }

  static async create(payload: CreateBilliardTableRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/billiard-tables", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateBilliardTableRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-tables/${id}`, {
      method: "DELETE",
    });
  }
}
