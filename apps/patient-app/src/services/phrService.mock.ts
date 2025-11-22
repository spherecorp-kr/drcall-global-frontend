import type {
  HealthRecordType,
  GetLatestRecordsResponse,
  GetHealthRecordsResponse,
  CreateHealthRecordRequest,
  HealthRecord,
  HeightWeightRecord,
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
} from '@/types/phr';
import {
  mockLatestHealthRecords,
  mockHeightWeightRecords,
  mockBloodPressureRecords,
  mockBloodSugarRecords,
  mockTemperatureRecords,
} from '@mocks/phr';

/**
 * Mock implementation of PHR Service
 * Used for development when real API is not available
 */
export const mockPhrService = {
  /**
   * Get latest records for all health types (dashboard)
   */
  getLatestRecords: async (): Promise<GetLatestRecordsResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: mockLatestHealthRecords,
    };
  },

  /**
   * Get records by type with pagination
   */
  getRecordsByType: async (
    type: HealthRecordType,
    page = 1,
    limit = 20
  ): Promise<GetHealthRecordsResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let allRecords: HealthRecord[] = [];

    switch (type) {
      case 'height_weight':
        allRecords = mockHeightWeightRecords;
        break;
      case 'blood_pressure':
        allRecords = mockBloodPressureRecords;
        break;
      case 'blood_sugar':
        allRecords = mockBloodSugarRecords;
        break;
      case 'temperature':
        allRecords = mockTemperatureRecords;
        break;
    }

    // Simulate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedRecords = allRecords.slice(start, end);

    return {
      records: paginatedRecords,
      total: allRecords.length,
      hasMore: end < allRecords.length,
    };
  },

  /**
   * Create new health record
   */
  createRecord: async (
    type: HealthRecordType,
    data: CreateHealthRecordRequest
  ): Promise<HealthRecord> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const baseRecord = {
      id: `new-${Date.now()}`,
      recordedAt: data.recordedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    switch (type) {
      case 'height_weight': {
        if ('height' in data && 'weight' in data) {
          const heightInMeters = data.height / 100;
          const bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(2));
          const newRecord: HeightWeightRecord = {
            ...baseRecord,
            type: 'height_weight',
            height: data.height,
            weight: data.weight,
            bmi,
          };
          return newRecord;
        }
        break;
      }
      case 'blood_pressure': {
        if ('systolic' in data && 'diastolic' in data && 'heartRate' in data) {
          const newRecord: BloodPressureRecord = {
            ...baseRecord,
            type: 'blood_pressure',
            systolic: data.systolic,
            diastolic: data.diastolic,
            heartRate: data.heartRate,
          };
          return newRecord;
        }
        break;
      }
      case 'blood_sugar': {
        if ('value' in data && 'measurementTime' in data) {
          const newRecord: BloodSugarRecord = {
            ...baseRecord,
            type: 'blood_sugar',
            value: data.value,
            measurementTime: data.measurementTime,
          };
          return newRecord;
        }
        break;
      }
      case 'temperature': {
        if ('value' in data) {
          const newRecord: TemperatureRecord = {
            ...baseRecord,
            type: 'temperature',
            value: data.value,
          };
          return newRecord;
        }
        break;
      }
    }

    throw new Error(`Invalid data for record type: ${type}`);
  },

  /**
   * Delete health record by ID
   */
  deleteRecord: async (id: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would delete the record
     
    console.info(`Record ${id} deleted`);
  },

  /**
   * Update health record by ID
   */
  updateRecord: async (
    id: string,
    data: Partial<CreateHealthRecordRequest>
  ): Promise<HealthRecord> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // For mock, just return a dummy updated record
    // In real implementation, this would update the record
    const updatedRecord: HealthRecord = {
      id,
      type: 'height_weight',
      recordedAt: data.recordedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      height: 170,
      weight: 65,
      bmi: 22.5,
    };

    return updatedRecord;
  },
};

export default mockPhrService;
