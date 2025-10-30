import { apiClient } from './api';
import type {
  HealthRecordType,
  GetLatestRecordsResponse,
  GetHealthRecordsResponse,
  CreateHealthRecordRequest,
  HealthRecord,
} from '../types/phr';

/**
 * PHR (Personal Health Record) API Service
 *
 * This service will be used when connecting to real backend API.
 * Currently, the app uses Zustand store with mock data.
 */

export const phrService = {
  /**
   * Get latest records for all health types (dashboard)
   */
  getLatestRecords: async (): Promise<GetLatestRecordsResponse> => {
    const response = await apiClient.get<GetLatestRecordsResponse>('/api/v1/phr/latest');
    return response.data;
  },

  /**
   * Get records by type with pagination
   */
  getRecordsByType: async (
    type: HealthRecordType,
    page = 1,
    limit = 20
  ): Promise<GetHealthRecordsResponse> => {
    const response = await apiClient.get<GetHealthRecordsResponse>('/api/v1/phr', {
      params: { type, page, limit },
    });
    return response.data;
  },

  /**
   * Create new health record
   */
  createRecord: async (
    type: HealthRecordType,
    data: CreateHealthRecordRequest
  ): Promise<HealthRecord> => {
    const response = await apiClient.post<HealthRecord>('/api/v1/phr', {
      type,
      ...data,
    });
    return response.data;
  },

  /**
   * Delete health record by ID
   */
  deleteRecord: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/phr/${id}`);
  },

  /**
   * Update health record by ID
   */
  updateRecord: async (
    id: string,
    data: Partial<CreateHealthRecordRequest>
  ): Promise<HealthRecord> => {
    const response = await apiClient.put<HealthRecord>(`/api/v1/phr/${id}`, data);
    return response.data;
  },
};

export default phrService;
