import { apiClient } from './api';

/**
 * 로그인 요청
 */
export interface LoginRequest {
  loginId: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 관리자 사용자 정보
 */
export interface AdminUserInfo {
  id: number;
  loginId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM_ADMIN' | 'USER_ADMIN' | 'VIEW_ONLY';
  isActive: boolean;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AdminUserInfo;
}

/**
 * 인증 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // 백엔드는 loginId를 요구하므로 변환
    const requestBody = {
      loginId: data.loginId,
      password: data.password,
    };
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', requestBody);
    
    // 응답 데이터 검증: accessToken과 user가 필수
    const responseData = response.data;
    if (!responseData?.accessToken || !responseData?.user) {
      const error = new Error('로그인 응답이 올바르지 않습니다.') as Error & { response?: unknown };
      error.response = {
        status: 400,
        data: responseData
      };
      throw error;
    }
    
    return responseData;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout');
  },

  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser: async (): Promise<AdminUserInfo> => {
    const response = await apiClient.get<AdminUserInfo>('/api/v1/auth/me');
    return response.data;
  },
};

