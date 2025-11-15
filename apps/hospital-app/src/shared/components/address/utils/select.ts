// 선택 처리 유틸리티: Suggestion을 최종 선택 가능한 객체/문자열로 변환
// - placeId가 있고 postalCode/좌표가 비어있다면 상세 조회로 보강합니다.
// - 반환: SelectedAddress(객체)와 레거시 문자열("{postalCode}\n{displayAddress}") 모두 생성

import { ensurePlacesAvailable } from '@/shared/utils/gmaps';
import type { SelectedAddress } from '@/shared/constants/address';
import type { AddressSuggestion } from './address';

// 선택 처리 옵션 타입
export type FinalizeOptions = {
  ensureDetails?: boolean; // true면 부족한 정보가 있을 때 Place.fetchFields로 보강 시도
};

// 선택 처리 결과 타입
export type FinalizeResult = {
  object: SelectedAddress; // 최종 선택 가능한 객체
  legacy: string; // "{postalCode}\n{displayAddress}" 형태(우편번호 없으면 주소만)
};

// 선택한 주소에 부족한 정보가 있으면 Places Details로 보강하고, 최종 값을 { 객체 형태(SelectedAddress), 문자열 형태(“{우편번호}\n{주소}”) }로 반환
export async function finalizePlaceSelection(
  suggestion: AddressSuggestion,
  options: FinalizeOptions = {}
): Promise<FinalizeResult> {
  let s = suggestion;

  if (options.ensureDetails && s.placeId && (!s.postalCode || !s.latitude || !s.longitude) && ensurePlacesAvailable()) { // 부족한 정보가 있을 때 Place.fetchFields로 보강 시도
    const g = window.google; // Google Maps API 인스턴스
    const place = g?.maps?.places?.Place ? new g.maps.places.Place({ id: s.placeId }) : null; // Place 인스턴스
    if (place) {
      await place.fetchFields({ fields: ['addressComponents', 'formattedAddress', 'location'] }); // 주소 상세 조회시 필요한 필드만 조회하여 비용/성능 최적화

      const comps: Record<string, string> = {}; // 주소 컴포넌트 구조(longText/shortText)
      if (Array.isArray(place.addressComponents)) {
        place.addressComponents.forEach((c: google.maps.places.AddressComponent) => {
          if (Array.isArray(c.types)) {
            c.types.forEach((t: string) => {
              comps[t] = (c.longText || c.shortText || ''); // 주소 컴포넌트 구조(longText/shortText)
            });
          }
        });
      }

      s = {
        ...s,
        postalCode: comps['postal_code'] || s.postalCode || '',
        latitude: s.latitude || (place.location?.lat?.() ?? ''),
        longitude: s.longitude || (place.location?.lng?.() ?? ''),
        displayAddress: (place.formattedAddress || s.displayAddress || ''),
      };
    }
  }

  const object: SelectedAddress = {
    displayAddress: s.displayAddress || '',
    detail: s.detail || '',
    postalCode: s.postalCode || '',
    latitude: typeof s.latitude === 'number' ? s.latitude : '',
    longitude: typeof s.longitude === 'number' ? s.longitude : ''
  };

  const legacy = (object.postalCode ? object.postalCode + '\n' : '') + (object.displayAddress || '');

  return { object, legacy };
}


