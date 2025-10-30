/**
 * Country Code Utilities
 *
 * 국가 코드 데이터 및 유틸리티 함수
 */

export interface Country {
  code: string;        // ISO 3166-1 alpha-2 코드
  name: string;        // 영어 국가명
  nameLocal: string;   // 현지어 국가명
  dialCode: string;    // 국제 전화 코드
  flag: string;        // 국기 이모지
}

/**
 * 아시아 태평양 지역 주요 국가 목록
 * 태국을 기본으로 하고, 한국 및 주변국 포함
 */
export const COUNTRIES: Country[] = [
  {
    code: 'TH',
    name: 'Thailand',
    nameLocal: 'ไทย',
    dialCode: '+66',
    flag: '🇹🇭',
  },
  {
    code: 'KR',
    name: 'South Korea',
    nameLocal: '대한민국',
    dialCode: '+82',
    flag: '🇰🇷',
  },
  {
    code: 'JP',
    name: 'Japan',
    nameLocal: '日本',
    dialCode: '+81',
    flag: '🇯🇵',
  },
  {
    code: 'CN',
    name: 'China',
    nameLocal: '中国',
    dialCode: '+86',
    flag: '🇨🇳',
  },
  {
    code: 'SG',
    name: 'Singapore',
    nameLocal: 'Singapore',
    dialCode: '+65',
    flag: '🇸🇬',
  },
  {
    code: 'MY',
    name: 'Malaysia',
    nameLocal: 'Malaysia',
    dialCode: '+60',
    flag: '🇲🇾',
  },
  {
    code: 'VN',
    name: 'Vietnam',
    nameLocal: 'Việt Nam',
    dialCode: '+84',
    flag: '🇻🇳',
  },
  {
    code: 'PH',
    name: 'Philippines',
    nameLocal: 'Pilipinas',
    dialCode: '+63',
    flag: '🇵🇭',
  },
  {
    code: 'ID',
    name: 'Indonesia',
    nameLocal: 'Indonesia',
    dialCode: '+62',
    flag: '🇮🇩',
  },
];

/**
 * 국가 코드로 국가 정보 찾기
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code);
}

/**
 * 전화 코드로 국가 정보 찾기
 */
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return COUNTRIES.find((country) => country.dialCode === dialCode);
}

/**
 * 로케일에 따라 기본 국가 가져오기
 *
 * @param locale - i18n 로케일 (예: 'ko', 'th', 'en')
 * @returns 기본 국가 정보 (없으면 태국)
 */
export function getDefaultCountryByLocale(locale: string): Country {
  const localeMap: Record<string, string> = {
    ko: 'KR', // 한국어 -> 한국
    th: 'TH', // 태국어 -> 태국
    ja: 'JP', // 일본어 -> 일본
    zh: 'CN', // 중국어 -> 중국
    vi: 'VN', // 베트남어 -> 베트남
    id: 'ID', // 인도네시아어 -> 인도네시아
  };

  const countryCode = localeMap[locale] || 'TH'; // 기본값: 태국
  return getCountryByCode(countryCode) || COUNTRIES[0];
}

/**
 * 전화번호 포맷팅
 *
 * @param phoneNumber - 전화번호 (숫자만)
 * @param countryCode - 국가 코드 (예: 'KR', 'TH')
 * @returns 포맷팅된 전화번호
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
  // 숫자만 추출
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (countryCode === 'KR') {
    // 한국: 010-1234-5678
    if (digitsOnly.length === 11) {
      return digitsOnly.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  } else if (countryCode === 'TH') {
    // 태국: 081-234-5678
    if (digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (digitsOnly.length === 9) {
      return digitsOnly.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }

  // 기본: 하이픈 없이 반환
  return digitsOnly;
}
