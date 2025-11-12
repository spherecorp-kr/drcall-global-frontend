import { apiClient } from './api';
import type { DeliveryAddress, CreateDeliveryAddressRequest, UpdateDeliveryAddressRequest } from '@/types/delivery';

/**
 * Delivery Address Service - 백엔드 API 연동
 * Fixed: Use /api/v1/delivery-addresses with patientId as query parameter
 */
export const deliveryService = {
  /**
   * Get all delivery addresses for a patient
   * GET /api/v1/delivery-addresses?patientId={patientId}
   */
  getDeliveryAddresses: async (patientId: number): Promise<DeliveryAddress[]> => {
    const response = await apiClient.get('/api/v1/delivery-addresses', {
      params: { patientId },
    });
    return response.data;
  },

  /**
   * Get delivery address by ID
   * GET /api/v1/delivery-addresses/{id}?patientId={patientId}
   */
  getDeliveryAddress: async (patientId: number, addressId: string): Promise<DeliveryAddress> => {
    const response = await apiClient.get(`/api/v1/delivery-addresses/${addressId}`, {
      params: { patientId },
    });
    return response.data;
  },

  /**
   * Create new delivery address
   * POST /api/v1/delivery-addresses?patientId={patientId}
   */
  createDeliveryAddress: async (patientId: number, data: CreateDeliveryAddressRequest): Promise<DeliveryAddress> => {
    const response = await apiClient.post('/api/v1/delivery-addresses', data, {
      params: { patientId },
    });
    return response.data;
  },

  /**
   * Update delivery address
   * PUT /api/v1/delivery-addresses/{id}?patientId={patientId}
   */
  updateDeliveryAddress: async (
    patientId: number,
    addressId: string,
    data: UpdateDeliveryAddressRequest
  ): Promise<DeliveryAddress> => {
    const response = await apiClient.put(`/api/v1/delivery-addresses/${addressId}`, data, {
      params: { patientId },
    });
    return response.data;
  },

  /**
   * Delete delivery address
   * DELETE /api/v1/delivery-addresses/{id}?patientId={patientId}
   */
  deleteDeliveryAddress: async (patientId: number, addressId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/delivery-addresses/${addressId}`, {
      params: { patientId },
    });
  },
};
