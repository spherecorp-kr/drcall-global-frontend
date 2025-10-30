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

	// In development, allow localhost fallback
	if (isDevelopment && !apiUrl) {
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
			if (typeof window !== 'undefined' && 'showToast' in window) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).showToast(message, 'error', 'bottom');
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
