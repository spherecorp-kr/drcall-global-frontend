import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  paymentService,
  type CreatePaymentRequest,
  type PaymentResponse,
} from '../../services/paymentService';

/**
 * Payment Query Keys
 */
export const paymentKeys = {
  all: ['payments'] as const,
  detail: (id: number) => [...paymentKeys.all, 'detail', id] as const,
  byAppointment: (appointmentId: number) =>
    [...paymentKeys.all, 'appointment', appointmentId] as const,
};

/**
 * 결제 조회 (ID)
 */
export function usePayment(paymentId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId!),
    queryFn: () => paymentService.getPayment(paymentId!),
    enabled: enabled && !!paymentId,
    staleTime: 30 * 1000, // 30초
  });
}

/**
 * 결제 조회 (Appointment ID)
 */
export function usePaymentByAppointment(appointmentId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.byAppointment(appointmentId!),
    queryFn: () => paymentService.getPaymentByAppointment(appointmentId!),
    enabled: enabled && !!appointmentId,
    retry: 1, // 결제가 없을 수 있으므로 재시도 1회만
    staleTime: 30 * 1000,
  });
}

/**
 * 결제 생성
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.createPayment(data),
    onSuccess: (payment: PaymentResponse) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byAppointment(payment.appointmentId),
      });
    },
  });
}

/**
 * 결제 환불
 */
export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number; reason?: string }) =>
      paymentService.refundPayment(paymentId, reason),
    onSuccess: (payment: PaymentResponse) => {
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(payment.id) });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.byAppointment(payment.appointmentId),
      });
    },
  });
}
