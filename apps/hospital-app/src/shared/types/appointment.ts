export type AppointmentStatus = 'waiting' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentType = 'aptmt' | 'sdn'; // 예약 유형
export type PatientLevel = 'VIP' | 'Risk'; // 환자 등급

export interface StatusTabProps {
	handleClick: (value: AppointmentStatus) => void;
	status: AppointmentStatus;
}

// 예약 대기 리스트 컬럼 속성
export interface WaitingTableColumnProps {
	appointmentType: AppointmentType; // 예약 유형
	appointmentDatetime?: string; // 진료 희망 일시
	patientName: string; // 환자명
	patientLevel?: PatientLevel; // 환자 등급
	symptom: string; // 증상
	appointmentRequestTime: string; // 예약 신청 일시
}

// 예약 확정 리스트 컬럼 속성
export interface ConfirmedTableColumnProps {
	appointmentNumber: string; // 예약 번호
	appointmentDatetime: string; // 진료 희망 일시
	doctorName: string; // 의사
	patientName: string; // 환자명
	patientLevel?: PatientLevel; // 환자 등급
	symptom: string; // 증상
}

// 진료 완료 리스트 컬럼 속성
export interface CompletedTableColumnProps {
	appointmentNumber: string; // 예약 번호
	completedDatetime: string; // 진료 완료 일시
	doctorName: string; // 의사
	patientName: string; // 환자명
	prescriptionStatus: string; // 처방전 상태 TODO api에 맞추기
	paymentStatus: string; // 결제 상태 TODO api에 맞추기
	deliveryStatus: string; // 배송 상태 TODO api에 맞추기
}