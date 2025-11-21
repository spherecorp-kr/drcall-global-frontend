import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePhrStore } from '@store/phrStore';

// 모의 객체를 모듈 외부나 vi.mock 팩토리 내부에서 사용할 수 있도록 호이스팅
const mocks = vi.hoisted(() => ({
  getLatestRecords: vi.fn(),
  getRecordsByType: vi.fn(),
  createRecord: vi.fn(),
  deleteRecord: vi.fn(),
  logError: vi.fn(),
}));

// 서비스 모듈 모킹
vi.mock('@services', () => ({
  getPhrService: () => ({
    getLatestRecords: mocks.getLatestRecords,
    getRecordsByType: mocks.getRecordsByType,
    createRecord: mocks.createRecord,
    deleteRecord: mocks.deleteRecord,
  }),
}));

// 에러 핸들러 모킹
vi.mock('@utils/errorHandler', () => ({
  logError: mocks.logError,
}));

describe('phrStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 스토어 상태 초기화
    usePhrStore.setState({
      latestRecords: {},
      records: [],
      heightWeightRecords: [],
      bloodPressureRecords: [],
      bloodSugarRecords: [],
      temperatureRecords: [],
      isLoading: false,
      isSubmitting: false,
    });
  });

  // 최신 기록 조회 테스트: 대시보드용 최신 데이터를 가져와 상태에 저장 확인
  it('fetches latest records', async () => {
    const latestData = { heightWeight: { id: '1', height: 180, weight: 75 } };
    mocks.getLatestRecords.mockResolvedValue({ data: latestData });

    await usePhrStore.getState().fetchLatestRecords();

    expect(usePhrStore.getState().latestRecords).toEqual(latestData);
    expect(usePhrStore.getState().isLoading).toBe(false);
  });

  // 유형별 기록 조회 테스트: 특정 타입(혈압)의 기록 목록 조회 및 저장 확인
  it('fetches records by type (blood_pressure)', async () => {
    const records = [{ id: '1', systolic: 120, diastolic: 80 }];
    mocks.getRecordsByType.mockResolvedValue({ records });

    await usePhrStore.getState().fetchRecordsByType('blood_pressure');

    expect(usePhrStore.getState().bloodPressureRecords).toEqual(records);
    expect(usePhrStore.getState().isLoading).toBe(false);
  });

  // 기록 생성 테스트: 새 기록 추가 시 목록과 최신 기록이 함께 업데이트되는지 확인
  it('creates a new record and updates state', async () => {
    const newRecord = { id: 'new-1', systolic: 118, diastolic: 78, heartRate: 70 };
    mocks.createRecord.mockResolvedValue(newRecord);

    await usePhrStore.getState().createRecord('blood_pressure', {
        systolic: 118,
        diastolic: 78,
        heartRate: 70,
        recordedAt: '2025-01-01' // recordedAt으로 수정, heartRate 추가
    });

    const state = usePhrStore.getState();
    expect(state.bloodPressureRecords[0]).toEqual(newRecord);
    expect(state.latestRecords.bloodPressure).toEqual(newRecord);
    expect(state.isSubmitting).toBe(false);
  });

  // 기록 삭제 테스트 (성공): 낙관적 업데이트로 목록에서 즉시 제거되고 서비스 호출 확인
  it('deletes a record with optimistic update', async () => {
    // 초기 상태 설정
    const record = { id: '1', systolic: 120 };
    usePhrStore.setState({ bloodPressureRecords: [record as any] });

    mocks.deleteRecord.mockResolvedValue({});
    mocks.getLatestRecords.mockResolvedValue({ data: {} });

    await usePhrStore.getState().deleteRecord('1', 'blood_pressure');

    expect(usePhrStore.getState().bloodPressureRecords).toHaveLength(0);
    expect(mocks.deleteRecord).toHaveBeenCalledWith('1');
  });

  // 기록 삭제 테스트 (실패): 삭제 실패 시 롤백되어 기록이 복구되는지 확인
  it('rollbacks state on delete failure', async () => {
    // 초기 상태 설정
    const record = { id: '1', systolic: 120 };
    usePhrStore.setState({ bloodPressureRecords: [record as any] });

    mocks.deleteRecord.mockRejectedValue(new Error('Failed'));

    await expect(usePhrStore.getState().deleteRecord('1', 'blood_pressure')).rejects.toThrow('Failed');

    // 실패 시 기록이 복구되어야 함
    expect(usePhrStore.getState().bloodPressureRecords).toHaveLength(1);
    expect(usePhrStore.getState().bloodPressureRecords[0]).toEqual(record);
  });
});
