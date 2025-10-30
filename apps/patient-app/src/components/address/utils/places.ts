// Google Places 예측 호출 유틸리티 (레거시 AutocompleteSuggestion.fetchAutocompleteSuggestions TS화)
// - 입력한 검색어에 대해 Places Autocomplete 예측 목록을 반환합니다.
// - 주소 문자열/상세/타입/placeId만 매핑하여 반환(우편번호/좌표는 상세 조회 단계에서 보강).

import { ensurePlacesAvailable } from '@/utils/gmaps';
import type { AddressSuggestion } from './address';

/// <reference types="@types/google.maps" />

// Google Places Autocomplete 예측 조회 옵션 타입
export type SearchPlacesOptions = {
  sessionToken?: google.maps.places.AutocompleteSessionToken;
  region?: string;    // e.g. 'KR', 'TH'
};

type AutocompleteSuggestionResult = {
  suggestions?: Array<{
    placePrediction?: {
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
      placeId?: string;
      types?: string[];
    };
  }>;
};

/**
 * Google Places Autocomplete 예측을 조회하여 AddressSuggestion 배열로 반환합니다.
 * - Places 사용 불가 시 빈 배열을 반환합니다.
 * - 입력이 공백/0자이면 빈 배열을 반환합니다.
 * - 최신 API AutocompleteSuggestion.fetchAutocompleteSuggestions 호출
 * - 예측 결과를 AddressSuggestion 배열로 매핑(우편번호/좌표는 공란, 상세 조회 단계에서 보강)
 */
export async function searchPlacesSuggestions(query: string, opts: SearchPlacesOptions = {}): Promise<AddressSuggestion[]> {
  const trimmed = (query || '').trim();
  if (trimmed.length === 0) return []; // 입력이 공백/0자이면 빈 배열을 반환
  if (!ensurePlacesAvailable()) return []; // Places 사용 불가 시 빈 배열을 반환

  const g = window.google;
  if (!g?.maps?.places?.AutocompleteSuggestion) return [];

  const req: {
    input: string;
    sessionToken?: google.maps.places.AutocompleteSessionToken;
    includedRegionCodes?: string[];
  } = { input: trimmed };

  if (opts.sessionToken) req.sessionToken = opts.sessionToken;
  if (opts.region) req.includedRegionCodes = [opts.region];

  const res = await g.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(req) as AutocompleteSuggestionResult;
  const suggestions = Array.isArray(res?.suggestions) ? res.suggestions : [];

  return suggestions.map((s) => {
    const pred = s.placePrediction;
    return {
      displayAddress: pred?.text?.text || pred?.structuredFormat?.mainText?.text || '',
      detail: pred?.structuredFormat?.secondaryText?.text || '',
      postalCode: '',
      latitude: '',
      longitude: '',
      placeId: pred?.placeId || undefined,
      types: Array.isArray(pred?.types) ? pred.types : undefined
    } as AddressSuggestion;
  });
}


