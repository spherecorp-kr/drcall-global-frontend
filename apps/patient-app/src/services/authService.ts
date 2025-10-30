import { apiClient } from './api';

/**
 * Auth Service - 백엔드 API 연동
 * Base URL: http://localhost:18081 (Patient Service)
 */

export interface SendOtpRequest {
  phone: string;
  phoneCountryCode?: string;
  verificationType?: 'REGISTRATION' | 'LOGIN' | 'INVITATION_VERIFY';
  invitationToken?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  phoneCountryCode?: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  message: string;
  tempToken: string;
}

export interface ProfileRequest {
  channelUserId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idCardNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
}

export const authService = {
  /**
   * OTP 발송 (SMS 인증 코드)
   */
  sendOtp: async (request: SendOtpRequest) => {
    const response = await apiClient.post('/api/auth/otp/send', {
      phone: request.phone,
      phoneCountryCode: request.phoneCountryCode || '+66',
      verificationType: request.verificationType || 'REGISTRATION',
      invitationToken: request.invitationToken,
    });
    return response.data;
  },

  /**
   * OTP 검증 및 임시 JWT 발급
   */
  verifyOtp: async (request: VerifyOtpRequest): Promise<VerifyOtpResponse & { existingPatient?: boolean }> => {
    const response = await apiClient.post<VerifyOtpResponse>('/api/auth/otp/verify', {
      phone: request.phone,
      phoneCountryCode: request.phoneCountryCode || '+66',
      otpCode: request.otpCode,
    });

    // 임시 JWT를 localStorage에 저장
    if (response.data.tempToken) {
      localStorage.setItem('tempJwt', response.data.tempToken);

      // 프로필 조회로 기존 환자 여부 확인
      try {
        const profileResponse = await apiClient.get('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${response.data.tempToken}` },
          skipErrorToast: true, // 404는 정상 케이스(신규 사용자)이므로 에러 토스트 표시 안 함
        } as any);

        // 프로필에 ID가 있으면 기존 환자
        const existingPatient = profileResponse.data?.id != null;
        return { ...response.data, existingPatient };
      } catch (error) {
        // 프로필 조회 실패 시 신규 환자로 간주 (404 = 신규 사용자)
        return { ...response.data, existingPatient: false };
      }
    }

    return response.data;
  },

  /**
   * 프로필 조회 (임시 JWT로)
   */
  getProfile: async () => {
    const tempJwt = localStorage.getItem('tempJwt');
    const response = await apiClient.get('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${tempJwt}`,
      },
    });
    return response.data;
  },

  /**
   * 프로필 완성 (회원가입 완료)
   *
   * 백엔드는 쿠키 기반 인증을 사용합니다:
   * - sid 쿠키 (7일) - 세션 토큰
   * - ctx-{subdomain} 쿠키 (30일) - 채널 컨텍스트 토큰
   *
   * 응답:
   * - success: 성공 여부
   * - message: 응답 메시지
   * - patientId: 환자 ID
   * - subscriptionId: 구독 ID
   * - ctxToken: 컨텍스트 토큰 (쿠키에도 저장됨)
   * - sidToken: 세션 토큰 (쿠키에도 저장됨)
   */
  completeProfile: async (request: ProfileRequest) => {
    const tempJwt = localStorage.getItem('tempJwt');
    const response = await apiClient.post('/api/auth/profile', request, {
      headers: {
        'Authorization': `Bearer ${tempJwt}`,
      },
      withCredentials: true, // 쿠키 포함
    });

    // 임시 JWT 제거 (이제 쿠키 기반 인증 사용)
    localStorage.removeItem('tempJwt');

    // 응답에 ctxToken, sidToken이 포함되지만 쿠키로 자동 관리됨
    // localStorage에는 저장하지 않음 (보안상 HttpOnly 쿠키 사용)

    return response.data;
  },
};
