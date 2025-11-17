import { apiClient } from './api';
import type {
	HospitalOnboardingRequest,
	HospitalOnboardingResponse,
} from '@/types/onboarding';

/**
 * Hospital Onboarding Service
 */
export const onboardingService = {
	/**
	 * 병원 온보딩 (통합 생성)
	 * POST /api/v1/admin/hospitals
	 */
	onboardHospital: async (
		request: HospitalOnboardingRequest
	): Promise<HospitalOnboardingResponse> => {
		const response = await apiClient.post<HospitalOnboardingResponse>(
			'/api/v1/admin/hospitals',
			request
		);
		return response.data;
	},
};

