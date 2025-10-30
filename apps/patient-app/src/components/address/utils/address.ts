// 주소 검색 서버 폴백 유틸리티 (레거시 fetchAddressResults 함수 TS화)
// - Google Places 사용이 불가한 환경에서 백엔드 API(/api/addresses/search)를 호출해 제안 목록을 반환합니다.
// - 컴포넌트 외부에서 재사용할 수 있도록 순수 함수 형태로 제공합니다.

// 주소 검색 결과 response 타입
export type AddressSuggestion = {
  displayAddress: string;
  detail: string;
  postalCode: string;
  latitude: number | '';
  longitude: number | '';
  placeId?: string;
  types?: string[];
};

/**
 * 서버 주소 검색 API를 호출하여 주소 제안 목록을 반환합니다.
 * - 입력이 비어있거나 0자일 때는 즉시 빈 배열을 반환합니다.
 * - 응답이 비정상(HTTP !ok)인 경우에도 빈 배열을 반환합니다.
 * - 실패 원인은 상위에서 콘솔/로깅 정책에 따라 처리하세요.
 */
export async function fetchAddressResults(query: string): Promise<AddressSuggestion[]> {
  const trimmedQuery = (query || '').trim();
  if (trimmedQuery.length === 0) {
    return []; // 입력이 비어있거나 0자일 때는 즉시 빈 배열을 반환
  }

  const response = await fetch(`/api/addresses/search?query=${encodeURIComponent(trimmedQuery)}`);
  if (!response.ok) {
    return []; // 응답이 비정상(HTTP !ok)인 경우에도 빈 배열을 반환
  }

  const payload: any = await response.json(); // 응답 파싱
  const arr: any[] = Array.isArray(payload?.data) ? payload.data : []; // 응답 데이터가 배열이 아니면 빈 배열로 변환

  return arr.map((r: any) => ({
    displayAddress: r.displayAddress || r.address || '',
    detail: r.detail || '',
    postalCode: r.postalCode || '',
    latitude: typeof r.latitude === 'number' ? r.latitude : (r.latitude ?? ''),
    longitude: typeof r.longitude === 'number' ? r.longitude : (r.longitude ?? ''),
    placeId: r.placeId || undefined,
    types: Array.isArray(r.types) ? r.types : undefined
  })); // 응답 데이터를 주소 제안 목록으로 변환
}



