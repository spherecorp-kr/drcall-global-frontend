import apiClient from './api';

/**
 * Dashboard 통계 응답
 */
export interface DashboardStatsResponse {
  // 오늘 예약 통계
  todayTotalAppointments: number;
  todayPendingAppointments: number;
  todayConfirmedAppointments: number;
  todayInProgressAppointments: number;
  todayCompletedAppointments: number;

  // 전체 예약 통계 (상태별)
  totalPendingAppointments: number;
  totalConfirmedAppointments: number;
  totalInProgressAppointments: number;

  // 환자 통계
  totalActivePatients: number;
  todayNewPatients: number;

  // 최근 활동 (7일/30일)
  last7DaysCompletedAppointments: number;
  last7DaysNewPatients: number;
  last30DaysCompletedAppointments: number;
  last30DaysNewPatients: number;
}

/**
 * Dashboard 서비스
 */
export const dashboardService = {
  /**
   * 병원 대시보드 통계 조회
   * GET /api/v1/dashboard/stats
   */
  getStats: async (): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get<DashboardStatsResponse>('/api/v1/dashboard/stats');
    return response.data;
  },
};
