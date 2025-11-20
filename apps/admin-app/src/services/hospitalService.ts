import { apiClient } from '@/lib/api';
import type { HospitalDto } from '@/shared/types/hospital';
import type {
  HospitalOnboardingRequest,
  HospitalOnboardingResponse
} from '@/types/onboarding';

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface HospitalListParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

export interface HospitalDetailResponse extends HospitalDto {
  // 추가 상세 정보
  timezone?: string;
  currency?: string;
  countryCode?: string;
  city?: string;
  state?: string;
  settings?: {
    omiseEnabled?: boolean;
    shippopEnabled?: boolean;
    lineEnabled?: boolean;
  };
}

export interface UpdateHospitalRequest {
  nameEn?: string;
  nameLocal?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  addressDetail?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  timezone?: string;
  currency?: string;
  logoUrl?: string;
  mobileLogoUrl?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
}

export interface CreateOmiseGatewayRequest {
  hospitalId: number;
  publicKey: string;
  secretKey: string;
  apiVersion?: string;
}

export interface CreateShippopProviderRequest {
  hospitalId: number;
  apiKey: string;
  email: string;
  defaultSenderName: string;
  defaultSenderPhone: string;
  defaultSenderAddress: string;
}

class HospitalService {
  /**
   * 병원 목록 조회
   */
  async getHospitals(params: HospitalListParams = {}): Promise<PaginatedResponse<HospitalDto>> {
    const { page = 0, size = 20, search, status } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    if (status) {
      queryParams.append('status', status);
    }

    const response = await apiClient.get<PaginatedResponse<HospitalDto>>(
      `/api/v1/admin/hospitals?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * 병원 상세 정보 조회
   */
  async getHospitalById(id: string): Promise<HospitalDetailResponse> {
    const response = await apiClient.get<HospitalDetailResponse>(
      `/api/v1/admin/hospitals/${id}`
    );

    return response.data;
  }

  /**
   * 새 병원 온보딩 (등록)
   */
  async onboardHospital(request: HospitalOnboardingRequest): Promise<HospitalOnboardingResponse> {
    const response = await apiClient.post<HospitalOnboardingResponse>(
      '/api/v1/admin/hospitals',
      request
    );

    return response.data;
  }

  /**
   * 병원 정보 수정
   */
  async updateHospital(id: string, request: UpdateHospitalRequest): Promise<HospitalDetailResponse> {
    const response = await apiClient.put<HospitalDetailResponse>(
      `/api/v1/admin/hospitals/${id}`,
      request
    );

    return response.data;
  }

  /**
   * 병원 삭제
   */
  async deleteHospital(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/admin/hospitals/${id}`);
  }

  /**
   * 병원 활성화/비활성화
   */
  async toggleHospitalStatus(id: string, isActive: boolean): Promise<HospitalDetailResponse> {
    const response = await apiClient.patch<HospitalDetailResponse>(
      `/api/v1/admin/hospitals/${id}/status`,
      { isActive }
    );

    return response.data;
  }

  /**
   * OMISE 게이트웨이 설정
   */
  async createOmiseGateway(request: CreateOmiseGatewayRequest): Promise<void> {
    await apiClient.post('/api/v1/admin/hospitals/omise-gateway', request);
  }

  /**
   * OMISE 게이트웨이 검증
   */
  async verifyOmiseGateway(hospitalId: number): Promise<{ valid: boolean; message?: string }> {
    const response = await apiClient.post<{ valid: boolean; message?: string }>(
      `/api/v1/admin/hospitals/${hospitalId}/omise-gateway/verify`
    );

    return response.data;
  }

  /**
   * SHIPPOP 프로바이더 설정
   */
  async createShippopProvider(request: CreateShippopProviderRequest): Promise<void> {
    await apiClient.post('/api/v1/admin/hospitals/shippop-provider', request);
  }

  /**
   * SHIPPOP 프로바이더 검증
   */
  async verifyShippopProvider(hospitalId: number): Promise<{ valid: boolean; message?: string }> {
    const response = await apiClient.post<{ valid: boolean; message?: string }>(
      `/api/v1/admin/hospitals/${hospitalId}/shippop-provider/verify`
    );

    return response.data;
  }

  /**
   * 병원 로고 업로드 (presigned URL 방식)
   */
  async uploadHospitalLogo(hospitalId: string, file: File, type: 'web' | 'mobile' = 'web'): Promise<string> {
    // 1. Presigned URL 요청
    const presignedResponse = await apiClient.post<{ uploadUrl: string; fileUrl: string }>(
      `/api/v1/admin/hospitals/${hospitalId}/logo/presigned-url`,
      {
        fileName: file.name,
        contentType: file.type,
        logoType: type,
      }
    );

    // 2. S3에 직접 업로드
    await fetch(presignedResponse.data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // 3. 파일 URL 반환
    return presignedResponse.data.fileUrl;
  }

  /**
   * 병원 검색 (자동완성용)
   */
  async searchHospitals(query: string): Promise<HospitalDto[]> {
    const response = await apiClient.get<HospitalDto[]>(
      `/api/v1/admin/hospitals/search?q=${encodeURIComponent(query)}`
    );

    return response.data;
  }

  /**
   * 병원 통계 조회
   */
  async getHospitalStatistics(hospitalId: string): Promise<{
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalRevenue: number;
    currency: string;
  }> {
    const response = await apiClient.get<{
      totalPatients: number;
      totalDoctors: number;
      totalAppointments: number;
      totalRevenue: number;
      currency: string;
    }>(`/api/v1/admin/hospitals/${hospitalId}/statistics`);

    return response.data;
  }
}

export const hospitalService = new HospitalService();