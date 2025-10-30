import { create } from 'zustand';
import type {
  HealthRecord,
  LatestHealthRecords,
  CreateHealthRecordRequest,
} from '@/types/phr';
import { getPhrService } from '@services';
import { logError } from '@utils/errorHandler';

// Get the appropriate service (mock or real based on environment)
const phrService = getPhrService();

interface PhrState {
  // Latest records for dashboard
  latestRecords: LatestHealthRecords;

  // All records
  records: HealthRecord[];

  // Type-specific records for detail pages
  heightWeightRecords: HealthRecord[];
  bloodPressureRecords: HealthRecord[];
  bloodSugarRecords: HealthRecord[];
  temperatureRecords: HealthRecord[];

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Actions
  fetchLatestRecords: () => Promise<void>;
  fetchRecordsByType: (type: string) => Promise<void>;
  createRecord: (type: string, data: CreateHealthRecordRequest) => Promise<void>;
  deleteRecord: (id: string, type: string) => Promise<void>;

  // Helper
  getRecordsByType: (type: string) => HealthRecord[];
}

export const usePhrStore = create<PhrState>((set, get) => ({
  // Initial state
  latestRecords: {},
  records: [],
  heightWeightRecords: [],
  bloodPressureRecords: [],
  bloodSugarRecords: [],
  temperatureRecords: [],
  isLoading: false,
  isSubmitting: false,

  // Fetch latest records for dashboard
  fetchLatestRecords: async () => {
    set({ isLoading: true });
    try {
      const response = await phrService.getLatestRecords();
      set({ latestRecords: response.data });
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'fetchLatestRecords' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch records by type for detail page
  fetchRecordsByType: async (type: string) => {
    set({ isLoading: true });
    try {
      const response = await phrService.getRecordsByType(type as any);

      switch (type) {
        case 'height_weight':
          set({ heightWeightRecords: response.records });
          break;
        case 'blood_pressure':
          set({ bloodPressureRecords: response.records });
          break;
        case 'blood_sugar':
          set({ bloodSugarRecords: response.records });
          break;
        case 'temperature':
          set({ temperatureRecords: response.records });
          break;
      }
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'fetchRecordsByType', metadata: { type } });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new record
  createRecord: async (type: string, data: CreateHealthRecordRequest) => {
    set({ isSubmitting: true });
    try {
      const newRecord = await phrService.createRecord(type as any, data);
      const state = get();

      switch (type) {
        case 'height_weight':
          set({
            heightWeightRecords: [newRecord, ...state.heightWeightRecords],
            latestRecords: { ...state.latestRecords, heightWeight: newRecord as any },
          });
          break;
        case 'blood_pressure':
          set({
            bloodPressureRecords: [newRecord, ...state.bloodPressureRecords],
            latestRecords: { ...state.latestRecords, bloodPressure: newRecord as any },
          });
          break;
        case 'blood_sugar':
          set({
            bloodSugarRecords: [newRecord, ...state.bloodSugarRecords],
            latestRecords: { ...state.latestRecords, bloodSugar: newRecord as any },
          });
          break;
        case 'temperature':
          set({
            temperatureRecords: [newRecord, ...state.temperatureRecords],
            latestRecords: { ...state.latestRecords, temperature: newRecord as any },
          });
          break;
      }
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'createRecord', metadata: { type } });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Delete record
  deleteRecord: async (id: string, type: string) => {
    const state = get();

    // 백업 - 롤백용
    const backup = get().getRecordsByType(type);

    // Optimistic update - UI에서 먼저 제거
    switch (type) {
      case 'height_weight':
        set({
          heightWeightRecords: state.heightWeightRecords.filter(r => r.id !== id),
        });
        break;
      case 'blood_pressure':
        set({
          bloodPressureRecords: state.bloodPressureRecords.filter(r => r.id !== id),
        });
        break;
      case 'blood_sugar':
        set({
          bloodSugarRecords: state.bloodSugarRecords.filter(r => r.id !== id),
        });
        break;
      case 'temperature':
        set({
          temperatureRecords: state.temperatureRecords.filter(r => r.id !== id),
        });
        break;
    }

    try {
      await phrService.deleteRecord(id);
      // 백그라운드에서 최신 레코드 업데이트 (스피너 없이)
      phrService.getLatestRecords().then(response => {
        set({ latestRecords: response.data });
      }).catch(err => {
        logError(err, { feature: 'PHR', action: 'fetchLatestRecords (background)' });
      });
    } catch (error) {
      logError(error, { feature: 'PHR', action: 'deleteRecord', metadata: { id, type } });

      // 에러 발생 시 롤백
      switch (type) {
        case 'height_weight':
          set({ heightWeightRecords: backup });
          break;
        case 'blood_pressure':
          set({ bloodPressureRecords: backup });
          break;
        case 'blood_sugar':
          set({ bloodSugarRecords: backup });
          break;
        case 'temperature':
          set({ temperatureRecords: backup });
          break;
      }

      throw error;
    }
  },

  // Helper function to get records by type
  getRecordsByType: (type: string) => {
    const state = get();
    switch (type) {
      case 'height_weight':
        return state.heightWeightRecords;
      case 'blood_pressure':
        return state.bloodPressureRecords;
      case 'blood_sugar':
        return state.bloodSugarRecords;
      case 'temperature':
        return state.temperatureRecords;
      default:
        return [];
    }
  },
}));
