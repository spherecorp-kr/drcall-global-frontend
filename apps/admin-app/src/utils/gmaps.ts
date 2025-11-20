/**
 * Google Maps API 동적 로더 유틸리티
 */

interface LoadOptions {
	apiKey: string;
	language?: string;
	region?: string;
	mapId?: string;
	additionalLibraries?: string[];
}

let isLoaded = false;
let loading = false;
let pendingCallbacks: Array<() => void> = [];

/**
 * Google Maps API 로드
 */
export function loadGoogleMaps(opts: LoadOptions, onLoaded?: () => void) {
	if (isLoaded) {
		onLoaded?.();
		return;
	}

	if (onLoaded) {
		pendingCallbacks.push(onLoaded);
	}

	if (loading) {
		return;
	}

	loading = true;

	// 전역 콜백 함수 설정
	(window as any).__onGmapsReady = () => {
		isLoaded = true;
		loading = false;
		pendingCallbacks.forEach(cb => cb());
		pendingCallbacks = [];
	};

	// 스크립트 생성 및 추가
	const script = document.createElement('script');
	script.async = true;
	script.defer = true;

	const params = new URLSearchParams({
		key: opts.apiKey,
		callback: '__onGmapsReady',
		libraries: ['places', ...(opts.additionalLibraries || [])].join(','),
		...(opts.language && { language: opts.language }),
		...(opts.region && { region: opts.region }),
		...(opts.mapId && { map_ids: opts.mapId }),
	});

	script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
	document.head.appendChild(script);
}

/**
 * Places API 사용 가능 여부 확인
 */
export function ensurePlacesAvailable(): boolean {
	if (!isLoaded) return false;
	return !!(
		window.google &&
		window.google.maps &&
		window.google.maps.places &&
		window.google.maps.places.AutocompleteService
	);
}

/**
 * Autocomplete 세션 토큰 생성
 */
export function createAutocompleteSessionToken() {
	if (!window.google?.maps?.places) {
		return null;
	}
	return new google.maps.places.AutocompleteSessionToken();
}

/**
 * 언어를 지역 코드로 매핑
 */
export function mapLanguageToRegion(language?: string): string | undefined {
	switch (language) {
		case 'ko':
			return 'KR';
		case 'th':
			return 'TH';
		case 'en':
			return undefined;
		default:
			return undefined;
	}
}