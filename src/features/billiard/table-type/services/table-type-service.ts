import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type {
  BilliardTableType,
  CreateBilliardTableTypeRequest,
  UpdateBilliardTableTypeRequest,
} from "../types";

export class BilliardTableTypeService {
  static async getAll(): Promise<ApiResponse<BilliardTableType[]>> {
    return apiClient<ApiResponse<BilliardTableType[]>>("/api/billiard-table-types");
  }

  static async getPublicAll(): Promise<ApiResponse<BilliardTableType[]>> {
    return apiClient<ApiResponse<BilliardTableType[]>>("/api/public/billiard-table-types");
  }

  static async getById(id: number): Promise<ApiResponse<BilliardTableType>> {
    return apiClient<ApiResponse<BilliardTableType>>(`/api/billiard-table-types/${id}`);
  }

  static async create(
    payload: CreateBilliardTableTypeRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/billiard-table-types", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(
    id: number,
    payload: UpdateBilliardTableTypeRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-table-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/billiard-table-types/${id}`, {
      method: "DELETE",
    });
  }
}
