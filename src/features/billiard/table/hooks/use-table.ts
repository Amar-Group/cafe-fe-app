import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BilliardTableService } from "../services/table-service";
import type { CreateBilliardTableRequest, UpdateBilliardTableRequest } from "../types";

export const BILLIARD_TABLE_KEYS = {
  all: ["billiard-tables"] as const,
  lists: () => [...BILLIARD_TABLE_KEYS.all, "list"] as const,
  details: () => [...BILLIARD_TABLE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BILLIARD_TABLE_KEYS.details(), id] as const,
};

export function useBilliardTables() {
  return useQuery({
    queryKey: BILLIARD_TABLE_KEYS.lists(),
    queryFn: async () => {
      const res = await BilliardTableService.getAll();
      return res.data;
    },
  });
}

export function usePublicBilliardTables() {
  return useQuery({
    queryKey: [...BILLIARD_TABLE_KEYS.lists(), "public"],
    queryFn: async () => {
      const res = await BilliardTableService.getPublicAll();
      return res.data;
    },
  });
}

export function useBilliardTable(id: number) {
  return useQuery({
    queryKey: BILLIARD_TABLE_KEYS.detail(id),
    queryFn: async () => {
      const res = await BilliardTableService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateBilliardTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBilliardTableRequest) => BilliardTableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_KEYS.lists() });
    },
  });
}

export function useUpdateBilliardTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBilliardTableRequest }) =>
      BilliardTableService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteBilliardTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => BilliardTableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_KEYS.lists() });
    },
  });
}
