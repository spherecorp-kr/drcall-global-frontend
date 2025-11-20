import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 번역 파일 import
import enTranslation from './locales/en/translation.json';
import koTranslation from './locales/ko/translation.json';
import thTranslation from './locales/th/translation.json';

const resources = {
	en: {
		translation: enTranslation,
	},
	ko: {
		translation: koTranslation,
	},
	th: {
		translation: thTranslation,
	},
};

/**
 * 브라우저 언어 감지 및 지원 언어 매칭
 * localStorage에 저장된 언어가 있으면 우선 사용하고, 없으면 브라우저 언어를 감지
 *
 * @returns 지원하는 언어 코드 (en, ko, th)
 */
function detectInitialLanguage(): string {
	// 1. localStorage에 저장된 언어가 있으면 우선 사용
	const savedLanguage = localStorage.getItem('language');
	if (savedLanguage && ['en', 'ko', 'th'].includes(savedLanguage)) {
		return savedLanguage;
	}

	// 2. 브라우저 언어 감지
	// navigator.userLanguage는 Internet Explorer에서 사용되던 비표준 속성
	const browserLang = navigator.language || ('userLanguage' in navigator ? (navigator as Navigator & { userLanguage: string }).userLanguage : 'en');
	const langCode = browserLang.toLowerCase().split('-')[0]; // 'ko-KR' -> 'ko'

	// 3. 지원하는 언어인지 확인
	const supportedLanguages: { [key: string]: string } = {
		ko: 'ko', // 한국어
		th: 'th', // 태국어
		en: 'en', // 영어
	};

	const detectedLang = supportedLanguages[langCode] || 'en'; // 기본값: 영어

	// 4. localStorage에 저장 (다음 방문 시 사용)
	localStorage.setItem('language', detectedLang);

	return detectedLang;
}

i18n.use(initReactI18next) // react-i18next 연결
	.init({
		resources,
		lng: detectInitialLanguage(), // localStorage 또는 브라우저 언어로 초기화
		fallbackLng: 'en', // 번역이 없을 때 대체 언어

		interpolation: {
			escapeValue: false, // React는 기본적으로 XSS 보호를 제공
		},
	});

export default i18n;
