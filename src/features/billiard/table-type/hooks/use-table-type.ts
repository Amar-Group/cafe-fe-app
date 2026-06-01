import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BilliardTableTypeService } from "../services/table-type-service";
import type {
  CreateBilliardTableTypeRequest,
  UpdateBilliardTableTypeRequest,
} from "../types";

export const BILLIARD_TABLE_TYPE_KEYS = {
  all: ["billiard-table-types"] as const,
  lists: () => [...BILLIARD_TABLE_TYPE_KEYS.all, "list"] as const,
  details: () => [...BILLIARD_TABLE_TYPE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BILLIARD_TABLE_TYPE_KEYS.details(), id] as const,
};

export function useBilliardTableTypes() {
  return useQuery({
    queryKey: BILLIARD_TABLE_TYPE_KEYS.lists(),
    queryFn: async () => {
      const res = await BilliardTableTypeService.getAll();
      return res.data;
    },
  });
}

export function usePublicBilliardTableTypes() {
  return useQuery({
    queryKey: [...BILLIARD_TABLE_TYPE_KEYS.lists(), "public"],
    queryFn: async () => {
      const res = await BilliardTableTypeService.getPublicAll();
      return res.data;
    },
  });
}

export function useBilliardTableType(id: number) {
  return useQuery({
    queryKey: BILLIARD_TABLE_TYPE_KEYS.detail(id),
    queryFn: async () => {
      const res = await BilliardTableTypeService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateBilliardTableType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBilliardTableTypeRequest) =>
      BilliardTableTypeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_TYPE_KEYS.lists() });
    },
  });
}

export function useUpdateBilliardTableType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBilliardTableTypeRequest }) =>
      BilliardTableTypeService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_TYPE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: BILLIARD_TABLE_TYPE_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteBilliardTableType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => BilliardTableTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_TYPE_KEYS.lists() });
    },
  });
}
