import { apiClient } from './api';
import { AlcoholConsumption, SmokingStatus, mapAlcoholToEnum, mapSmokingToEnum } from '@/types/appointment';

/**
 * Appointment types
 */
export interface Appointment {
  id: string;
  appointmentNumber: string;
  appointmentType: 'standard' | 'quick';
  status: 'pending_confirmation' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  hospital: {
    name: string;
    nameEn: string;
    phone: string;
  };
  dateTime: string;
  doctor: {
    name: string;
    nameEn: string;
    photo: string;
    specialty: string;
  };
  symptoms: string;
  symptomImages: string[];
  paymentStatus?: 'pending_payment' | 'payment_complete';
}

export interface CreateAppointmentRequest {
  // patientId는 patient-service에서 세션에서 자동으로 추가됨 (보안)
  appointmentType: 'standard' | 'quick';
  hospitalId?: string;
  doctorId?: string;
  dateTime?: string;
  symptoms: string;
  symptomImages?: string[];
  questionnaireAnswers: {
    height: string;
    weight: string;
    bloodType: 'A' | 'B' | 'O' | 'AB';
    alcohol: AlcoholConsumption | string;  // ENUM 또는 표시값 (서비스에서 변환)
    smoking: SmokingStatus | string;        // ENUM 또는 표시값 (서비스에서 변환)
    medications: string;
    personalHistory: string;
    familyHistory: string;
  };
}

export interface UpdateAppointmentRequest {
  doctorId?: string;
  dateTime?: string;
  symptoms?: string;
  symptomImages?: string[];
  questionnaireAnswers?: {
    height?: string;
    weight?: string;
    bloodType?: string;
    alcohol?: string;
    smoking?: string;
    medications?: string;
    personalHistory?: string;
    familyHistory?: string;
  };
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  hasMore: boolean;
}

/**
 * Appointment API Service
 */
export const appointmentService = {
  /**
   * Get all appointments with filters
   */
  getAppointments: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<AppointmentListResponse> => {
    const response = await apiClient.get<AppointmentListResponse>('/api/v1/appointments', {
      params: { status, page, limit },
    });
    return response.data;
  },

  /**
   * Get appointment by ID
   */
  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/api/v1/appointments/${id}`);
    return response.data;
  },

  /**
   * Create new appointment
   * 프론트엔드 표시값("0", "1~2" 등)을 ENUM으로 변환하여 전송
   * 백엔드 DTO 구조에 맞게 flat하게 변환
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    // questionnaireAnswers의 alcohol, smoking을 ENUM으로 변환
    const alcoholEnum = typeof data.questionnaireAnswers.alcohol === 'string' && 
                 ['0', '1~2', '3+'].includes(data.questionnaireAnswers.alcohol)
      ? mapAlcoholToEnum(data.questionnaireAnswers.alcohol)!
      : data.questionnaireAnswers.alcohol;
    
    const smokingEnum = typeof data.questionnaireAnswers.smoking === 'string' && 
                 ['0', '1~5', '6+'].includes(data.questionnaireAnswers.smoking)
      ? mapSmokingToEnum(data.questionnaireAnswers.smoking)!
      : data.questionnaireAnswers.smoking;

    // 백엔드 DTO 구조에 맞게 변환 (flat structure)
    // QUICK 타입: doctorId와 scheduledAt 제외 (병원이 나중에 할당)
    // STANDARD 타입: doctorId와 scheduledAt 필수
    // patientId는 patient-service에서 세션에서 자동으로 추가됨 (보안)
    const requestData: any = {
      hospitalId: data.hospitalId ? Number(data.hospitalId) : undefined,
      appointmentType: data.appointmentType.toUpperCase(), // 'standard' -> 'STANDARD', 'quick' -> 'QUICK'
      symptoms: data.symptoms,
      symptomImages: data.symptomImages,
      // Health questionnaire (flat structure)
      height: data.questionnaireAnswers.height,
      weight: data.questionnaireAnswers.weight,
      bloodType: data.questionnaireAnswers.bloodType,
      alcoholConsumption: alcoholEnum,
      smokingStatus: smokingEnum,
      medications: data.questionnaireAnswers.medications,
      personalHistory: data.questionnaireAnswers.personalHistory,
      familyHistory: data.questionnaireAnswers.familyHistory,
    };

    // STANDARD 타입일 때만 doctorId와 scheduledAt 추가
    if (data.appointmentType === 'standard') {
      requestData.doctorId = data.doctorId ? Number(data.doctorId) : undefined;
      requestData.scheduledAt = data.dateTime; // ISO 8601 string, 백엔드에서 Instant로 변환
    }
    // QUICK 타입: doctorId와 scheduledAt은 보내지 않음 (병원이 나중에 할당)
    
    const response = await apiClient.post<Appointment>('/api/v1/appointments', requestData);
    return response.data;
  },

  /**
   * Update appointment by ID
   */
  updateAppointment: async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.put<Appointment>(`/api/v1/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Cancel appointment by ID
   */
  cancelAppointment: async (id: string, reason?: string): Promise<void> => {
    await apiClient.delete(`/api/v1/appointments/${id}`, {
      data: { reason },
    });
  },
};

export default appointmentService;
