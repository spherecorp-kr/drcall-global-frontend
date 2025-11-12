import { apiClient } from './api';
import type { Patient, UpdatePatientProfileRequest } from '@/types/patient';

/**
 * Patient Service - 백엔드 API 연동
 */

export interface UpdateLanguageRequest {
  language: string;
}

export const patientService = {
  /**
   * Get patient profile by ID
   * GET /api/v1/patients/{id}
   * Fixed: Remove double .data.data (interceptor already unwraps)
   */
  getProfile: async (patientId: number): Promise<Patient> => {
    const response = await apiClient.get(`/api/v1/patients/${patientId}`);
    return response.data;
  },

  /**
   * Update patient profile
   * PUT /api/v1/patients/{id}
   * Fixed: Remove double .data.data (interceptor already unwraps)
   */
  updateProfile: async (patientId: number, data: UpdatePatientProfileRequest): Promise<Patient> => {
    const response = await apiClient.put(`/api/v1/patients/${patientId}`, data);
    return response.data;
  },

  /**
   * Update patient language preference
   * PATCH /api/v1/patients/{id}/language
   */
  updateLanguage: async (patientId: number, language: string) => {
    const response = await apiClient.patch(`/api/v1/patients/${patientId}/language`, {
      language,
    });
    return response.data;
  },
};
