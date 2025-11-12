import axios from 'axios';
import { logError } from '@utils/errorHandler';
import i18n from '../lib/i18n';

/**
 * Validates and returns the API base URL
 * Throws error in production if VITE_API_BASE_URL is not set
 */
function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  // In production, API URL must be explicitly set
  if (isProduction && !apiUrl) {
    const error = new Error('VITE_API_BASE_URL environment variable must be set in production');
    logError(error, { feature: 'API', action: 'initialization' });
    throw error;
  }

  // In development, allow localhost fallback
  if (isDevelopment && !apiUrl) {
    // eslint-disable-next-line no-console
    console.warn('VITE_API_BASE_URL not set, using localhost:8080 as fallback');
    return 'http://localhost:8080';
  }

  return apiUrl || 'http://localhost:8080';
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

/**
 * Extract subdomain from hostname for channel identification
 * Examples:
 * - Production: samsung-line.dev.drcall.global → samsung-line
 * - Development: samsung-line.localhost:3000 → samsung-line
 */
function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  if (parts.length >= 2) {
    const subdomain = parts[0];
    if (subdomain !== 'localhost' && !/^\d+$/.test(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Only add Bearer token for temp authentication (during OTP flow)
    // After registration, cookies handle authentication automatically
    const tempJwt = localStorage.getItem('tempJwt');
    if (tempJwt && !config.headers.Authorization) {
      // Only set if not already set (some requests set it explicitly)
      config.headers.Authorization = `Bearer ${tempJwt}`;
    }

    // Add X-Line-UserId header for LINE LIFF authentication
    // ChannelAuthenticationFilter checks this header for LIFF userId authentication
    const liffUserId = sessionStorage.getItem('liff_user_id');
    if (liffUserId) {
      config.headers['X-Line-UserId'] = liffUserId;
    }

    // Add X-Channel-Id header for multi-tenancy
    // Backend uses this to identify which hospital channel this request belongs to
    const channelId = sessionStorage.getItem('channel_id');
    if (channelId) {
      config.headers['X-Channel-Id'] = channelId;
    } else {
      // If channel ID not set, try to extract subdomain and lookup channel
      const subdomain = getSubdomain();
      if (subdomain) {
        // Store subdomain for debugging/logging
        sessionStorage.setItem('channel_subdomain', subdomain);

        // Note: Channel ID should be fetched from backend API on app initialization
        // For now, we log a warning if channel ID is not set
        console.warn('[API] X-Channel-Id not set. Subdomain:', subdomain);
      }
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
    // Check if this request wants to skip error toast
    const skipErrorToast = error.config?.skipErrorToast;

    // Handle authentication errors
    if (status === 401) {
      // Clear temp JWT and redirect to login
      localStorage.removeItem('tempJwt');
      // Cookies are automatically cleared by backend or expired
      window.location.href = '/auth/phone-verification';
      return Promise.reject(error);
    }

    // Show error toast for user-facing errors (position: bottom to show above button)
    const showErrorToast = (message: string) => {
      if (skipErrorToast) return; // Skip toast if requested
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, 'error', 'bottom');
      }
    };

    // Handle other common errors
    if (status === 403) {
      logError(error, { feature: 'API', action: 'forbidden', metadata: { url: error.config?.url } });
      showErrorToast(i18n.t('error.api.forbidden'));
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
