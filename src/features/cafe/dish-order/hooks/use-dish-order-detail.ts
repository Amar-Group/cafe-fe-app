import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DishOrderDetailService } from "../services/dish-order-detail-service";
import type { CreateDishOrderDetailRequest, UpdateDishOrderDetailRequest } from "../types";
import { DISH_ORDER_KEYS } from "./use-dish-order";

export const DISH_ORDER_DETAIL_KEYS = {
  all: ["dish-order-details"] as const,
  lists: () => [...DISH_ORDER_DETAIL_KEYS.all, "list"] as const,
  details: () => [...DISH_ORDER_DETAIL_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DISH_ORDER_DETAIL_KEYS.details(), id] as const,
};

export function useDishOrderDetails() {
  return useQuery({
    queryKey: DISH_ORDER_DETAIL_KEYS.lists(),
    queryFn: async () => {
      const res = await DishOrderDetailService.getAll();
      return res.data;
    },
  });
}

export function useCreateDishOrderDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDishOrderDetailRequest) => DishOrderDetailService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_DETAIL_KEYS.lists() });
      // Invalidate dish-orders too because totals are updated by backend
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
    },
  });
}

export function useUpdateDishOrderDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDishOrderDetailRequest }) =>
      DishOrderDetailService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_DETAIL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_DETAIL_KEYS.detail(variables.id) });
      // Invalidate dish-orders too because totals are updated by backend
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
    },
  });
}

export function useDeleteDishOrderDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => DishOrderDetailService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_DETAIL_KEYS.lists() });
      // Invalidate dish-orders too because totals are updated by backend
      queryClient.invalidateQueries({ queryKey: DISH_ORDER_KEYS.lists() });
    },
  });
}
