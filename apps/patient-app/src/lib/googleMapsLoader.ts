import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let optionsConfigured = false;              // setOptions 1회 보장
let loadingPromise: Promise<typeof google> | null = null;  // 동시 호출 단일화

/**
 * Google Maps JavaScript API를 최신 functional API로 로드합니다.
 * - setOptions: API 키/버전 등 전역 옵션 설정 (첫 importLibrary 호출 이전에 반드시 호출)
 * - importLibrary('maps'): core "maps" 라이브러리 로딩 (marker 등 추가 라이브러리는 이후 필요 시 import)
 * - 초기 1회 로드 후에는 전역 window.google을 재사용하여 불필요한 네트워크 요청을 방지합니다.
 *
 * 반환: 전역 google 네임스페이스 (typeof google)
 */
export async function loadGoogle(): Promise<typeof google> {
  // 이미 초기화된 경우 전역 네임스페이스 재사용
  if ((window as any).google) {
    return (window as any).google as typeof google;
  }

  // Vite 환경변수에서 API 키를 읽어옵니다 (노출 금지)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('VITE_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다.');
  }

  // 첫 로드 전에 전역 옵션을 설정해야 합니다
  if (!optionsConfigured) {
    setOptions({ 
      key: apiKey, 
      v: 'weekly', // 최신 안정 주간 채널을 사용
      mapIds: [import.meta.env.VITE_GOOGLE_MAPS_ID || 'DEMO_MAP_ID'],
    });
    optionsConfigured = true;
  }

  // core maps 라이브러리를 로드하여 google 네임스페이스를 준비합니다
  if (!loadingPromise) {
    loadingPromise = importLibrary('maps').then(() => (window as any).google as typeof google);
  }

  return loadingPromise;
}