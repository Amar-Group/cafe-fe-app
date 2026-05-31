import { useMutation, useQuery } from "@tanstack/react-query";
import { PaymentService } from "../services/payment-service";
import type { CreatePaymentRequest } from "../types";

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await PaymentService.getAll();
      return res.data;
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => PaymentService.create(data),
  });
}

export function useUpdatePayment() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: import("../types").UpdatePaymentRequest }) =>
      PaymentService.update(id, data),
  });
}
