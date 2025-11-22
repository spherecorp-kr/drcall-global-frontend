import axios from 'axios';
import i18n from '../i18n/i18n';

/**
 * Validates and returns the API base URL
 * Throws error in production if VITE_API_BASE_URL is not set
 */
function getApiBaseUrl(): string {
	const apiUrl = import.meta.env.VITE_API_BASE_URL;

	// API URL must be explicitly set
	if (!apiUrl) {
		const error = new Error('VITE_API_BASE_URL environment variable must be set');
		console.error('[API] Initialization error:', error);
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
		// JWT Bearer Token 인증 (hospital-app)
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
			// 로그인 API 호출 시에는 리다이렉트하지 않음 (Login.tsx에서 에러 처리)
			const isLoginRequest = error.config?.url?.includes('/auth/login');
			
			if (!isLoginRequest) {
				// Clear token and redirect to login
				localStorage.removeItem('accessToken');
				localStorage.removeItem('user');
				window.location.href = '/login';
			}
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


export default apiClient;
