import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleService } from "../services/schedule-service";
import type { CreateScheduleRequest, UpdateScheduleRequest } from "../types";

export const SCHEDULE_KEYS = {
  all: ["schedules"] as const,
  lists: () => [...SCHEDULE_KEYS.all, "list"] as const,
  list: (filters: string) => [...SCHEDULE_KEYS.lists(), { filters }] as const,
  details: () => [...SCHEDULE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SCHEDULE_KEYS.details(), id] as const,
};

export function useSchedules() {
  return useQuery({
    queryKey: SCHEDULE_KEYS.lists(),
    queryFn: async () => {
      const res = await ScheduleService.getAll();
      return res.data;
    },
  });
}

export function useSchedule(id: number) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.detail(id),
    queryFn: async () => {
      const res = await ScheduleService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => ScheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.lists() });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleRequest }) =>
      ScheduleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ScheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.lists() });
    },
  });
}
