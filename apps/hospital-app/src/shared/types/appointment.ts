export type AppointmentStatus = 'waiting' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentType = 'aptmt' | 'sdn'; // 예약 유형

export interface StatusTabProps {
	handleClick: (value: AppointmentStatus) => void;
	status: AppointmentStatus;
}

export interface WaitingTableColumnProps {
	appointmentType: AppointmentType; // 예약 유형
	appointmentDatetime?: string; // 진료 희망 일시
	patientName: string; // 환자명
	patientLevel?: 'VIP' | 'Risk'; // 환자 등급
	symptom: string; // 증상
	appointmentRequestTime: string; // 예약 신청 일시
}
