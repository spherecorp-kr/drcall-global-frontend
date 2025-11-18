import apiClient from './api';

/**
 * AppointmentReplica from hospital-service
 * Synced from appointment-service via Kafka CDC
 */
export interface Appointment {
	// BaseReplica fields
	id: number;
	externalId: string; // appointmentSequence
	syncedAt: string | null;
	deletedAt: string | null;

	// AppointmentReplica fields
	appointmentNumber: string;
	patientId: number;
	hospitalId: number;
	doctorId: number;
	appointmentType: 'STANDARD' | 'QUICK';
	consultationType: 'VIDEO' | 'AUDIO';
	status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
	scheduledAt: string | null;
	startedAt: string | null;
	endedAt: string | null;
	durationMinutes: number | null;
	cancelledAt: string | null;
	cancelledBy: string | null;
	cancellationReason: string | null;
	symptoms: string | null;
}

export const appointmentService = {
	/**
	 * 예약 상세 조회 (appointmentSequence로)
	 */
	getAppointmentBySequence: async (appointmentSequence: string): Promise<Appointment> => {
		const response = await apiClient.get<Appointment>(
			`/api/v1/appointments/sequence/${appointmentSequence}`
		);
		return response.data;
	},

	/**
	 * 예약 상세 조회 (ID로)
	 */
	getAppointmentById: async (id: number): Promise<Appointment> => {
		const response = await apiClient.get<Appointment>(`/api/v1/appointments/${id}`);
		return response.data;
	},
};