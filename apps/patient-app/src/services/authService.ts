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
  tempToken: string;
  channelUserId: string;
  name: string;
  phone: string;
  phoneCountryCode?: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idCardNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  postalCode?: string;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
}

export interface ProfileRegisterResponse {
  success: boolean;
  message: string;
  patientId?: number;
  subscriptionId?: number;
}

export const authService = {
  /**
   * OTP 발송 (SMS 인증 코드)
   */
  sendOtp: async (request: SendOtpRequest) => {
    const response = await apiClient.post('/api/v1/auth/otp/send', {
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
    const response = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/otp/verify', {
      phone: request.phone,
      phoneCountryCode: request.phoneCountryCode || '+66',
      otpCode: request.otpCode,
    });

    // 임시 JWT를 localStorage에 저장
    if (response.data.tempToken) {
      localStorage.setItem('tempJwt', response.data.tempToken);

      // 기존 환자 여부 확인
      try {
        await authService.getProfile();
        // 프로필 조회 성공 → 기존 환자
        return { ...response.data, existingPatient: true };
      } catch (error: any) {
        // 404 에러 → 신규 환자
        if (error.response?.status === 404) {
          return { ...response.data, existingPatient: false };
        }
        // 기타 에러는 재throw
        throw error;
      }
    }

    return response.data;
  },

  /**
   * 프로필 조회 (임시 JWT로)
   */
  getProfile: async () => {
    const tempJwt = localStorage.getItem('tempJwt');
    const response = await apiClient.get('/api/v1/auth/profile', {
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
   * - sid 쿠키 (7일) - Access Token
   * - ctx-{subdomain} 쿠키 (30일) - Refresh Token
   *
   * 응답:
   * - success: 성공 여부
   * - message: 응답 메시지
   * - patientId: 환자 ID
   * - subscriptionId: 구독 ID
   */
  completeProfile: async (request: ProfileRequest): Promise<ProfileRegisterResponse> => {
    const response = await apiClient.post<ProfileRegisterResponse>('/api/v1/auth/profile', {
      ...request,
      phoneCountryCode: request.phoneCountryCode || '+66',
    }, {
      withCredentials: true, // 쿠키 포함
    });

    // 성공 시 임시 JWT 제거 (이제 쿠키 기반 인증 사용)
    if (response.data.success) {
      localStorage.removeItem('tempJwt');
    }

    return response.data;
  },
};
