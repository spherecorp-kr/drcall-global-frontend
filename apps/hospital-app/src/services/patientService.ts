import apiClient from './api';

/**
 * 환자 등록 요청
 */
export interface PatientRegisterRequest {
  name: string;
  phone: string;
  phoneCountryCode?: string;
  birthDate?: string; // YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE';
  thaiId?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  drinkingHabit?: string;
  smokingHabit?: string;
  currentMedications?: string;
  personalHistory?: string;
  familyHistory?: string;
}

/**
 * 환자 응답 (상세)
 */
export interface PatientResponse {
  id: number;
  externalId: string;
  hospitalId: number;
  hospitalChannelId: number | null;
  channelUserId: string | null;
  registrationStatus: string;
  registeredBy: string | null;

  // 기본 정보
  name: string;
  email: string | null;
  phone: string;
  phoneCountryCode: string;
  dateOfBirth: string | null; // LocalDate -> YYYY-MM-DD
  gender: string | null;

  // 주소
  countryCode: string | null;
  address: string | null;
  addressDetail: string | null;
  postalCode: string | null;
  googlePlaceId: string | null;

  // 건강 정보
  height: string | null;
  weight: string | null;
  bloodType: string | null;

  // 프로필
  profileImageUrl: string | null;

  // 상태
  status: string;
}

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * 환자 서비스
 */
export const patientService = {
  /**
   * 환자 목록 조회 (페이지네이션 + 검색)
   * GET /api/v1/patients?page=0&size=20&keyword=검색어
   */
  getPatients: async (params?: {
    page?: number;
    size?: number;
    keyword?: string;
  }): Promise<PageResponse<PatientResponse>> => {
    const response = await apiClient.get<PageResponse<PatientResponse>>('/api/v1/patients', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        keyword: params?.keyword,
      },
    });
    return response.data;
  },

  /**
   * 환자 상세 조회 (ID)
   * GET /api/v1/patients/{id}
   */
  getPatient: async (id: number): Promise<PatientResponse> => {
    const response = await apiClient.get<PatientResponse>(`/api/v1/patients/${id}`);
    return response.data;
  },

  /**
   * 환자 상세 조회 (External ID)
   * GET /api/v1/patients/external/{externalId}
   */
  getPatientByExternalId: async (externalId: string): Promise<PatientResponse> => {
    const response = await apiClient.get<PatientResponse>(
      `/api/v1/patients/external/${externalId}`
    );
    return response.data;
  },

  /**
   * 환자 등록
   * POST /api/v1/patients
   */
  registerPatient: async (data: PatientRegisterRequest): Promise<PatientResponse> => {
    const response = await apiClient.post<PatientResponse>('/api/v1/patients', data);
    return response.data;
  },
};




