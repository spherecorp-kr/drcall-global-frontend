// Google Maps Places 동적 로더 및 유틸리티.
// 최신 모듈러 API(importLibrary, AutocompleteSuggestion, Place.fetchFields)를 지원합니다.

/// <reference types="@types/google.maps" />

type LoadOptions = {
  apiKey?: string;
  language?: string;
  region?: string;
};

declare global {
  interface Window {
    google?: typeof google;
    __onGmapsReady?: () => Promise<void>;
  }
}

let loading = false;
let loaded = false;
let pendingCallbacks: Array<() => void> = [];

// Google Maps API 준비
function onReady() {
  loaded = true;
  loading = false;
  const callbacks = pendingCallbacks.slice();
  pendingCallbacks = [];
  callbacks.forEach(cb => {
    try { cb(); } catch {
      // Ignore callback errors
    }
  });
}

// Google Maps API 로드
export function loadGoogleMaps(opts: LoadOptions = {}, onLoaded?: () => void) {
  if (window.google?.maps?.places) {
    onLoaded && onLoaded();
    return;
  }

  // 이미 로드되어 있는지 확인
  if (loaded) {
    onLoaded && onLoaded();
    return;
  }

  // 현재 로딩 중인지 확인
  if (loading) {
    if (onLoaded) pendingCallbacks.push(onLoaded);
    return;
  }

  loading = true;
  if (onLoaded) pendingCallbacks.push(onLoaded);

  const params = new URLSearchParams();
  // API 키 설정
  if (opts.apiKey) params.set('key', opts.apiKey);
  params.set('v', 'weekly');
  params.set('loading', 'async');
  params.set('callback', '__onGmapsReady');
  if (opts.language) params.set('language', opts.language);
  if (opts.region) params.set('region', opts.region);

  // 스크립트 태그 동적 생성
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?' + params.toString();
  script.async = true;
  window.__onGmapsReady = async function () {
    try {
      if (window.google?.maps && 'importLibrary' in window.google.maps) {
        await window.google.maps.importLibrary('places');
      }
    } catch (e) {
      // noop: importLibrary 실패 시에도 onReady 호출로 후속 로직 진행
      console.error('[gmaps:onReady:importLibrary:failed]', e);
    } finally {
      onReady();
    }
  };
  document.head.appendChild(script);
}

export function ensurePlacesAvailable(): boolean {
  return !!(window.google?.maps?.places);
}

// Places 서비스/토큰 보장 유틸
// - 세션 토큰은 같은 사용자 입력 세션에서 예측/상세 호출을 묶어 비용/정확도 최적화
// - 상세 선택 완료 시 토큰을 리셋하여 다음 세션으로 전환
export function createAutocompleteSessionToken(): google.maps.places.AutocompleteSessionToken | null {
  try {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      return new window.google.maps.places.AutocompleteSessionToken();
    }
    return null;
  } catch {
    return null;
  }
}


