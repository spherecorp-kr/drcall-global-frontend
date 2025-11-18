import apiClient from './api';

/**
 * 로그인 요청
 */
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 사용자 정보
 */
export interface UserInfo {
  id: number;
  userType: 'DOCTOR' | 'COORDINATOR' | 'ADMIN';
  name: string;
  hospitalId: number;
  hospitalName: string;
  role: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

/**
 * 인증 서비스
 */
export const authService = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', data);
    return response.data;
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
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>('/api/v1/auth/me');
    return response.data;
  },
};
