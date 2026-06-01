import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DishOrderService } from "../services/dish-order-service";
import type { CreateDishOrderRequest, UpdateDishOrderRequest } from "../types";

export const DISH_ORDER_KEYS = {
  all: ["dish-orders"] as const,
  lists: () => [...DISH_ORDER_KEYS.all, "list"] as const,
  details: () => [...DISH_ORDER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DISH_ORDER_KEYS.details(), id] as const,
};

export function useDishOrders(options?: any) {
  return useQuery({
    queryKey: DISH_ORDER_KEYS.lists(),
    queryFn: async () => {
      const res = await DishOrderService.getAll();
      return res.data;
    },
    refetchInterval: 5000,
    ...options,
  });
}

export function useDishOrder(id: number, options?: any) {
  return useQuery({
    queryKey: DISH_ORDER_KEYS.detail(id),
    queryFn: async () => {
      const res = await DishOrderService.getById(id);
      return res.data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateDishOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDishOrderRequest) => DishOrderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
    },
  });
}

export function useUpdateDishOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDishOrderRequest }) =>
      DishOrderService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteDishOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DishOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
    },
  });
}
