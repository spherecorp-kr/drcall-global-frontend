import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../lib/i18n';
import { authService } from '../services/authService';
import { patientService } from '../services/patientService';

export type Language = 'ko' | 'en' | 'th';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
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
      setLanguage: async (language: Language) => {
        // 1. Update frontend state first (for immediate UI feedback)
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
        set({ language });

        // 2. Sync with backend (Patient.preferredLanguage)
        try {
          const profile = await authService.getProfile();
          if (profile && profile.id) {
            await patientService.updateLanguage(profile.id, language);
            console.log(`Language updated to ${language} for patient ${profile.id}`);
          } else {
            console.warn('Patient profile not found, language change is local only');
          }
        } catch (error) {
          // Silently fail - language is already updated locally
          // Backend sync is nice-to-have, not critical
          console.warn('Failed to sync language with backend:', error);
        }
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
