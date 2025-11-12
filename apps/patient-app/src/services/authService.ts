import { apiClient } from './api';

/**
 * Auth Service - Stateless JWT 인증 API
 * Base URL: /api/v1/auth
 *
 * 인증 플로우:
 * 1. OTP 발송 → 2. OTP 검증 (Temp Token) → 3. 프로필 등록 (Access/Refresh Token in Cookies)
 */

export interface SendOtpRequest {
  phone: string;
  phoneCountryCode?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  phone: string;
  phoneCountryCode?: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  tempToken: string;
}

export interface ProfileResponse {
  id: string;  // externalId
  phone: string;
  phoneCountryCode: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idCardNumber?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  profileImageUrl?: string;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileWithSubscriptionResponse {
  profile: ProfileResponse;
  hasSubscriptionForCurrentChannel: boolean;
}

export interface ProfileRegisterRequest {
  tempToken: string;
  channelUserId: string;
  name: string;
  phone: string;
  phoneCountryCode: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idCardNumber?: string;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
}

export interface ProfileRegisterResponse {
  success: boolean;
  message: string;
  patientId: string;
  subscriptionId: string;
}

export const authService = {
  /**
   * OTP 발송 (SMS 인증 코드)
   */
  sendOtp: async (request: SendOtpRequest): Promise<SendOtpResponse> => {
    const response = await apiClient.post<SendOtpResponse>('/api/v1/auth/otp/send', {
      phone: request.phone,
      phoneCountryCode: request.phoneCountryCode || '+66',
    });
    return response.data;
  },

  /**
   * OTP 검증 및 임시 JWT 발급
   */
  verifyOtp: async (request: VerifyOtpRequest): Promise<VerifyOtpResponse & {
    existingPatient?: boolean;
    needsSubscription?: boolean;
  }> => {
    const response = await apiClient.post<VerifyOtpResponse>('/api/v1/auth/otp/verify', {
      phone: request.phone,
      phoneCountryCode: request.phoneCountryCode || '+66',
      otpCode: request.otpCode,
    });

    // 임시 JWT를 localStorage에 저장
    if (response.data.tempToken) {
      localStorage.setItem('tempJwt', response.data.tempToken);

      // 프로필 조회로 기존 환자 여부 + 구독 여부 확인
      try {
        const profileResponse = await apiClient.get<ProfileWithSubscriptionResponse>(
          '/api/v1/auth/profile',
          {
            headers: { 'Authorization': `Bearer ${response.data.tempToken}` },
            skipErrorToast: true, // 404는 정상 케이스(신규 사용자)이므로 에러 토스트 표시 안 함
          } as any
        );

        const hasProfile = profileResponse.data?.profile?.id != null;
        const hasSubscription = profileResponse.data?.hasSubscriptionForCurrentChannel ?? false;

        return {
          ...response.data,
          existingPatient: hasProfile && hasSubscription,  // 둘 다 있어야 기존 환자
          needsSubscription: hasProfile && !hasSubscription  // 프로필은 있지만 구독 없음
        };
      } catch (error) {
        // 프로필 조회 실패 시 신규 환자로 간주 (404 = 신규 사용자)
        return {
          ...response.data,
          existingPatient: false,
          needsSubscription: false
        };
      }
    }

    return response.data;
  },

  /**
   * 프로필 조회 (임시 JWT로)
   */
  getProfile: async (): Promise<ProfileWithSubscriptionResponse> => {
    const tempJwt = localStorage.getItem('tempJwt');
    const response = await apiClient.get<ProfileWithSubscriptionResponse>('/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${tempJwt}`,
      },
    });
    return response.data;
  },

  /**
   * 프로필 등록 (회원가입 완료)
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
   *
   * 쿠키는 HttpOnly로 자동 관리됨 (보안)
   */
  registerProfile: async (request: ProfileRegisterRequest): Promise<ProfileRegisterResponse> => {
    const response = await apiClient.post<ProfileRegisterResponse>(
      '/api/v1/auth/profile/register',
      request,
      {
        withCredentials: true, // 쿠키 포함
      }
    );

    // 임시 JWT 제거 (이제 쿠키 기반 인증 사용)
    localStorage.removeItem('tempJwt');

    return response.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout', null, {
      withCredentials: true, // 쿠키 포함
    });
    localStorage.removeItem('tempJwt');
  },
};
