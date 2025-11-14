import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | null = null;
let cachedGoogle: typeof google | null = null;

/**
 * Google Maps JS API를 로드하고 전역 google 객체를 반환합니다.
 * - 캐시를 사용하여 중복 로딩을 방지합니다.
 * - API 키는 Vite 환경변수 VITE_GOOGLE_MAPS_API_KEY를 사용합니다.
 */
export async function loadGoogle(): Promise<typeof google> {
  if (cachedGoogle) return cachedGoogle;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('VITE_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다.');
  }

  if (!loader) {
    loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['marker'],
    });
  }

  cachedGoogle = await loader.load();
  return cachedGoogle!;
}