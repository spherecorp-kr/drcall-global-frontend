import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '@services/api';
import { logError } from '@utils/errorHandler';

/**
 * Patient interface - 백엔드 patients 테이블과 일치
 * ⚠️ 2025-11-06: firstName/lastName → name 통합, allergies/grade 추가
 */
export interface Patient {
  id: number;
  name: string; // firstName + lastName 통합
  email: string;
  phoneCountryCode: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idCardNumber?: string;
  address?: string;
  addressDetail?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profileImageUrl?: string;
  allergies?: string; // 알레르기 정보 (추가됨)
  grade?: 'VIP' | 'RISK' | 'NORMAL'; // 환자 등급 (추가됨)
  marketingConsent: boolean;
  dataSharingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  // channelUserId는 patient_subscriptions 테이블로 관리됨
}

export interface AuthContextValue {
  user: Patient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider
 *
 * Manages global authentication state:
 * - Automatically fetches user profile on mount (if authenticated)
 * - Provides logout functionality
 * - Tracks loading/error states
 *
 * Authentication tokens:
 * - tempJwt (localStorage): During OTP → Profile registration flow
 * - sid, ctx-{subdomain} (cookies): After registration complete
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  /**
   * Fetch current user profile
   */
  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get('/api/auth/profile');

      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      // Silently handle initial profile fetch errors
      // - 401: handled by axios interceptor
      // - Network errors: expected when backend is down (dev environment)
      // Only log in development mode
      if (import.meta.env.DEV) {
        const isAxiosError = typeof err === 'object' && err !== null && 'response' in err;
        const status = isAxiosError ? (err as { response?: { status?: number } }).response?.status : undefined;
        const message = err instanceof Error ? err.message : String(err);

        if (status !== 401) {
          console.warn('[AuthContext] Profile fetch failed (expected if backend is not running):', message);
        }
      }
      setUser(null);
      // Don't set error state for initial profile fetch - it's not user-facing
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login - refresh profile after authentication
   * Called after OTP verification or profile registration
   */
  const login = async () => {
    await refreshProfile();
  };

  /**
   * Logout - clear all authentication tokens and redirect
   */
  const logout = async () => {
    try {
      setIsLoading(true);

      // Call backend logout endpoint to clear cookies
      await apiClient.post('/api/auth/logout');

      // Clear local storage
      localStorage.removeItem('tempJwt');
      localStorage.removeItem('drcall_web_user_id');

      // Clear user state
      setUser(null);
      setError(null);

      // Redirect to login page
      window.location.href = '/auth/phone-verification';
    } catch (err: unknown) {
      console.error('[AuthContext] Logout failed:', err);
      logError(err, { feature: 'Auth', action: 'logout' });

      // Even if API call fails, clear local state and redirect
      localStorage.removeItem('tempJwt');
      localStorage.removeItem('drcall_web_user_id');
      setUser(null);
      window.location.href = '/auth/phone-verification';
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * On mount: Check if user is authenticated and fetch profile
   */
  useEffect(() => {
    const initAuth = async () => {
      // Skip auth in mock mode
      const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      if (useMockData) {
        setIsLoading(false);
        return;
      }

      const tempJwt = localStorage.getItem('tempJwt');
      const hasCookies = document.cookie.includes('sid');

      // Only fetch profile if we have authentication tokens
      if (tempJwt || hasCookies) {
        await refreshProfile();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
