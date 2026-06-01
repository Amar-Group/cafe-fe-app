import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReservationService } from "../services/reservation-service";
import type { CreateReservationRequest, UpdateReservationRequest } from "../types";

export const RESERVATION_KEYS = {
  all: ["reservations"] as const,
  lists: () => [...RESERVATION_KEYS.all, "list"] as const,
  details: () => [...RESERVATION_KEYS.all, "detail"] as const,
  detail: (id: number) => [...RESERVATION_KEYS.details(), id] as const,
};

export function useReservations(options?: any) {
  return useQuery({
    queryKey: RESERVATION_KEYS.lists(),
    queryFn: async () => {
      const res = await ReservationService.getAll();
      return res.data;
    },
    refetchInterval: 5000,
    ...options,
  });
}

export function useReservation(id: number, options?: any) {
  return useQuery({
    queryKey: RESERVATION_KEYS.detail(id),
    queryFn: async () => {
      const res = await ReservationService.getById(id);
      return res.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => ReservationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.lists() });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReservationRequest }) =>
      ReservationService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ReservationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.lists() });
    },
  });
}
