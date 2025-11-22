import axios from 'axios';
import i18n from '../i18n/i18n';

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
		console.error('[API] Initialization error:', error);
		throw error;
	}

	// In development, allow localhost fallback (admin-service default port: 18080)
	if (isDevelopment && !apiUrl) {
		console.warn('VITE_API_BASE_URL not set, using localhost:18080 as fallback');
		return 'http://localhost:18080';
	}

	return apiUrl || 'http://localhost:18080';
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Axios client with JWT Bearer token authentication
 *
 * Authentication strategy:
 * 1. Login: POST /api/v1/auth/login → receive accessToken
 * 2. Store token in localStorage
 * 3. Include token in Authorization header for all API requests
 */
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: false, // JWT token-based auth, no cookies needed
});


// Request interceptor
apiClient.interceptors.request.use(
	(config) => {
		// Add JWT Bearer token to Authorization header
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken && !config.headers.Authorization) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor
apiClient.interceptors.response.use(
	(response) => {
		// Auto-unwrap ApiResponse<T> wrapper from backend
		// Backend returns: { success: true, data: {...}, message: null, error: null }
		// Frontend expects: {...}
		if (response.data?.success !== undefined) {
			// success: false인 경우 에러로 처리
			if (response.data.success === false) {
				const error = new Error(response.data.error?.message || response.data.message || '요청에 실패했습니다.') as Error & { response?: unknown };
				error.response = {
					...response,
					status: response.data.error?.status || 400,
					data: response.data,
				};
				return Promise.reject(error);
			}
			// success: true이고 data가 있으면 unwrap
			if (response.data.data !== undefined) {
				response.data = response.data.data;
			}
		}
		return response;
	},
	(error) => {
		const status = error.response?.status;
		// Check if this request wants to skip error toast
		const skipErrorToast = error.config?.skipErrorToast;

		// Handle authentication errors
		if (status === 401) {
			// Clear access token and redirect to login
			localStorage.removeItem('accessToken');
			localStorage.removeItem('user');
			// Only redirect if not already on login page
			if (!window.location.pathname.includes('/login')) {
				window.location.href = '/login';
			}
			return Promise.reject(error);
		}

		// Show error toast for user-facing errors (position: bottom to show above button)
		const showErrorToast = (message: string) => {
			if (skipErrorToast) return; // Skip toast if requested
			if (typeof window !== 'undefined' && 'showToast' in window) {
				(window as Window & { showToast?: (message: string, type: string, position: string) => void }).showToast?.(message, 'error', 'bottom');
			}
		};

		// Handle other common errors
		if (status === 403) {
			console.error('[API] Forbidden error:', error.config?.url);
			showErrorToast(i18n.t('error.api.forbidden'));
		} else if (status === 404) {
			console.error('[API] Not found error:', error.config?.url);
			const errorMessage = error.response?.data?.message || i18n.t('error.api.notFound');
			showErrorToast(errorMessage);
		} else if (status >= 500) {
			console.error('[API] Server error:', error.config?.url, status);
			showErrorToast(i18n.t('error.api.serverError'));
		} else if (status >= 400) {
			// Other 4xx errors (bad request, etc.)
			console.error('[API] Client error:', error.config?.url, status);
			const errorMessage = error.response?.data?.message || i18n.t('error.api.clientError');
			showErrorToast(errorMessage);
		} else if (!error.response) {
			// Network error
			console.error('[API] Network error:', error.message);
			showErrorToast(i18n.t('error.api.networkError'));
		}

		return Promise.reject(error);
	},
);
