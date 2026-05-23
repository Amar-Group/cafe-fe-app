import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DishCategoryService } from "../services/dish-category-service";
import type {
  CreateDishCategoryRequest,
  UpdateDishCategoryRequest,
} from "../types";

export const DISH_CATEGORY_KEYS = {
  all: ["dish-categories"] as const,
  lists: () => [...DISH_CATEGORY_KEYS.all, "list"] as const,
  details: () => [...DISH_CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DISH_CATEGORY_KEYS.details(), id] as const,
};

export function useDishCategories() {
  return useQuery({
    queryKey: DISH_CATEGORY_KEYS.lists(),
    queryFn: async () => {
      const res = await DishCategoryService.getAll();
      return res.data;
    },
  });
}

export function useDishCategory(id: number) {
  return useQuery({
    queryKey: DISH_CATEGORY_KEYS.detail(id),
    queryFn: async () => {
      const res = await DishCategoryService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDishCategoryRequest) =>
      DishCategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_CATEGORY_KEYS.lists() });
    },
  });
}

export function useUpdateDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDishCategoryRequest }) =>
      DishCategoryService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DISH_CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: DISH_CATEGORY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DishCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_CATEGORY_KEYS.lists() });
    },
  });
}
