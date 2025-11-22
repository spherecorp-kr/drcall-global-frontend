// 국가 코드 목록 (ISO 3166-1 alpha-2)
export const COUNTRY_CODES = [
	{ code: 'KR', name: '대한민국', nameEn: 'South Korea', dialCode: '+82' },
	{ code: 'TH', name: '태국', nameEn: 'Thailand', dialCode: '+66' },
	{ code: 'US', name: '미국', nameEn: 'United States', dialCode: '+1' },
	{ code: 'JP', name: '일본', nameEn: 'Japan', dialCode: '+81' },
	{ code: 'CN', name: '중국', nameEn: 'China', dialCode: '+86' },
	{ code: 'VN', name: '베트남', nameEn: 'Vietnam', dialCode: '+84' },
	{ code: 'SG', name: '싱가포르', nameEn: 'Singapore', dialCode: '+65' },
	{ code: 'MY', name: '말레이시아', nameEn: 'Malaysia', dialCode: '+60' },
	{ code: 'PH', name: '필리핀', nameEn: 'Philippines', dialCode: '+63' },
	{ code: 'ID', name: '인도네시아', nameEn: 'Indonesia', dialCode: '+62' },
	{ code: 'IN', name: '인도', nameEn: 'India', dialCode: '+91' },
	{ code: 'AU', name: '호주', nameEn: 'Australia', dialCode: '+61' },
	{ code: 'NZ', name: '뉴질랜드', nameEn: 'New Zealand', dialCode: '+64' },
	{ code: 'GB', name: '영국', nameEn: 'United Kingdom', dialCode: '+44' },
	{ code: 'DE', name: '독일', nameEn: 'Germany', dialCode: '+49' },
	{ code: 'FR', name: '프랑스', nameEn: 'France', dialCode: '+33' },
	{ code: 'IT', name: '이탈리아', nameEn: 'Italy', dialCode: '+39' },
	{ code: 'ES', name: '스페인', nameEn: 'Spain', dialCode: '+34' },
	{ code: 'CA', name: '캐나다', nameEn: 'Canada', dialCode: '+1' },
	{ code: 'MX', name: '멕시코', nameEn: 'Mexico', dialCode: '+52' },
] as const;

// 타임존 목록
export const TIMEZONES = [
	{ value: 'Asia/Seoul', label: '서울 (UTC+09:00)', offset: '+09:00' },
	{ value: 'Asia/Bangkok', label: '방콕 (UTC+07:00)', offset: '+07:00' },
	{ value: 'Asia/Tokyo', label: '도쿄 (UTC+09:00)', offset: '+09:00' },
	{ value: 'Asia/Shanghai', label: '상하이 (UTC+08:00)', offset: '+08:00' },
	{ value: 'Asia/Ho_Chi_Minh', label: '호치민 (UTC+07:00)', offset: '+07:00' },
	{ value: 'Asia/Singapore', label: '싱가포르 (UTC+08:00)', offset: '+08:00' },
	{ value: 'Asia/Kuala_Lumpur', label: '쿠알라룸푸르 (UTC+08:00)', offset: '+08:00' },
	{ value: 'Asia/Manila', label: '마닐라 (UTC+08:00)', offset: '+08:00' },
	{ value: 'Asia/Jakarta', label: '자카르타 (UTC+07:00)', offset: '+07:00' },
	{ value: 'Asia/Kolkata', label: '콜카타 (UTC+05:30)', offset: '+05:30' },
	{ value: 'Australia/Sydney', label: '시드니 (UTC+10:00)', offset: '+10:00' },
	{ value: 'Pacific/Auckland', label: '오클랜드 (UTC+12:00)', offset: '+12:00' },
	{ value: 'Europe/London', label: '런던 (UTC+00:00)', offset: '+00:00' },
	{ value: 'Europe/Berlin', label: '베를린 (UTC+01:00)', offset: '+01:00' },
	{ value: 'Europe/Paris', label: '파리 (UTC+01:00)', offset: '+01:00' },
	{ value: 'Europe/Rome', label: '로마 (UTC+01:00)', offset: '+01:00' },
	{ value: 'Europe/Madrid', label: '마드리드 (UTC+01:00)', offset: '+01:00' },
	{ value: 'America/New_York', label: '뉴욕 (UTC-05:00)', offset: '-05:00' },
	{ value: 'America/Los_Angeles', label: '로스앤젤레스 (UTC-08:00)', offset: '-08:00' },
	{ value: 'America/Chicago', label: '시카고 (UTC-06:00)', offset: '-06:00' },
	{ value: 'America/Toronto', label: '토론토 (UTC-05:00)', offset: '-05:00' },
	{ value: 'America/Mexico_City', label: '멕시코시티 (UTC-06:00)', offset: '-06:00' },
] as const;

// 통화 목록
export const CURRENCIES = [
	{ code: 'KRW', name: '원', symbol: '₩', country: 'KR' },
	{ code: 'THB', name: '바트', symbol: '฿', country: 'TH' },
	{ code: 'USD', name: '달러', symbol: '$', country: 'US' },
	{ code: 'JPY', name: '엔', symbol: '¥', country: 'JP' },
	{ code: 'CNY', name: '위안', symbol: '¥', country: 'CN' },
	{ code: 'EUR', name: '유로', symbol: '€', country: 'EU' },
	{ code: 'GBP', name: '파운드', symbol: '£', country: 'GB' },
	{ code: 'AUD', name: '호주 달러', symbol: 'A$', country: 'AU' },
	{ code: 'CAD', name: '캐나다 달러', symbol: 'C$', country: 'CA' },
	{ code: 'SGD', name: '싱가포르 달러', symbol: 'S$', country: 'SG' },
	{ code: 'MYR', name: '링깃', symbol: 'RM', country: 'MY' },
	{ code: 'PHP', name: '페소', symbol: '₱', country: 'PH' },
	{ code: 'IDR', name: '루피아', symbol: 'Rp', country: 'ID' },
	{ code: 'INR', name: '루피', symbol: '₹', country: 'IN' },
	{ code: 'VND', name: '동', symbol: '₫', country: 'VN' },
	{ code: 'NZD', name: '뉴질랜드 달러', symbol: 'NZ$', country: 'NZ' },
	{ code: 'MXN', name: '멕시코 페소', symbol: 'MX$', country: 'MX' },
] as const;

// 헬퍼 함수
export function getCountryByCode(code: string) {
	return COUNTRY_CODES.find(c => c.code === code);
}

export function getTimezoneByValue(value: string) {
	return TIMEZONES.find(tz => tz.value === value);
}

export function getCurrencyByCode(code: string) {
	return CURRENCIES.find(c => c.code === code);
}

// 기본값
export const DEFAULT_COUNTRY = 'TH';
export const DEFAULT_TIMEZONE = 'Asia/Bangkok';
export const DEFAULT_CURRENCY = 'THB';