import axios from 'axios';
import { logError } from '@utils/errorHandler';
import i18n from '../lib/i18n';
import { getSubdomain } from '@/utils/channelUtils';

/**
 * Validates and returns the API base URL
 * Throws error in production if VITE_API_BASE_URL is not set
 */
function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // API URL must be explicitly set
  if (!apiUrl) {
    const error = new Error('VITE_API_BASE_URL environment variable must be set');
    logError(error, { feature: 'API', action: 'initialization' });
    throw error;
  }

  return apiUrl;
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Axios client with cookie-based authentication
 *
 * Authentication strategy:
 * 1. OTP flow: Uses tempJwt (Bearer token) in localStorage
 * 2. After registration: Uses HTTP-only cookies (sid, ctx-{subdomain})
 * 3. Protected routes: Automatic cookie authentication
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in all requests
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 1. Add Bearer token for temp authentication (during OTP flow)
    // After registration, cookies handle authentication automatically
    const tempJwt = localStorage.getItem('tempJwt');
    if (tempJwt && !config.headers.Authorization) {
      // Only set if not already set (some requests set it explicitly)
      config.headers.Authorization = `Bearer ${tempJwt}`;
    }

    // 2. Add X-Channel-Id header from subdomain
    // Supports: line.localhost, samsung.patient.dev.drcall.global, etc.
    // NO DEFAULT VALUE - subdomain is required for multi-tenancy
    const subdomain = getSubdomain();
    if (subdomain) {
      config.headers['X-Channel-Id'] = subdomain;
      // eslint-disable-next-line no-console
      console.log(`[API] X-Channel-Id: ${subdomain}`);
    } else {
      // No subdomain detected - backend will reject request if channel is required
      // eslint-disable-next-line no-console
      console.warn('[API] No subdomain detected - X-Channel-Id header not added. Use {channel}.localhost or {channel}.patient.{env}.drcall.global');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Auto-unwrap ApiResponse<T> wrapper from backend
    // Backend returns: { success: true, data: {...}, message: null, error: null }
    // Frontend expects: {...}
    if (response.data?.success !== undefined && response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Check if this request wants to skip error toast
    const skipErrorToast = error.config?.skipErrorToast;

    // Auto-skip toast for background/redirect requests
    // These are requests that happen automatically, not from user button clicks
    const isBackgroundRequest =
      requestUrl.includes('/api/v1/auth/profile') ||  // Profile check on mount
      requestUrl.includes('/api/v1/public/channels/validate');  // Channel validation

    // Handle authentication errors
    if (status === 401) {
      // Clear temp JWT and redirect to login (silent, no toast)
      localStorage.removeItem('tempJwt');
      // Cookies are automatically cleared by backend or expired
      window.location.href = '/auth/phone-verification';
      return Promise.reject(error);
    }

    // Show error toast for user-facing errors (position: bottom to show above button)
    const showErrorToast = (message: string) => {
      if (skipErrorToast || isBackgroundRequest) return; // Skip toast if requested or background request
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, 'error', 'bottom');
      }
    };

    // Handle other common errors
    if (status === 403) {
      // 403 Forbidden: Silent redirect to phone verification (no toast)
      // This typically means the user needs to authenticate
      logError(error, { feature: 'API', action: 'forbidden', metadata: { url: error.config?.url } });
      // No toast - just let the AuthContext handle redirect
    } else if (status === 404) {
      logError(error, { feature: 'API', action: 'not_found', metadata: { url: error.config?.url } });
      const errorMessage = error.response?.data?.message || i18n.t('error.api.notFound');
      showErrorToast(errorMessage);
    } else if (status >= 500) {
      logError(error, { feature: 'API', action: 'server_error', metadata: { url: error.config?.url, status } });
      showErrorToast(i18n.t('error.api.serverError'));
    } else if (status >= 400) {
      // Other 4xx errors (bad request, etc.)
      logError(error, { feature: 'API', action: 'client_error', metadata: { url: error.config?.url, status } });
      const errorMessage = error.response?.data?.message || i18n.t('error.api.clientError');
      showErrorToast(errorMessage);
    } else if (!error.response) {
      // Network error
      logError(error, { feature: 'API', action: 'network_error', metadata: { message: error.message } });
      showErrorToast(i18n.t('error.api.networkError'));
    }

    return Promise.reject(error);
  }
);
