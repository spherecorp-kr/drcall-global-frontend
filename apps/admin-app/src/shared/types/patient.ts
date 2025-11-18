// ===== DTO (Data Transfer Object) =====
// 서버에서 받는 데이터 구조

export type PatientGrade = 'VIP' | 'RISK' | 'NORMAL';
export type Gender = 'MALE' | 'FEMALE';

export interface PatientManagementDto {
	id: string;
	name: string; // 환자명
	gender: Gender; // 성별
	birthDate: string; // ISO 8601 format (YYYY-MM-DD)
	phoneNumber: string; // 휴대폰 번호
	grade: PatientGrade; // 환자 등급
	lastVisitDate?: string; // ISO 8601 format (마지막 진료 날짜)
	createdAt: string; // ISO 8601 format
	updatedAt: string; // ISO 8601 format
}

// ===== Request/Response Types =====

export interface GetPatientsRequest {
	page?: number;
	size?: number;
	searchQuery?: string; // 환자명, 휴대폰 번호로 검색
	grade?: PatientGrade;
	sortBy?: 'name' | 'birthDate' | 'lastVisitDate' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export interface GetPatientsResponse {
	content: PatientManagementDto[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	size: number;
}

export interface CreatePatientRequest {
	name: string;
	gender: Gender;
	birthDate: string;
	phoneNumber: string;
	grade?: PatientGrade;
}

export interface UpdatePatientRequest {
	name?: string;
	gender?: Gender;
	birthDate?: string;
	phoneNumber?: string;
	grade?: PatientGrade;
}

// ===== UI State Types =====
// 프론트엔드에서 사용하는 데이터 구조 (DTO를 변환한 형태)

export interface PatientManagement {
	id: string;
	name: string;
	gender: Gender;
	genderDisplay: string; // '남성' | '여성'
	birthDate: Date;
	birthDateDisplay: string; // 'DD/MM/YYYY' format
	age: number; // 나이
	phoneNumber: string;
	grade: PatientGrade;
	lastVisitDate?: Date;
	lastVisitDateDisplay: string; // 'DD/MM/YYYY' format or '-'
	createdAt: Date;
	updatedAt: Date;
	// 상세 정보 (선택적, 백엔드 patients 테이블 필드)
	thaiId?: string;
	address?: string;
	addressDetail?: string;
	postalCode?: string;
	height?: number;
	weight?: number;
	bloodType?: string;
}

export interface PatientManagementFilterState {
	searchQuery: string;
	grade?: PatientGrade;
}

// ===== Helper Types =====

export const GENDER_MAP: Record<Gender, string> = {
	MALE: '남자',
	FEMALE: '여자',
};

export const PATIENT_GRADE_MAP: Record<PatientGrade, string> = {
	VIP: 'VIP',
	RISK: 'Risk',
	NORMAL: 'Normal',
};

export const PATIENT_GRADE_COLOR_MAP: Record<PatientGrade, { bg: string; text: string }> = {
	VIP: {
		bg: 'var(--Badge-Badge5, #E6F6FB)',
		text: 'var(--Primary-Blue-70, #00A0D2)',
	},
	RISK: {
		bg: 'var(--Badge-Badge6, #FFE5E5)',
		text: 'var(--System-Error, #FC0606)',
	},
	NORMAL: {
		bg: 'var(--Bg-Gray, #FAFAFA)',
		text: 'var(--Text-60, #6E6E6E)',
	},
};
