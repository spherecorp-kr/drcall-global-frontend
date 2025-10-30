import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../lib/i18n';

export type Language = 'ko' | 'en' | 'th';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

/**
 * 브라우저 언어 감지
 * i18n.ts와 동일한 로직
 */
function detectInitialLanguage(): Language {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['en', 'ko', 'th'].includes(savedLanguage)) {
    return savedLanguage as Language;
  }

  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.toLowerCase().split('-')[0];

  const supportedLanguages: { [key: string]: Language } = {
    ko: 'ko',
    th: 'th',
    en: 'en',
  };

  return supportedLanguages[langCode] || 'th';
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: detectInitialLanguage(),
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
        set({ language });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
