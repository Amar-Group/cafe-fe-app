import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { CreateReservationRequest, UpdateReservationRequest, Reservation } from "../types";

export class ReservationService {
  static async getAll(): Promise<ApiResponse<Reservation[]>> {
    return apiClient<ApiResponse<Reservation[]>>("/api/reservations");
  }

  static async getById(id: number): Promise<ApiResponse<Reservation>> {
    return apiClient<ApiResponse<Reservation>>(`/api/reservations/${id}`);
  }

  static async create(payload: CreateReservationRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/reservations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(id: number, payload: UpdateReservationRequest): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/reservations/${id}`, {
      method: "DELETE",
    });
  }
}
