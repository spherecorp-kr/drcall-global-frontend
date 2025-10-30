import { apiClient } from './api';

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
    department: string;
  };
  symptoms: string;
  symptomImages: string[];
  paymentStatus?: 'pending_payment' | 'payment_complete';
}

export interface CreateAppointmentRequest {
  appointmentType: 'standard' | 'quick';
  hospitalId?: string;
  doctorId?: string;
  dateTime?: string;
  symptoms: string;
  symptomImages?: string[];
  questionnaireAnswers: {
    height: string;
    weight: string;
    bloodType: string;
    alcohol: string;
    smoking: string;
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
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/api/v1/appointments', data);
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
