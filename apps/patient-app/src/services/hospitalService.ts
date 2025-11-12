import { apiClient } from './api';
import type { Hospital, Doctor } from '../types/hospital';

/**
 * Hospital and Doctor API Service
 *
 * 현재 채널(subdomain)의 병원 및 의사 정보를 조회합니다.
 * hospitalId는 자동으로 subdomain을 통해 결정되므로 파라미터로 전달할 필요가 없습니다.
 */
export const hospitalService = {
  /**
   * Get current hospital info
   * 현재 채널의 병원 정보를 가져옵니다.
   */
  getCurrentHospital: async (): Promise<Hospital> => {
    const response = await apiClient.get<Hospital>('/api/v1/hospital');
    return response.data;
  },

  /**
   * Get hospital by ID
   * TODO: Backend endpoint not available yet (/api/v1/hospitals/{id})
   * Use getCurrentHospital() instead for current channel's hospital
   */
  // getHospitalById: async (id: number): Promise<Hospital> => {
  //   const response = await apiClient.get<Hospital>(`/api/v1/hospitals/${id}`);
  //   return response.data;
  // },

  /**
   * Get all doctors in current hospital
   * 현재 병원의 모든 의사 목록을 가져옵니다.
   */
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/api/v1/doctors');
    return response.data;
  },

  /**
   * Get doctors by specialty
   * 특정 전문과의 의사 목록을 가져옵니다.
   */
  getDoctorsBySpecialty: async (specialty: string): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/api/v1/doctors', {
      params: { specialty },
    });
    return response.data;
  },

  /**
   * Get available doctors (즉시 진료 가능)
   * 현재 즉시 진료가 가능한 의사들을 가져옵니다.
   */
  getAvailableDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/api/v1/doctors/available');
    return response.data;
  },

  /**
   * Get doctor by ID
   * 특정 의사의 상세 정보를 가져옵니다.
   */
  getDoctorById: async (id: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`/api/v1/doctors/${id}`);
    return response.data;
  },
};

export default hospitalService;
