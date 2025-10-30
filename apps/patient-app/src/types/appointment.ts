/**
 * 예약 관련 타입 정의
 */

// 기본 예약 정보
export interface AppointmentInfo {
  appointmentNumber: string;
  appointmentType: string;
  hospital: {
    name: string;
    phone: string;
  };
  dateTime?: string;
  doctor?: string;
}

// 진료 정보
export interface TreatmentInfo {
  symptoms: string;
  symptomImages: string[];
}

// 환자 기본 정보
export interface PatientBasicInfo {
  name: string;
  thaiId: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
}

// 환자 상세 정보
export interface PatientDetailInfo {
  height?: string;
  weight?: string;
  bloodType?: 'A' | 'B' | 'O' | 'AB';
  alcohol?: '0' | '1~2' | '3+';
  smoking?: '0' | '1~5' | '6+';
  medications?: string;
  personalHistory?: string;
  familyHistory?: string;
}

// 전체 환자 정보 (기본 + 상세)
export interface PatientInfo extends PatientBasicInfo, PatientDetailInfo {}

// 전체 예약 데이터
export interface AppointmentData {
  appointmentInfo: AppointmentInfo;
  treatmentInfo: TreatmentInfo;
  patientInfo: PatientInfo;
}

// 예약 상태
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
