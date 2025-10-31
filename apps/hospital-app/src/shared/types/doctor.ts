// ===== DTO (Data Transfer Object) =====
// 서버에서 받는 데이터 구조

export interface DoctorManagementDto {
	id: string;
	name: string; // 의사명
	nameEn: string; // 의사명 (영문)
	userId: string; // 아이디
	availableSchedule: AvailableScheduleDto; // 진료 가능 시간
	isActive: boolean; // 계정 활성화
	createdAt: string; // ISO 8601 format
	updatedAt: string; // ISO 8601 format
}

export interface AvailableScheduleDto {
	monday?: TimeSlotDto[];
	tuesday?: TimeSlotDto[];
	wednesday?: TimeSlotDto[];
	thursday?: TimeSlotDto[];
	friday?: TimeSlotDto[];
	saturday?: TimeSlotDto[];
	sunday?: TimeSlotDto[];
}

export interface TimeSlotDto {
	startTime: string; // "09:00"
	endTime: string; // "12:00"
}

// ===== Request/Response Types =====

export interface GetDoctorsRequest {
	page?: number;
	size?: number;
	searchQuery?: string;
	isRegisteredOnly?: boolean;
	sortBy?: 'name' | 'createdAt' | 'updatedAt';
	sortOrder?: 'asc' | 'desc';
}

export interface GetDoctorsResponse {
	content: DoctorManagementDto[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	size: number;
}

export interface CreateDoctorRequest {
	name: string;
	nameEn: string;
	userId: string;
	password: string;
	availableSchedule: AvailableScheduleDto;
	isActive: boolean;
}

export interface UpdateDoctorRequest {
	name?: string;
	nameEn?: string;
	availableSchedule?: AvailableScheduleDto;
	isActive?: boolean;
}

// ===== UI State Types =====
// 프론트엔드에서 사용하는 데이터 구조 (DTO를 변환한 형태)

export interface DoctorManagement {
	id: string;
	name: string;
	nameEn: string;
	userId: string;
	availableDays: string[]; // ['월', '화', '수', '목', '금', '토', '일']
	availableTimeDisplay: string; // "월/수/금"
	availableSchedule: AvailableScheduleDto;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface DoctorManagementFilterState {
	searchQuery: string;
	isRegisteredOnly: boolean;
}

// ===== Helper Types =====

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_MAP: Record<DayOfWeek, string> = {
	monday: '월',
	tuesday: '화',
	wednesday: '수',
	thursday: '목',
	friday: '금',
	saturday: '토',
	sunday: '일',
};
