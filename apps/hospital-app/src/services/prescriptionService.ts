import apiClient from './api';

/**
 * 처방전 약물 정보
 */
export interface PrescriptionMedication {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

/**
 * 처방전 생성 요청
 */
export interface PrescriptionCreateRequest {
  appointmentId: number;
  diagnosis: string;
  medications: PrescriptionMedication[];
  additionalInstructions?: string;
  followUpDate?: string; // YYYY-MM-DD
}

/**
 * 처방전 수정 요청
 */
export interface PrescriptionUpdateRequest {
  diagnosis?: string;
  medications?: PrescriptionMedication[];
  additionalInstructions?: string;
  followUpDate?: string; // YYYY-MM-DD
}

/**
 * 처방전 응답
 */
export interface PrescriptionResponse {
  id: number;
  externalId: string;
  appointmentId: number;
  hospitalId: number;
  patientId: number;
  doctorId: number;
  status: 'DRAFT' | 'ISSUED' | 'DISPENSED' | 'COMPLETED';
  diagnosis: string;
  medications: PrescriptionMedication[];
  additionalInstructions: string | null;
  followUpDate: string | null; // YYYY-MM-DD
  issuedAt: string | null; // ISO 8601
  dispensedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 처방전 서비스
 */
export const prescriptionService = {
  /**
   * 예약별 처방전 조회
   * GET /api/v1/prescriptions/appointment/{appointmentId}
   */
  getPrescriptionByAppointmentId: async (appointmentId: number): Promise<PrescriptionResponse> => {
    const response = await apiClient.get<PrescriptionResponse>(
      `/api/v1/prescriptions/appointment/${appointmentId}`
    );
    return response.data;
  },

  /**
   * 처방전 생성
   * POST /api/v1/prescriptions
   */
  createPrescription: async (data: PrescriptionCreateRequest): Promise<PrescriptionResponse> => {
    const response = await apiClient.post<PrescriptionResponse>('/api/v1/prescriptions', data);
    return response.data;
  },

  /**
   * 처방전 수정
   * PUT /api/v1/prescriptions/appointment/{appointmentId}
   */
  updatePrescription: async (
    appointmentId: number,
    data: PrescriptionUpdateRequest
  ): Promise<PrescriptionResponse> => {
    const response = await apiClient.put<PrescriptionResponse>(
      `/api/v1/prescriptions/appointment/${appointmentId}`,
      data
    );
    return response.data;
  },

  /**
   * 처방전 발행 (DRAFT → ISSUED)
   * POST /api/v1/prescriptions/appointment/{appointmentId}/issue
   */
  issuePrescription: async (appointmentId: number): Promise<PrescriptionResponse> => {
    const response = await apiClient.post<PrescriptionResponse>(
      `/api/v1/prescriptions/appointment/${appointmentId}/issue`
    );
    return response.data;
  },
};
