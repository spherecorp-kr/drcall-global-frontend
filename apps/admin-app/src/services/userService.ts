import { apiClient } from "@/services/api";

// =============== 공통 타입 ===============
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// =============== 환자 관련 타입 ===============
export interface PatientDto {
  id: number;
  externalId: string;
  name: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  profileImageUrl?: string;
  preferredLanguage: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  // Read Replica 데이터 (읽기 전용)
  totalAppointments?: number;
  completedAppointments?: number;
  lastAppointmentDate?: string;
}

export interface CreatePatientRequest {
  name: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  preferredLanguage: string;
  password?: string; // 초기 비밀번호 설정
}

export interface UpdatePatientRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  preferredLanguage?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// =============== 의사 관련 타입 ===============
export interface DoctorDto {
  id: number;
  externalId: string;
  hospitalId: number;
  name: string;
  nameLocal?: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  licenseNumber: string;
  profileImageUrl?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  languages: string[];
  availableDays?: string[];
  consultationFee?: number;
  currency?: string;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;

  // Read Replica 데이터 (읽기 전용)
  hospitalName?: string;
  totalAppointments?: number;
  todayAppointments?: number;
}

export interface CreateDoctorRequest {
  hospitalId: number;
  name: string;
  nameLocal?: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  licenseNumber: string;
  description?: string;
  languages: string[];
  availableDays?: string[];
  consultationFee?: number;
  password?: string; // 초기 비밀번호 설정
}

export interface UpdateDoctorRequest {
  name?: string;
  nameLocal?: string;
  email?: string;
  phoneNumber?: string;
  specialty?: string;
  licenseNumber?: string;
  description?: string;
  languages?: string[];
  availableDays?: string[];
  consultationFee?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
}

// =============== 관리자 관련 타입 ===============
export interface AdminDto {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  // 권한 정보
  permissions?: string[];
}

export interface CreateAdminRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'VIEWER';
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'VIEWER';
  status?: 'ACTIVE' | 'INACTIVE';
  password?: string; // 비밀번호 재설정
}

// =============== 검색/필터 파라미터 ===============
export interface UserSearchParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  role?: string;
  hospitalId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

class UserService {
  // ============ 환자 관리 (patient-service 호출) ============

