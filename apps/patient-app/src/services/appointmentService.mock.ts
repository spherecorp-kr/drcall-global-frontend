import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentListResponse,
} from './appointmentService';
import {
  mockAppointmentsList,
  mockCompletedConsultations,
  mockAppointmentsDetails,
} from '@mocks/appointments-list';

/**
 * Mock implementation of Appointment Service
 * Used for development when real API is not available
 */
export const mockAppointmentService = {
  /**
   * Get all appointments with filters (simulated)
   */
  getAppointments: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<AppointmentListResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let appointments: Appointment[];

    if (status === 'completed') {
      appointments = mockCompletedConsultations as unknown as Appointment[];
    } else if (status && status !== 'all') {
      appointments = mockAppointmentsList.filter((apt) => apt.status === status) as unknown as Appointment[];
    } else {
      appointments = mockAppointmentsList as unknown as Appointment[];
    }

    // Simulate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedAppointments = appointments.slice(start, end);

    return {
      appointments: paginatedAppointments,
      total: appointments.length,
      hasMore: end < appointments.length,
    };
  },

  /**
   * Get appointment by ID (simulated)
   */
  getAppointmentById: async (id: string): Promise<Appointment> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const appointment = mockAppointmentsDetails[id];
    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found`);
    }

    return appointment as unknown as Appointment;
  },

  /**
   * Create new appointment (simulated)
   */
  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create mock appointment
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT${Date.now().toString().slice(-6)}`,
      appointmentType: data.appointmentType,
      status: 'pending_confirmation',
      hospital: {
        name: 'Bangkok Hospital',
        nameEn: 'Bangkok Hospital',
        phone: '+66-2-310-3000',
      },
      dateTime: data.dateTime || new Date().toISOString(),
      doctor: {
        name: '의사 이름',
        nameEn: 'Doctor Name',
        photo: '/assets/images/doctors/default.jpg',
        specialty: '일반의',
      },
      symptoms: data.symptoms,
      symptomImages: data.symptomImages || [],
    };

    return newAppointment;
  },

  /**
   * Update appointment by ID (simulated)
   */
  updateAppointment: async (
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<Appointment> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const appointment = mockAppointmentsDetails[id];
    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found`);
    }

    // Simulate update
    const updatedAppointment: Appointment = {
      ...(appointment as unknown as Appointment),
      symptoms: data.symptoms || appointment.symptoms,
      symptomImages: data.symptomImages || appointment.symptomImages || [],
    };

    return updatedAppointment;
  },

  /**
   * Cancel appointment by ID (simulated)
   */
  cancelAppointment: async (id: string, reason?: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const appointment = mockAppointmentsDetails[id];
    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found`);
    }

    // In real implementation, this would update the status to 'cancelled'
    // eslint-disable-next-line no-console
    console.info(`Appointment ${id} cancelled. Reason: ${reason || 'None'}`);
  },
};

export default mockAppointmentService;
