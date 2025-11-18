import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  shippingService,
  type Shipment,
  type ShipmentTracking,
} from '../../services/shippingService';

/**
 * Shipping Query Keys
 */
export const shippingKeys = {
  all: ['shipments'] as const,
  lists: () => [...shippingKeys.all, 'list'] as const,
  detail: (id: number) => [...shippingKeys.all, 'detail', id] as const,
  byAppointment: (appointmentId: number) =>
    [...shippingKeys.all, 'appointment', appointmentId] as const,
  byPatient: (patientId: number) => [...shippingKeys.all, 'patient', patientId] as const,
  tracking: (shipmentId: number) => [...shippingKeys.all, 'tracking', shipmentId] as const,
};

/**
 * 배송 조회 (ID)
 */
export function useShipment(shipmentId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: shippingKeys.detail(shipmentId!),
    queryFn: () => shippingService.getShipment(shipmentId!),
    enabled: enabled && !!shipmentId,
    staleTime: 30 * 1000, // 30초
  });
}

/**
 * 배송 조회 (Appointment ID)
 */
export function useShipmentByAppointment(appointmentId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: shippingKeys.byAppointment(appointmentId!),
    queryFn: () => shippingService.getShipmentByAppointment(appointmentId!),
    enabled: enabled && !!appointmentId,
    retry: 1, // 배송이 없을 수 있으므로 재시도 1회만
    staleTime: 30 * 1000,
  });
}

/**
 * 환자의 배송 목록 조회
 */
export function usePatientShipments(patientId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: shippingKeys.byPatient(patientId!),
    queryFn: () => shippingService.getPatientShipments(patientId!),
    enabled: enabled && !!patientId,
    staleTime: 60 * 1000, // 1분
  });
}

/**
 * 배송 추적 정보 조회 (폴링)
 */
export function useShipmentTracking(shipmentId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: shippingKeys.tracking(shipmentId!),
    queryFn: () => shippingService.getTracking(shipmentId!),
    enabled: enabled && !!shipmentId,
    staleTime: 0, // 항상 최신 데이터
    refetchInterval: 30 * 1000, // 30초마다 자동 새로고침 (실시간 추적)
  });
}

/**
 * 배송 취소
 */
export function useCancelShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shipmentId, reason }: { shipmentId: number; reason?: string }) =>
      shippingService.cancelShipment(shipmentId, reason),
    onSuccess: (shipment: Shipment) => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.detail(shipment.id) });
      queryClient.invalidateQueries({
        queryKey: shippingKeys.byAppointment(shipment.appointmentId),
      });
      queryClient.invalidateQueries({ queryKey: shippingKeys.byPatient(shipment.patientId) });
    },
  });
}
