import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en/translation.json';
import koTranslation from '../locales/ko/translation.json';
import thTranslation from '../locales/th/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  ko: {
    translation: koTranslation
  },
  th: {
    translation: thTranslation
  }
};

/**
 * 브라우저 언어 감지 및 지원 언어 매칭
 *
 * @returns 지원하는 언어 코드 (en, ko, th)
 */
function detectBrowserLanguage(): string {
  // 1. localStorage에 저장된 언어가 있으면 우선 사용
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['en', 'ko', 'th'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // 2. 브라우저 언어 감지
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.toLowerCase().split('-')[0]; // 'ko-KR' -> 'ko'

  // 3. 지원하는 언어인지 확인
  const supportedLanguages: { [key: string]: string } = {
    ko: 'ko', // 한국어
    th: 'th', // 태국어
    en: 'en', // 영어
  };

  const detectedLang = supportedLanguages[langCode] || 'th'; // 기본값: 태국어

  // 4. localStorage에 저장 (다음 방문 시 사용)
  localStorage.setItem('language', detectedLang);

  return detectedLang;
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectBrowserLanguage(),
    fallbackLng: 'th', // 태국 기반 서비스이므로 태국어로 fallback
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
