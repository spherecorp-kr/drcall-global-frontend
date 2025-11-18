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

i18n.use(initReactI18next) // react-i18next 연결
	.init({
		resources,
		lng: 'en', // 기본 언어 설정
		fallbackLng: 'en', // 번역이 없을 때 대체 언어

		interpolation: {
			escapeValue: false, // React는 기본적으로 XSS 보호를 제공
		},
	});

export default i18n;
