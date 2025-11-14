import { apiClient } from './api';

/**
 * Appointment types (matches backend AppointmentResponse)
 */
export interface Appointment {
  // IDs
  id: number;
  externalId: string;
  patientId: number;
  hospitalId: number;
  doctorId: number;

  // Type & Status
  appointmentType: 'STANDARD' | 'QUICK';
  consultationType: 'VIDEO_CALL' | 'CHAT' | 'PHONE';
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

  // Schedule
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;

  // Cancellation
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;

  // Symptoms & Notes
  symptoms: string;
  symptomImages: string[];
  patientNote: string | null;
  doctorNote: string | null;

  // Fees
  consultationFee: number | null;
  medicationFee: number | null;
  totalFee: number | null;
  currency: string;

  // Payment
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | null;
  paymentId: number | null;

  // Prescription
  hasPrescription: boolean | null;
  prescriptionUploadedAt: string | null;

  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  hasMore: boolean;
}

export interface ConfirmAppointmentRequest {
  scheduledAt?: string; // Hospital can adjust scheduled time
}

export interface CancelAppointmentRequest {
  cancelledBy: 'HOSPITAL' | 'PATIENT' | 'SYSTEM';
  cancellationReason: string;
}

export interface UpdateAppointmentRequest {
  scheduledAt?: string;
  symptoms?: string;
  symptomImages?: string[];
  patientNote?: string;
  doctorNote?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StartAppointmentRequest {
  // Empty for now, can add fields if needed
}

export interface CompleteAppointmentRequest {
  doctorNote?: string;
  consultationFee?: number;
  medicationFee?: number;
  prescriptionData?: {
    hasPrescription: boolean;
    // Add prescription fields as needed
  };
}

/**
 * Appointment API Service for Hospital App
 */
export const appointmentService = {
  /**
   * Get all appointments with filters
   * Hospital staff can view all appointments
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
   * Get appointment by ID (for hospital staff)
   */
  getAppointmentById: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/api/v1/appointments/${id}`);
    return response.data;
  },

  /**
   * Get appointment by external ID
   */
  getAppointmentByExternalId: async (externalId: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/api/v1/appointments/external/${externalId}`);
    return response.data;
  },

  /**
   * Confirm appointment
   * Changes status from PENDING to CONFIRMED
   */
  confirmAppointment: async (id: number, data?: ConfirmAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/confirm`, data || {});
    return response.data;
  },

  /**
   * Start appointment
   * Changes status from CONFIRMED to IN_PROGRESS
   */
  startAppointment: async (id: number, data?: StartAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/start`, data || {});
    return response.data;
  },

  /**
   * Complete appointment
   * Changes status from IN_PROGRESS to COMPLETED
   */
  completeAppointment: async (id: number, data?: CompleteAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/complete`, data || {});
    return response.data;
  },

  /**
   * Cancel appointment
   * Hospital can cancel appointments at any time
   */
  cancelAppointment: async (id: number, data: CancelAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/cancel`, data);
    return response.data;
  },

  /**
   * Update appointment details
   * Only PENDING or CONFIRMED appointments can be updated
   */
  updateAppointment: async (id: number, data: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.put<Appointment>(`/api/v1/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Mark appointment as no-show
   */
  markNoShow: async (id: number): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/no-show`);
    return response.data;
  },

  /**
   * Get appointments for a specific doctor
   */
  getDoctorAppointments: async (doctorId: number): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>(`/api/v1/appointments/doctor/${doctorId}`);
    return response.data;
  },

  /**
   * Get appointments for a specific patient
   */
  getPatientAppointments: async (patientId: number): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>(`/api/v1/appointments/patient/${patientId}`);
    return response.data;
  },
};

export default appointmentService;
