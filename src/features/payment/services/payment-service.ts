import { apiClient } from "@/services/api/client";
import type { ApiResponse } from "@/services/api/types";
import type { CreatePaymentRequest, PaymentResponse } from "../types";

export class PaymentService {
  static async getAll(): Promise<ApiResponse<import("../types").Payment[]>> {
    return apiClient<ApiResponse<import("../types").Payment[]>>("/api/payments");
  }

  static async create(
    payload: CreatePaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    return apiClient<ApiResponse<PaymentResponse>>("/api/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(
    id: number,
    payload: import("../types").UpdatePaymentRequest
  ): Promise<ApiResponse<any>> {
    return apiClient<ApiResponse<any>>(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async sync(id: number): Promise<ApiResponse<any>> {
    return apiClient<ApiResponse<any>>(`/api/payments/${id}/sync`, {
      method: "POST",
    });
  }
}
