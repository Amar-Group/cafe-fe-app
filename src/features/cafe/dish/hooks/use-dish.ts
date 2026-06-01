import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DishService } from "../services/dish-service";
import type { CreateDishRequest, UpdateDishRequest } from "../types";

export const DISH_KEYS = {
  all: ["dishes"] as const,
  lists: () => [...DISH_KEYS.all, "list"] as const,
  details: () => [...DISH_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DISH_KEYS.details(), id] as const,
  public: () => [...DISH_KEYS.all, "public"] as const,
};

export function useDishes() {
  return useQuery({
    queryKey: DISH_KEYS.lists(),
    queryFn: async () => {
      const res = await DishService.getAll();
      return res.data;
    },
  });
}

export function usePublicDishes() {
  return useQuery({
    queryKey: DISH_KEYS.public(),
    queryFn: async () => {
      const res = await DishService.getPublic();
      return res.data;
    },
  });
}

export function useDish(id: number) {
  return useQuery({
    queryKey: DISH_KEYS.detail(id),
    queryFn: async () => {
      const res = await DishService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDishRequest) => DishService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_KEYS.lists() });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDishRequest }) =>
      DishService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DISH_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DISH_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DishService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_KEYS.lists() });
    },
  });
}
