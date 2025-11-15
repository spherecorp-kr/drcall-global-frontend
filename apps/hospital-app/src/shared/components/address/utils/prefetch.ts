// Google Places Details 선조회 유틸리티
// - 주소 제안 목록 중 우편번호/좌표가 비어있는 항목을 우선순위에 따라 상세 조회하여 보강합니다.
// - UI/DOM과 무관한 순수 함수로, 호출자는 결과 배열을 그대로 상태에 반영하면 됩니다.

import { ensurePlacesAvailable } from '@/utils/gmaps';
import type { AddressSuggestion } from './address';

export type PrefetchOptions = {
  maxCount?: number;     // 선조회 최대 개수
  concurrency?: number;  // 동시 처리 개수
};

/**
 * AddressSuggestion 배열에 대해 Google Places Details를 선조회하여
 * postalCode/latitude/longitude를 보강합니다.
 * - Places 미가용 시 원본을 그대로 반환합니다.
 * - placeId가 없거나 이미 모든 정보가 있는 항목은 건너뜁니다.
 * - 정밀 타입(street_address/premise/subpremise/establishment/point_of_interest) 우선 처리.
 * - 최신 API Places.Place.fetchFields 호출
 */
export async function prefetchPlaceDetails(
  suggestions: AddressSuggestion[],
  options: PrefetchOptions = {}
): Promise<AddressSuggestion[]> {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return suggestions; // 검색 결과가 없거나 비어있으면 원본을 그대로 반환
  if (!ensurePlacesAvailable()) return suggestions; // Places 사용 불가 시 원본을 그대로 반환

  const maxCount = Math.max(0, options.maxCount ?? 5);
  const concurrency = Math.max(1, options.concurrency ?? 2);

  /**
   * 정밀 타입 우선순위(우편번호 보유 가능성이 높음)
   * - 'street_address',    // 정확한 도로명 주소
   * - 'premise',           // 건물/부지
   * - 'subpremise',        // 건물 내 세부 위치 (예: 호수)
   * - 'establishment',     // 사업장/업소
   * - 'point_of_interest'  // 관심 지점
   */
  const precise = new Set(['street_address', 'premise', 'subpremise', 'establishment', 'point_of_interest']); // 정밀 타입 세트
  const g = window.google;

  // 선조회 대상 인덱스 필터링
  const needing = suggestions
    .map((r, i) => ({ i, r }))
    .filter(x => !!x.r.placeId && (!x.r.postalCode || !x.r.latitude || !x.r.longitude)); // placeId가 있고, 우편번호/좌표가 없는 항목만 필터링

  if (needing.length === 0) return suggestions; // 필요한 항목이 없으면 원본을 그대로 반환

  // 정밀 타입 우선, 그 다음 원래 순서 유지
  needing.sort((a, b) => {
    const ap = Array.isArray(a.r.types) && a.r.types.some(t => precise.has(t)) ? 1 : 0;
    const bp = Array.isArray(b.r.types) && b.r.types.some(t => precise.has(t)) ? 1 : 0;
    if (bp !== ap) return bp - ap;
    return a.i - b.i;
  });

  const targets = needing.slice(0, Math.min(maxCount, needing.length)); // 최대 개수만큼 자르기

  // 결과는 불변 업데이트로 생성
  const result = suggestions.slice();
  // 주소 상세 요청시 너무 많은 요청을 한 번에 보내지 않게 제어 & 모든 항목 처리를 위한 pointer 역할
  let cursor = 0;
  // 개별 항목 처리
  async function worker() {
    while (cursor < targets.length) {
      const { i, r } = targets[cursor++];
      try {
        // placePrediction이 없을 수 있으므로 placeID 기반 생성으로 안전하게 처리
        const place = g?.maps?.places?.Place ? new g.maps.places.Place({ id: r.placeId }) : null;
        if (!place) continue;

        await place.fetchFields({ fields: ['addressComponents', 'location'] });

        const comps: Record<string, string> = {};
        if (Array.isArray(place.addressComponents)) {
          place.addressComponents.forEach((c: google.maps.places.AddressComponent) => {
            if (Array.isArray(c.types)) {
              c.types.forEach((t: string) => {
                comps[t] = (c.longText || c.shortText);
              });
            }
          });
        }

        const updated: AddressSuggestion = {
          ...r,
          postalCode: comps['postal_code'] || r.postalCode || '',
          latitude: r.latitude || (place.location?.lat?.() ?? ''),
          longitude: r.longitude || (place.location?.lng?.() ?? ''),
        };

        result[i] = updated;
      } catch {
        // 개별 항목 실패는 무시하고 다음으로 진행
        console.error('[prefetchPlaceDetails:worker:failed]');
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, () => worker()));

  console.log('AddressSuggestions: ', result);
  return result;
}


