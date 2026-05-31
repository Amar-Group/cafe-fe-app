import { apiClient } from "@/services/api/client";
import type { ApiResponse, WriteResult } from "@/services/api/types";
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest } from "../types";

export class ScheduleService {
  static async getAll(): Promise<ApiResponse<Schedule[]>> {
    return apiClient<ApiResponse<Schedule[]>>("/api/schedules");
  }

  static async getById(id: number): Promise<ApiResponse<Schedule>> {
    return apiClient<ApiResponse<Schedule>>(`/api/schedules/${id}`);
  }

  static async create(
    payload: CreateScheduleRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>("/api/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async update(
    id: number,
    payload: UpdateScheduleRequest
  ): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async delete(id: number): Promise<ApiResponse<WriteResult>> {
    return apiClient<ApiResponse<WriteResult>>(`/api/schedules/${id}`, {
      method: "DELETE",
    });
  }
}
