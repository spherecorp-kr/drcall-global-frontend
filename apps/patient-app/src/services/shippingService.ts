import { apiClient } from './api';

/**
 * Shipping Service
 * 배송 추적 및 관리 API
 */

export interface Shipment {
  id: number;
  externalId: string;
  appointmentId: number;
  patientId: number;
  hospitalId: number;

  // Sender
  senderName: string;
  senderPhone: string;
  senderAddress: string;

  // Recipient
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientProvince?: string;
  recipientDistrict?: string;
  recipientPostcode?: string;

  // Shipment details
  courierCode: string; // THAILAND_POST, KERRY_EXPRESS, etc.
  trackingNumber?: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

  // SHIPPOP
  shippopPurchaseId?: string;

  // Timestamps
  shippedAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  datetime: string; // ISO 8601
  description: string;
  location?: string;
}

export interface ShipmentTracking {
  shipmentId: number;
  trackingNumber: string;
  status: string;
  courierCode: string;
  trackingHistory: TrackingEvent[];
}

// ===== Shipping Fee Calculation =====

export interface ShippingFeeCalculationRequest {
  fromProvince: string;
  fromDistrict: string;
  fromPostcode?: string;
  toProvince: string;
  toDistrict: string;
  toPostcode?: string;
  parcelWeight?: number; // kg, default: 0.5
  parcelValue?: number; // THB, default: 100
}

export interface CourierOption {
  code: string; // "FLE", "KEX", "TP"
  name: string; // "Flash Express", "Kerry Express"
  fee: number; // THB
  deliveryTime: string; // "1-2 days"
}

export interface ShippingFeeCalculationResponse {
  shippingFee: number; // 기본 선택된 배송비 (THB)
  courierCode: string; // 기본 선택된 택배사 코드
  estimatedDeliveryTime: string; // 예상 배송 시간
  courierOptions: CourierOption[]; // 선택 가능한 택배사 옵션들
  fallback: boolean; // Fallback 여부 (SHIPPOP API 실패 시)
}

export const shippingService = {
  /**
   * 배송비 계산
   *
   * 배송지 정보를 기반으로 실제 배송비를 조회합니다.
   * Frontend에서 결제 전에 호출하여 정확한 총액을 계산합니다.
   *
   * POST /api/v1/shipments/calculate-fee
   */
  calculateFee: async (
    request: ShippingFeeCalculationRequest
  ): Promise<ShippingFeeCalculationResponse> => {
    const response = await apiClient.post<ShippingFeeCalculationResponse>(
      '/api/v1/shipments/calculate-fee',
      {
        ...request,
        parcelWeight: request.parcelWeight ?? 0.5,
        parcelValue: request.parcelValue ?? 100,
      }
    );
    return response.data;
  },

  /**
   * 배송 조회 (Appointment ID)
   */
  getShipmentByAppointment: async (appointmentId: number): Promise<Shipment> => {
    const response = await apiClient.get<Shipment>(
      `/api/v1/shipments/appointment/${appointmentId}`
    );
    return response.data;
  },

  /**
   * 배송 조회 (ID)
   */
  getShipment: async (shipmentId: number): Promise<Shipment> => {
    const response = await apiClient.get<Shipment>(`/api/v1/shipments/${shipmentId}`);
    return response.data;
  },

  /**
   * 환자의 배송 목록 조회
   */
  getPatientShipments: async (patientId: number): Promise<Shipment[]> => {
    const response = await apiClient.get<Shipment[]>(
      `/api/v1/shipments/patient/${patientId}`
    );
    return response.data;
  },

  /**
   * 배송 추적 정보 조회
   */
  getTracking: async (shipmentId: number): Promise<ShipmentTracking> => {
    const response = await apiClient.get<ShipmentTracking>(
      `/api/v1/shipments/${shipmentId}/tracking`
    );
    return response.data;
  },

  /**
   * 배송 취소
   */
  cancelShipment: async (shipmentId: number, reason?: string): Promise<Shipment> => {
    const response = await apiClient.post<Shipment>(
      `/api/v1/shipments/${shipmentId}/cancel`,
      { reason }
    );
    return response.data;
  },
};
