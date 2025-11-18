import { apiClient } from './api';

/**
 * Delivery Address Service
 * 배송지 관리 API
 */

export interface DeliveryAddress {
  id: string;
  title: string; // 배송지 이름 (예: 집, 회사)
  recipientName: string;
  address: string;
  detailAddress?: string;
  province?: string;
  district?: string;
  postalCode?: string;
  phoneNumber: string;
  phoneCountryCode: string;
  isDefault: boolean;
  googlePlaceId?: string;
}

export interface DeliveryAddressInput {
  title: string;
  recipientName: string;
  address: string;
  detailAddress?: string;
  province?: string;
  district?: string;
  postalCode?: string;
  phoneNumber: string;
  phoneCountryCode: string;
  isDefault?: boolean;
  googlePlaceId?: string;
}

export const deliveryService = {
  /**
   * 배송지 목록 조회
   */
  getAddresses: async (): Promise<DeliveryAddress[]> => {
    const response = await apiClient.get<DeliveryAddress[]>('/api/v1/delivery-addresses');
    return response.data;
  },

  /**
   * 배송지 상세 조회
   */
  getAddress: async (id: string): Promise<DeliveryAddress> => {
    const response = await apiClient.get<DeliveryAddress>(`/api/v1/delivery-addresses/${id}`);
    return response.data;
  },

  /**
   * 배송지 추가
   */
  createAddress: async (data: DeliveryAddressInput): Promise<DeliveryAddress> => {
    const response = await apiClient.post<DeliveryAddress>('/api/v1/delivery-addresses', data);
    return response.data;
  },

  /**
   * 배송지 수정
   */
  updateAddress: async (id: string, data: Partial<DeliveryAddressInput>): Promise<DeliveryAddress> => {
    const response = await apiClient.put<DeliveryAddress>(
      `/api/v1/delivery-addresses/${id}`,
      data
    );
    return response.data;
  },

  /**
   * 배송지 삭제
   */
  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/delivery-addresses/${id}`);
  },

  /**
   * 기본 배송지 설정
   */
  setDefaultAddress: async (id: string): Promise<DeliveryAddress> => {
    const response = await apiClient.post<DeliveryAddress>(
      `/api/v1/delivery-addresses/${id}/set-default`
    );
    return response.data;
  },
};
