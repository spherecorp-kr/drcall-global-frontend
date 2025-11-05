// ===== DTO (Data Transfer Object) =====
// 서버에서 받는 데이터 구조

export interface HospitalDto {
	id: string;
	name: string; // 병원명
	nameEn: string; // 병원명(영문)
	webBiUrl?: string; // 웹 BI 이미지 URL
	mobileBiUrl?: string; // 모바일 웹 앱 BI 이미지 URL
	bankName?: string; // 은행명
	accountHolder?: string; // 예금주
	accountNumber?: string; // 계좌번호
	websiteUrl?: string; // 병원 홈페이지
	address: string; // 주소
	phoneNumber: string; // 연락처
	createdAt: string; // ISO 8601 format
	updatedAt: string; // ISO 8601 format
}

// ===== Request Types =====

export interface UpdateHospitalRequest {
	name?: string;
	nameEn?: string;
	webBiUrl?: string;
	mobileBiUrl?: string;
	bankName?: string;
	accountHolder?: string;
	accountNumber?: string;
	websiteUrl?: string;
	address?: string;
	phoneNumber?: string;
}

// ===== UI State Types =====

export interface Hospital {
	id: string;
	name: string;
	nameEn: string;
	webBiUrl?: string;
	mobileBiUrl?: string;
	bankName?: string;
	accountHolder?: string;
	accountNumber?: string;
	websiteUrl?: string;
	address: string;
	phoneNumber: string;
	createdAt: Date;
	updatedAt: Date;
}
