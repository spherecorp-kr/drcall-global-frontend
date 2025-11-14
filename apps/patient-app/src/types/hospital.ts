/**
 * Hospital and Doctor types
 * ⚠️ 백엔드 API 응답과 일치하도록 수정됨 (2025-11-06)
 */

export interface Hospital {
  id: number;
  externalId: string;
  hospitalCode: string;
  nameEn: string;
  nameLocal: string; // 백엔드는 name_local (nameTh 대신 nameLocal 사용)
  email: string;
  phone: string;
  status: string;
  logoUrl: string;
  // 제거됨: nameKo (백엔드에서 제거), city, country (사용 안 함)
}

/**
 * Doctor interface - 백엔드 DoctorResponse와 일치
 * Source: patient-service HospitalController.DoctorResponse
 */
export interface Doctor {
  id: number;
  externalId: string;
  hospitalId: number;
  name: string; // 현지어 이름
  nameEn: string; // 영어 이름
  specialty: string; // 전문 분야
  introduction?: string; // 소개
  careerEducation?: string; // 경력 및 학력
  consultationFee: number; // 상담료
  consultationDurationMinutes: number; // 상담 시간
  availableForConsultation: boolean; // 진료 가능 여부
  profileImageUrl?: string; // 프로필 이미지
  status: string; // 상태
}
