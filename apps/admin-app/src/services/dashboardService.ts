import { apiClient } from '@/lib/api';

export interface DashboardStats {
  totalHospitals: number;
  activeHospitals: number;
  totalPatients: number;
  activePatients: number;
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  todayRevenue: number;
  currency: string;
}

export interface AppointmentTrend {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}

export interface RevenueTrend {
  date: string;
  amount: number;
  currency: string;
}

export interface RecentActivity {
  id: string;
  type: 'HOSPITAL_REGISTERED' | 'PATIENT_REGISTERED' | 'APPOINTMENT_CREATED' | 'PAYMENT_COMPLETED' | 'DOCTOR_JOINED';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    hospitalName?: string;
    patientName?: string;
    doctorName?: string;
    amount?: number;
  };
}

export interface TopHospital {
  id: number;
  name: string;
  appointmentCount: number;
  revenue: number;
  patientCount: number;
}

export interface TopDoctor {
  id: number;
  name: string;
  hospitalName: string;
  specialty: string;
  appointmentCount: number;
  rating: number;
}

class DashboardService {
  /**
   * 대시보드 통계 조회
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/api/v1/admin/dashboard/stats');
    return response.data;
  }

  /**
   * 예약 추이 조회 (최근 30일)
   */
  async getAppointmentTrends(days: number = 30): Promise<AppointmentTrend[]> {
    const response = await apiClient.get<AppointmentTrend[]>(
      `/api/v1/admin/dashboard/appointment-trends?days=${days}`
    );
    return response.data;
  }

  /**
   * 매출 추이 조회 (최근 30일)
   */
  async getRevenueTrends(days: number = 30): Promise<RevenueTrend[]> {
    const response = await apiClient.get<RevenueTrend[]>(
      `/api/v1/admin/dashboard/revenue-trends?days=${days}`
    );
    return response.data;
  }

  /**
   * 최근 활동 조회
   */
  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const response = await apiClient.get<RecentActivity[]>(
      `/api/v1/admin/dashboard/recent-activities?limit=${limit}`
    );
    return response.data;
  }

  /**
   * 상위 병원 조회
   */
  async getTopHospitals(limit: number = 5): Promise<TopHospital[]> {
    const response = await apiClient.get<TopHospital[]>(
      `/api/v1/admin/dashboard/top-hospitals?limit=${limit}`
    );
    return response.data;
  }

  /**
   * 상위 의사 조회
   */
  async getTopDoctors(limit: number = 5): Promise<TopDoctor[]> {
    const response = await apiClient.get<TopDoctor[]>(
      `/api/v1/admin/dashboard/top-doctors?limit=${limit}`
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();