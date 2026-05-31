import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BilliardTableImageService } from "../services/table-image-service";
import type { CreateBilliardTableImageRequest, UpdateBilliardTableImageRequest } from "../types";

export const BILLIARD_TABLE_IMAGE_KEYS = {
  all: ["billiard-table-images"] as const,
  lists: () => [...BILLIARD_TABLE_IMAGE_KEYS.all, "list"] as const,
  details: () => [...BILLIARD_TABLE_IMAGE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BILLIARD_TABLE_IMAGE_KEYS.details(), id] as const,
};

export function useBilliardTableImages() {
  return useQuery({
    queryKey: BILLIARD_TABLE_IMAGE_KEYS.lists(),
    queryFn: async () => {
      const res = await BilliardTableImageService.getAll();
      return res.data;
    },
  });
}

export function useBilliardTableImage(id: number) {
  return useQuery({
    queryKey: BILLIARD_TABLE_IMAGE_KEYS.detail(id),
    queryFn: async () => {
      const res = await BilliardTableImageService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateBilliardTableImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBilliardTableImageRequest) => BilliardTableImageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_IMAGE_KEYS.lists() });
    },
  });
}

export function useUpdateBilliardTableImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBilliardTableImageRequest }) =>
      BilliardTableImageService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_IMAGE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_IMAGE_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteBilliardTableImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => BilliardTableImageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLIARD_TABLE_IMAGE_KEYS.lists() });
    },
  });
}
