import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DishImageService } from "../services/dish-image-service";
import type { CreateDishImageRequest, UpdateDishImageRequest } from "../types";

export const DISH_IMAGE_KEYS = {
  all: ["dish-images"] as const,
  lists: () => [...DISH_IMAGE_KEYS.all, "list"] as const,
  details: () => [...DISH_IMAGE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DISH_IMAGE_KEYS.details(), id] as const,
};

export function useDishImages() {
  return useQuery({
    queryKey: DISH_IMAGE_KEYS.lists(),
    queryFn: async () => {
      const res = await DishImageService.getAll();
      return res.data;
    },
  });
}

export function useDishImage(id: number) {
  return useQuery({
    queryKey: DISH_IMAGE_KEYS.detail(id),
    queryFn: async () => {
      const res = await DishImageService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateDishImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDishImageRequest) => DishImageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_IMAGE_KEYS.lists() });
    },
  });
}

export function useUpdateDishImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDishImageRequest }) =>
      DishImageService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DISH_IMAGE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DISH_IMAGE_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteDishImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DishImageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_IMAGE_KEYS.lists() });
    },
  });
}
