import { apiClient } from './api';

/**
 * Payment Service
 * 결제 관련 API 호출
 */

export interface CreatePaymentRequest {
  appointmentId: number;
  patientId: number;
  hospitalId: number;
  amount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_BANKING' | 'PROMPTPAY' | 'QR_CODE';
  omiseToken?: string; // OMISE.js로 생성한 카드 토큰 (tok_xxx)
  omiseSource?: string; // OMISE.js로 생성한 소스 (src_xxx) - PromptPay, 모바일 뱅킹 등
}

export interface PaymentResponse {
  id: number;
  externalId: string;
  appointmentId: number;
  patientId: number;
  hospitalId: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  omiseChargeId?: string;
  authorizeUri?: string; // 3D Secure 인증 URL (카드 결제 시)
  paidAt?: string;
  failureCode?: string;
  failureMessage?: string;
  createdAt: string;
}

export const paymentService = {
  /**
   * 결제 생성
   */
  createPayment: async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
    // Idempotency Key 생성 (중복 결제 방지)
    const idempotencyKey = `pay_${data.appointmentId}_${Date.now()}`;

    const response = await apiClient.post<PaymentResponse>('/api/v1/payments', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });

    return response.data;
  },

  /**
   * 결제 조회 (ID)
   */
  getPayment: async (paymentId: number): Promise<PaymentResponse> => {
    const response = await apiClient.get<PaymentResponse>(`/api/v1/payments/${paymentId}`);
    return response.data;
  },

  /**
   * 결제 조회 (Appointment ID)
   */
  getPaymentByAppointment: async (appointmentId: number): Promise<PaymentResponse> => {
    const response = await apiClient.get<PaymentResponse>(
      `/api/v1/payments/appointment/${appointmentId}`
    );
    return response.data;
  },

  /**
   * 결제 취소 (환불)
   */
  refundPayment: async (paymentId: number, reason?: string): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>(
      `/api/v1/payments/${paymentId}/refund`,
      { reason }
    );
    return response.data;
  },
};
