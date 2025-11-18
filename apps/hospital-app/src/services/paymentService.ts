import { apiClient } from './api';

/**
 * Payment Service for Hospital App
 * 병원앱에서 결제 승인 관련 API 호출
 */

export interface Payment {
  id: number;
  externalId: string;
  appointmentId: number;
  patientId: number;
  hospitalId: number;
  totalAmount: number;
  currency: string;
  consultationFee?: number;
  medicationFee?: number;
  shippingFee?: number;
  platformFee?: number;
  paymentMethod: string;
  paymentProvider: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  omiseChargeId?: string;
  paidAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Approve payment (병원 입금 확인)
 * 병원이 환자 결제를 확인하고 승인
 * 승인 후 배송 시작됨 (처방전이 있는 경우)
 */
export async function approvePayment(paymentId: number): Promise<Payment> {
  const response = await apiClient.post<Payment>(`/api/v1/payments/${paymentId}/approve`);
  return response.data;
}

/**
 * Get payment by ID
 */
export async function getPayment(paymentId: number): Promise<Payment> {
  const response = await apiClient.get<Payment>(`/api/v1/payments/${paymentId}`);
  return response.data;
}

/**
 * Get payment by appointment ID
 */
export async function getPaymentByAppointment(appointmentId: number): Promise<Payment> {
  const response = await apiClient.get<Payment>(`/api/v1/payments/appointment/${appointmentId}`);
  return response.data;
}

/**
 * Get hospital payments
 */
export async function getHospitalPayments(hospitalId: number): Promise<Payment[]> {
  const response = await apiClient.get<Payment[]>(`/api/v1/payments/hospital/${hospitalId}`);
  return response.data;
}

const paymentService = {
  approvePayment,
  getPayment,
  getPaymentByAppointment,
  getHospitalPayments,
};

export default paymentService;
