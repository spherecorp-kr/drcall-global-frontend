// 주소 검색 기능에 필요한 모든 상수와 공통 타입을 중앙집중식으로 관리
// 다른 모듈에서 재사용되어 정책 변경 시 단일 지점에서 조정할 수 있습니다.

export const ADDRESS_SEARCH_MIN_CHARS = 3; // 최소 N자 입력 후 검색 시작 (성능 최적화)
export const ADDRESS_PREFETCH_MAX = 5;     // 선조회 최대 개수
export const ADDRESS_PREFETCH_CONCURRENCY = 2; // 선조회 동시성 - 동시에 몇 개의 주소를 미리 조회할지 (병렬 처리 제어)

// 언어코드 → Google Maps region 매핑 (필요 시 확장)
export function mapLanguageToRegion(language: string | undefined): string | undefined {
  switch ((language || '').toLowerCase()) {
    case 'ko':
      return 'KR';
    case 'th':
      return 'TH';
    case 'en':
      return undefined; // 글로벌 기본값
    default:
      return undefined;
  }
}

export type SelectedAddress = {
  displayAddress: string;
  detail?: string;
  postalCode: string;
  latitude: number | '';
  longitude: number | '';
  placeId?: string; // Google Place ID
};


