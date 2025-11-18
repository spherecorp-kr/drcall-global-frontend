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

// 음주량 타입 (백엔드와 매핑)
export type AlcoholConsumption = 'ZERO' | 'ONE_TO_TWO' | 'THREE_PLUS';

export const AlcoholConsumption = {
  ZERO: 'ZERO' as AlcoholConsumption,
  ONE_TO_TWO: 'ONE_TO_TWO' as AlcoholConsumption,
  THREE_PLUS: 'THREE_PLUS' as AlcoholConsumption,
};

// 흡연량 타입 (백엔드와 매핑)
export type SmokingStatus = 'ZERO' | 'ONE_TO_FIVE' | 'SIX_PLUS';

export const SmokingStatus = {
  ZERO: 'ZERO' as SmokingStatus,
  ONE_TO_FIVE: 'ONE_TO_FIVE' as SmokingStatus,
  SIX_PLUS: 'SIX_PLUS' as SmokingStatus,
};

// 환자 상세 정보
export interface PatientDetailInfo {
  height?: string;
  weight?: string;
  bloodType?: 'A' | 'B' | 'O' | 'AB';
  alcohol?: '0' | '1~2' | '3+';  // 표시값
  smoking?: '0' | '1~5' | '6+';  // 표시값
  medications?: string;
  personalHistory?: string;
  familyHistory?: string;
}

// 프론트엔드 입력값을 백엔드 ENUM으로 변환하는 헬퍼 함수
export const mapAlcoholToEnum = (value: string): AlcoholConsumption | undefined => {
  switch (value) {
    case '0': return AlcoholConsumption.ZERO;
    case '1~2': return AlcoholConsumption.ONE_TO_TWO;
    case '3+': return AlcoholConsumption.THREE_PLUS;
    default: return undefined;
  }
};

export const mapSmokingToEnum = (value: string): SmokingStatus | undefined => {
  switch (value) {
    case '0': return SmokingStatus.ZERO;
    case '1~5': return SmokingStatus.ONE_TO_FIVE;
    case '6+': return SmokingStatus.SIX_PLUS;
    default: return undefined;
  }
};

// 백엔드 ENUM을 프론트엔드 표시값으로 변환하는 헬퍼 함수
export const mapAlcoholToDisplay = (value: AlcoholConsumption | string | undefined): string | undefined => {
  if (!value) return undefined;
  switch (value) {
    case AlcoholConsumption.ZERO:
    case 'ZERO': return '0';
    case AlcoholConsumption.ONE_TO_TWO:
    case 'ONE_TO_TWO': return '1~2';
    case AlcoholConsumption.THREE_PLUS:
    case 'THREE_PLUS': return '3+';
    default: return undefined;
  }
};

export const mapSmokingToDisplay = (value: SmokingStatus | string | undefined): string | undefined => {
  if (!value) return undefined;
  switch (value) {
    case SmokingStatus.ZERO:
    case 'ZERO': return '0';
    case SmokingStatus.ONE_TO_FIVE:
    case 'ONE_TO_FIVE': return '1~5';
    case SmokingStatus.SIX_PLUS:
    case 'SIX_PLUS': return '6+';
    default: return undefined;
  }
};

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
