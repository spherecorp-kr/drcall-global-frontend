import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@services/authService';
import { apiClient } from '@services/api';

// apiClient 모의(Mock) 설정
vi.mock('@services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('sendOtp', () => {
    // OTP 발송 API 호출 시 올바른 엔드포인트와 파라미터를 사용하는지 확인
    it('calls correct API endpoint', async () => {
      (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });
      const params = { phone: '0812345678', phoneCountryCode: '+66' };
      
      const result = await authService.sendOtp(params);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/otp/send', {
        phone: params.phone,
        phoneCountryCode: params.phoneCountryCode,
        verificationType: 'REGISTRATION',
        invitationToken: undefined,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('verifyOtp', () => {
    // 기존 사용자: OTP 검증 후 임시 토큰 저장 및 프로필 확인 성공 시 existingPatient: true 반환
    it('stores tempToken and checks profile (existing user)', async () => {
      const verifyResponse = {
        verified: true,
        message: 'Verified',
        tempToken: 'temp-jwt-token',
      };
      (apiClient.post as any).mockResolvedValueOnce({ data: verifyResponse });
      
      // 프로필 조회 성공 (기존 사용자)
      (apiClient.get as any).mockResolvedValueOnce({ data: { id: 123 } });

      const params = { phone: '0812345678', otpCode: '1234' };
      const result = await authService.verifyOtp(params);

      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/otp/verify', expect.objectContaining({
        phone: params.phone,
        otpCode: params.otpCode
      }));
      expect(localStorage.getItem('tempJwt')).toBe('temp-jwt-token');
      
      // 임시 토큰으로 프로필 조회 호출 확인
      expect(apiClient.get).toHaveBeenCalledWith('/api/auth/profile', expect.objectContaining({
        headers: { Authorization: 'Bearer temp-jwt-token' }
      }));

      expect(result).toEqual({ ...verifyResponse, existingPatient: true });
    });

    // 신규 사용자: 프로필 조회 실패(404) 시 existingPatient: false 반환
    it('returns existingPatient: false if profile not found (new user)', async () => {
      const verifyResponse = { verified: true, message: 'Verified', tempToken: 'temp-jwt-token' };
      (apiClient.post as any).mockResolvedValueOnce({ data: verifyResponse });
      
      // 프로필 조회 실패 (404 - 신규 사용자)
      (apiClient.get as any).mockRejectedValueOnce({ response: { status: 404 } });

      const result = await authService.verifyOtp({ phone: '0812345678', otpCode: '1234' });

      expect(result.existingPatient).toBe(false);
    });
  });
  
  describe('completeProfile', () => {
    // 프로필 완성: API 호출 성공 후 임시 토큰(tempJwt) 제거 확인
    it('completes profile and clears tempJwt', async () => {
        localStorage.setItem('tempJwt', 'temp-jwt-token');
        (apiClient.post as any).mockResolvedValueOnce({ data: { patientId: 123 } });
        
        const request = {
            channelUserId: 'user-123',
            name: 'Test',
            email: 'test@test.com',
            dateOfBirth: '1990-01-01',
            gender: 'MALE' as const,
            marketingConsent: true,
            dataSharingConsent: true
        };

        const result = await authService.completeProfile(request);
        
        expect(apiClient.post).toHaveBeenCalledWith('/api/auth/profile', request, expect.objectContaining({
            headers: { Authorization: 'Bearer temp-jwt-token' },
            withCredentials: true
        }));
        
        // 쿠키 기반 인증으로 전환되므로 임시 토큰 제거 확인
        expect(localStorage.getItem('tempJwt')).toBeNull();
        expect(result).toEqual({ patientId: 123 });
    });
  });
});
