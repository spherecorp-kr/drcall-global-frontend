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
 * 환자 응답
 */
export interface PatientResponse {
  id: number;
  externalId: string;
  name: string;
  phone: string;
  phoneCountryCode: string;
  status: string;
}

/**
 * 환자 서비스
 */
export const patientService = {
  /**
   * 환자 등록
   */
  registerPatient: async (data: PatientRegisterRequest): Promise<PatientResponse> => {
    const response = await apiClient.post<PatientResponse>('/api/v1/patients', data);
    return response.data;
  },

  /**
   * 환자 조회
   */
  getPatient: async (id: number): Promise<PatientResponse> => {
    const response = await apiClient.get<PatientResponse>(`/api/v1/patients/${id}`);
    return response.data;
  },
};



