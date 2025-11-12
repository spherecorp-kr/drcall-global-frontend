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

  // Nested objects (병원/의사 정보)
  hospital?: {
    id: number;
    nameEn: string;
    nameLocal: string;
    phone: string;
    logoUrl: string;
  };
  doctor?: {
    id: number;
    name: string;
    nameEn: string;
    specialty: string;
    profileImageUrl?: string;
  };

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

export interface CreateAppointmentRequest {
  patientId: number;
  hospitalId: number;
  doctorId: number;
  appointmentType: 'STANDARD' | 'QUICK';
  consultationType?: 'VIDEO_CALL' | 'CHAT' | 'PHONE';
  scheduledAt?: string; // ISO 8601 datetime string for STANDARD appointments
  symptoms: string;
  symptomImages?: string[];
  patientNote?: string;
  // Health Questionnaire (flat structure matching backend)
  height: string;
  weight: string;
  bloodType: string;
  alcohol: string;
  smoking: string;
  medications: string;
  personalHistory: string;
  familyHistory: string;
  currency?: string; // Default: "THB"
}

export interface UpdateAppointmentRequest {
  scheduledAt?: string; // ISO 8601 datetime string
  symptoms?: string;
  symptomImages?: string[];
  patientNote?: string;
  doctorNote?: string;
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  hasMore: boolean;
}

/**
 * Paginated Appointment Response (matches backend PageResponse)
 */
export interface PaginatedAppointmentResponse {
  content: Appointment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Appointment Query Parameters
 */
export interface AppointmentQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
}

/**
 * Appointment API Service
 */
export const appointmentService = {
  /**
   * Get appointments with pagination (RESTful)
   * Backend supports: page, size, sort, status
   *
   * @param params - Query parameters for pagination and filtering
   * @returns PaginatedAppointmentResponse with metadata
   *
   * Examples:
   * - getAppointments({ page: 0, size: 20 })
   * - getAppointments({ page: 0, size: 20, status: 'CONFIRMED' })
   * - getAppointments({ page: 1, size: 10, sort: 'scheduledAt,asc' })
   */
  getAppointments: async (
    params?: AppointmentQueryParams
  ): Promise<PaginatedAppointmentResponse> => {
    const response = await apiClient.get<PaginatedAppointmentResponse>('/api/v1/appointments', { params });
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
   * TODO: Backend endpoint not available yet in Patient Service
   */
  updateAppointment: async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.put<Appointment>(`/api/v1/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Cancel appointment by ID
   * Fixed: Use POST /cancel endpoint instead of DELETE
   */
  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/api/v1/appointments/${id}/cancel`, {
      reason,
    });
    return response.data;
  },
};

export default appointmentService;
