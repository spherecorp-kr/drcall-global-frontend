import { apiClient } from './api';

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
 * 비밀번호 찾기 - 아이디 확인 요청
 */
export interface FindPasswordRequest {
	username: string;
}

/**
 * 비밀번호 찾기 - 아이디 확인 응답
 */
export interface FindPasswordResponse {
	email: string;
}

/**
 * 인증번호 확인 요청
 */
export interface VerifyCodeRequest {
	username: string;
	code: string;
}

/**
 * 인증번호 확인 응답
 */
export interface VerifyCodeResponse {
	success: boolean;
	token?: string; // 비밀번호 재설정용 토큰
}

/**
 * 비밀번호 재설정 요청
 */
export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
	confirmPassword: string;
}

/**
 * 인증번호 재발송 요청
 */
export interface ResendCodeRequest {
	username: string;
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

	/**
	 * 비밀번호 찾기 - 아이디 확인 및 이메일 전송
	 * TODO: API 구현
	 */
	findPassword: async (data: FindPasswordRequest): Promise<FindPasswordResponse> => {
		// TODO: API 구현
		// const response = await apiClient.post<FindPasswordResponse>('/api/v1/auth/find-password', data);
		// return response.data;
		throw new Error('API not implemented');
	},

	/**
	 * 인증번호 확인
	 * TODO: API 구현
	 */
	verifyCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
		// TODO: API 구현
		// const response = await apiClient.post<VerifyCodeResponse>('/api/v1/auth/verify-code', data);
		// return response.data;
		throw new Error('API not implemented');
	},

	/**
	 * 인증번호 재발송
	 * TODO: API 구현
	 */
	resendCode: async (data: ResendCodeRequest): Promise<void> => {
		// TODO: API 구현
		// await apiClient.post('/api/v1/auth/resend-code', data);
		throw new Error('API not implemented');
	},

	/**
	 * 비밀번호 재설정
	 * TODO: API 구현
	 */
	resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
		// TODO: API 구현
		// await apiClient.post('/api/v1/auth/reset-password', data);
		throw new Error('API not implemented');
	},
};
