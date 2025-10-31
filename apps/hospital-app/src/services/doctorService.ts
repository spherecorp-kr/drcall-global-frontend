import { apiClient } from './api';
import type {
	DoctorManagementDto,
	GetDoctorsRequest,
	GetDoctorsResponse,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	DoctorManagement,
	DayOfWeek,
	DAY_MAP,
} from '@/shared/types/doctor';
import { mockDoctors } from '@/mocks/doctorData';

// 개발 환경에서 목 데이터 사용 여부
const USE_MOCK_DATA = import.meta.env.DEV;

/**
 * DTO를 UI 모델로 변환하는 유틸리티 함수
 */
export function transformDoctorDto(dto: DoctorManagementDto): DoctorManagement {
	// 진료 가능한 요일 추출
	const availableDays: string[] = [];
	const dayKeys: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	dayKeys.forEach((day) => {
		const slots = dto.availableSchedule[day];
		if (slots && slots.length > 0) {
			availableDays.push(DAY_MAP[day]);
		}
	});

	// 진료 가능 요일 표시 문자열 생성 (예: "월/수/금")
	const availableTimeDisplay = availableDays.length > 0 ? availableDays.join('/') : '-';

	return {
		id: dto.id,
		name: dto.name,
		nameEn: dto.nameEn,
		userId: dto.userId,
		availableDays,
		availableTimeDisplay,
		availableSchedule: dto.availableSchedule,
		isActive: dto.isActive,
		createdAt: new Date(dto.createdAt),
		updatedAt: new Date(dto.updatedAt),
	};
}

/**
 * 의사 관리 API 서비스
 */
export const doctorService = {
	/**
	 * 의사 목록 조회 (페이지네이션)
	 */
	async getDoctors(params: GetDoctorsRequest = {}): Promise<GetDoctorsResponse> {
		const { page = 0, size = 10, searchQuery, isRegisteredOnly } = params;

		// 목 데이터 사용
		if (USE_MOCK_DATA) {
			// 시뮬레이션을 위한 딜레이
			await new Promise((resolve) => setTimeout(resolve, 300));

			let filteredDoctors = [...mockDoctors];

			// 검색 필터
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				filteredDoctors = filteredDoctors.filter(
					(doctor) =>
						doctor.name.toLowerCase().includes(query) ||
						doctor.nameEn.toLowerCase().includes(query) ||
						doctor.userId.toLowerCase().includes(query),
				);
			}

			// 등록 필터
			if (isRegisteredOnly) {
				filteredDoctors = filteredDoctors.filter((doctor) => doctor.isActive);
			}

			// 페이지네이션
			const totalElements = filteredDoctors.length;
			const totalPages = Math.ceil(totalElements / size);
			const start = page * size;
			const end = start + size;
			const content = filteredDoctors.slice(start, end);

			return {
				content,
				totalElements,
				totalPages,
				currentPage: page,
				size,
			};
		}

		// 실제 API 호출
		const response = await apiClient.get<GetDoctorsResponse>('/api/v1/doctors', {
			params: {
				page,
				size,
				searchQuery,
				isRegisteredOnly,
			},
		});
		return response.data;
	},

	/**
	 * 의사 상세 조회
	 */
	async getDoctor(id: string): Promise<DoctorManagementDto> {
		const response = await apiClient.get<DoctorManagementDto>(`/api/v1/doctors/${id}`);
		return response.data;
	},

	/**
	 * 의사 등록
	 */
	async createDoctor(data: CreateDoctorRequest): Promise<DoctorManagementDto> {
		const response = await apiClient.post<DoctorManagementDto>('/api/v1/doctors', data);
		return response.data;
	},

	/**
	 * 의사 정보 수정
	 */
	async updateDoctor(id: string, data: UpdateDoctorRequest): Promise<DoctorManagementDto> {
		const response = await apiClient.patch<DoctorManagementDto>(`/api/v1/doctors/${id}`, data);
		return response.data;
	},

	/**
	 * 의사 삭제
	 */
	async deleteDoctor(id: string): Promise<void> {
		await apiClient.delete(`/api/v1/doctors/${id}`);
	},

	/**
	 * 의사 계정 활성화/비활성화
	 */
	async toggleDoctorStatus(id: string, isActive: boolean): Promise<DoctorManagementDto> {
		const response = await apiClient.patch<DoctorManagementDto>(`/api/v1/doctors/${id}/status`, {
			isActive,
		});
		return response.data;
	},
};
