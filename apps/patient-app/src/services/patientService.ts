import { apiClient } from './api';

/**
 * Patient Service - 백엔드 API 연동
 */

export interface UpdateLanguageRequest {
  language: string;
}

export const patientService = {
  /**
   * Update patient language preference
   */
  updateLanguage: async (patientId: number, language: string) => {
    const response = await apiClient.patch(`/api/v1/patients/${patientId}/language`, {
      language,
    });
    return response.data;
  },
};