  /**
   * 환자 목록 조회
   */
  async getPatients(params: UserSearchParams = {}): Promise<PaginatedResponse<PatientDto>> {
    const { page = 0, size = 20, ...otherParams } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<PatientDto>>(
      `/api/v1/admin/patients?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * 환자 상세 조회
   */
  async getPatientById(id: string): Promise<PatientDto> {
    const response = await apiClient.get<PatientDto>(`/api/v1/admin/patients/${id}`);
    return response.data;
  }

  /**
   * 환자 생성 (patient-service internal API 호출)
   */
  async createPatient(request: CreatePatientRequest): Promise<PatientDto> {
    const response = await apiClient.post<PatientDto>(
      '/api/v1/admin/patients',
      request
    );
    return response.data;
  }

  /**
   * 환자 정보 수정 (patient-service internal API 호출)
   */
  async updatePatient(id: string, request: UpdatePatientRequest): Promise<PatientDto> {
    const response = await apiClient.put<PatientDto>(
      `/api/v1/admin/patients/${id}`,
      request
    );
    return response.data;
  }

  /**
   * 환자 상태 변경 (활성화/비활성화/정지)
   */
  async updatePatientStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<PatientDto> {
    const response = await apiClient.patch<PatientDto>(
      `/api/v1/admin/patients/${id}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * 환자 비밀번호 재설정
   */
  async resetPatientPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.post(`/api/v1/admin/patients/${id}/reset-password`, {
      password: newPassword
    });
  }

  // ============ 의사 관리 (hospital-service 호출) ============

  /**
   * 의사 목록 조회
   */
  async getDoctors(params: UserSearchParams = {}): Promise<PaginatedResponse<DoctorDto>> {
    const { page = 0, size = 20, ...otherParams } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<DoctorDto>>(
      `/api/v1/admin/doctors?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * 의사 상세 조회
   */
  async getDoctorById(id: string): Promise<DoctorDto> {
    const response = await apiClient.get<DoctorDto>(`/api/v1/admin/doctors/${id}`);
    return response.data;
  }

  /**
   * 의사 생성 (hospital-service internal API 호출)
   */
  async createDoctor(request: CreateDoctorRequest): Promise<DoctorDto> {
    const response = await apiClient.post<DoctorDto>(
      '/api/v1/admin/doctors',
      request
    );
    return response.data;
  }

  /**
   * 의사 정보 수정 (hospital-service internal API 호출)
   */
  async updateDoctor(id: string, request: UpdateDoctorRequest): Promise<DoctorDto> {
    const response = await apiClient.put<DoctorDto>(
      `/api/v1/admin/doctors/${id}`,
      request
    );
    return response.data;
  }

  /**
   * 의사 상태 변경
   */
  async updateDoctorStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'): Promise<DoctorDto> {
    const response = await apiClient.patch<DoctorDto>(
      `/api/v1/admin/doctors/${id}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * 의사 비밀번호 재설정
   */
  async resetDoctorPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.post(`/api/v1/admin/doctors/${id}/reset-password`, {
      password: newPassword
    });
  }

  // ============ 관리자 관리 (admin-service 직접 처리) ============

  /**
   * 관리자 목록 조회
   */
  async getAdmins(params: UserSearchParams = {}): Promise<PaginatedResponse<AdminDto>> {
    const { page = 0, size = 20, ...otherParams } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    Object.entries(otherParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<AdminDto>>(
      `/api/v1/admin/admins?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * 관리자 상세 조회
   */
  async getAdminById(id: string): Promise<AdminDto> {
    const response = await apiClient.get<AdminDto>(`/api/v1/admin/admins/${id}`);
    return response.data;
  }

  /**
   * 관리자 생성
   */
  async createAdmin(request: CreateAdminRequest): Promise<AdminDto> {
    const response = await apiClient.post<AdminDto>(
      '/api/v1/admin/admins',
      request
    );
    return response.data;
  }

  /**
   * 관리자 정보 수정
   */
  async updateAdmin(id: string, request: UpdateAdminRequest): Promise<AdminDto> {
    const response = await apiClient.put<AdminDto>(
      `/api/v1/admin/admins/${id}`,
      request
    );
    return response.data;
  }

  /**
   * 관리자 비활성화
   */
  async deactivateAdmin(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/admin/admins/${id}`);
  }

  // ============ 통계 ============

  /**
   * 사용자 통계 조회
   */
  async getUserStatistics(): Promise<{
    totalPatients: number;
    activePatients: number;
    totalDoctors: number;
    activeDoctors: number;
    totalAdmins: number;
    activeAdmins: number;
    newPatientsThisMonth: number;
    newDoctorsThisMonth: number;
  }> {
    const response = await apiClient.get('/api/v1/admin/users/statistics');
    return response.data;
  }

  // ============ 대량 작업 ============

  /**
   * 환자 대량 상태 변경
   */
  async bulkUpdatePatientStatus(
    patientIds: string[],
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ): Promise<void> {
    await apiClient.post('/api/v1/admin/patients/bulk-status', {
      patientIds,
      status
    });
  }

  /**
   * 의사 대량 상태 변경
   */
  async bulkUpdateDoctorStatus(
    doctorIds: string[],
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'
  ): Promise<void> {
    await apiClient.post('/api/v1/admin/doctors/bulk-status', {
      doctorIds,
      status
    });
  }

  /**
   * 사용자 데이터 내보내기 (CSV)
   */
  async exportUsers(type: 'patients' | 'doctors' | 'admins', params?: UserSearchParams): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `/api/v1/admin/users/export/${type}?${queryParams.toString()}`,
      {
        responseType: 'blob'
      }
    );

    return response.data;
  }
}

export const userService = new UserService();