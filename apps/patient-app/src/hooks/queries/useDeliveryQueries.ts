import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deliveryService,
  type DeliveryAddressInput,
} from '../../services/deliveryService';

/**
 * Delivery Address Query Keys
 */
export const deliveryKeys = {
  all: ['deliveryAddresses'] as const,
  lists: () => [...deliveryKeys.all, 'list'] as const,
  detail: (id: string) => [...deliveryKeys.all, 'detail', id] as const,
};

/**
 * 배송지 목록 조회
 */
export function useDeliveryAddresses() {
  return useQuery({
    queryKey: deliveryKeys.lists(),
    queryFn: () => deliveryService.getAddresses(),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 배송지 상세 조회
 */
export function useDeliveryAddress(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: deliveryKeys.detail(id!),
    queryFn: () => deliveryService.getAddress(id!),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 배송지 추가
 */
export function useCreateDeliveryAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeliveryAddressInput) => deliveryService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.lists() });
    },
  });
}

/**
 * 배송지 수정
 */
export function useUpdateDeliveryAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryAddressInput> }) =>
      deliveryService.updateAddress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.detail(variables.id) });
    },
  });
}

/**
 * 배송지 삭제
 */
export function useDeleteDeliveryAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.lists() });
    },
  });
}

/**
 * 기본 배송지 설정
 */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.lists() });
    },
  });
}
