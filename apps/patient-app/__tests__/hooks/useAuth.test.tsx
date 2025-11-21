import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuth } from '@hooks/useAuth';
import { AuthProvider } from '@contexts/AuthContext';
import { apiClient } from '@services/api';

// Mock apiClient using alias to match implementation
vi.mock('@services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock errorHandler using alias
vi.mock('@utils/errorHandler', () => ({
  logError: vi.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Ensure mock data is disabled
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // AuthProvider 외부 사용 시 에러 발생 테스트
  it('throws error if used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    consoleSpy.mockRestore();
  });

  // 토큰 존재 시 초기화 테스트: 로딩 상태 시작 -> 프로필 조회 -> 인증 완료 상태 확인
  it('initializes with loading state and fetches profile if token exists', async () => {
    localStorage.setItem('tempJwt', 'test-token');
    (apiClient.get as any).mockResolvedValueOnce({
      data: { id: 1, name: 'Test User', email: 'test@example.com' }
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/profile');
  });

  // 토큰 미존재 시 초기화 테스트: 로딩 완료 후 미인증 상태 확인 (API 호출 없음)
  it('initializes with unauthenticated state if no token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Should finish loading quickly without fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  // 로그인 기능 테스트: login 호출 시 프로필 갱신 확인
  it('login calls refreshProfile', async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      data: { id: 1, name: 'Logged In User' }
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
        // Manually trigger login
        await result.current.login();
    });

    await waitFor(() => {
      expect(result.current.user).toEqual({ id: 1, name: 'Logged In User' });
    });
  });

  // 로그아웃 기능 테스트: API 호출, 로컬 스토리지/상태 초기화, 리다이렉트 확인
  it('logout clears state and storage', async () => {
    localStorage.setItem('tempJwt', 'test-token');
    localStorage.setItem('drcall_web_user_id', '123');
    (apiClient.get as any).mockResolvedValueOnce({ data: { id: 1 } });
    (apiClient.post as any).mockResolvedValueOnce({});

    // Mock window.location
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(localStorage.getItem('tempJwt')).toBeNull();
    expect(localStorage.getItem('drcall_web_user_id')).toBeNull();
    expect(result.current.user).toBeNull();
    expect(window.location.href).toBe('/auth/phone-verification');

    // Restore window.location
    (window as any).location = originalLocation;
  });
});
