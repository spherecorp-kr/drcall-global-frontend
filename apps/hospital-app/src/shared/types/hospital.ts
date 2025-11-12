// ===== DTO (Data Transfer Object) =====
// 서버에서 받는 데이터 구조
// ⚠️ 백엔드 hospitals 테이블과 일치

export interface HospitalDto {
	id: string;
	nameEn: string; // 병원명 (영어)
	nameLocal: string; // 병원명 (현지어) - 백엔드는 name_local
	email?: string; // 이메일
	phone: string; // 전화번호
	website?: string; // 웹사이트 URL
	address: string; // 주소
	addressDetail?: string; // 상세주소
	postalCode?: string; // 우편번호
	logoUrl?: string; // 로고 URL (웹)
	mobileLogoUrl?: string; // 모바일 로고 URL
	bankName?: string; // 은행명
	accountHolder?: string; // 예금주
	accountNumber?: string; // 계좌번호
	createdAt: string; // ISO 8601 format
	updatedAt: string; // ISO 8601 format
}

// ===== Request Types =====

export interface UpdateHospitalRequest {
	nameEn?: string;
	nameLocal?: string;
	email?: string;
	phone?: string;
	website?: string;
	address?: string;
	addressDetail?: string;
	postalCode?: string;
	logoUrl?: string;
	mobileLogoUrl?: string;
	bankName?: string;
	accountHolder?: string;
	accountNumber?: string;
}

// ===== UI State Types =====

export interface Hospital {
	id: string;
	nameEn: string;
	nameLocal: string;
	email?: string;
	phone: string;
	website?: string;
	address: string;
	addressDetail?: string;
	postalCode?: string;
	logoUrl?: string;
	mobileLogoUrl?: string;
	bankName?: string;
	accountHolder?: string;
	accountNumber?: string;
	createdAt: Date;
	updatedAt: Date;
}
