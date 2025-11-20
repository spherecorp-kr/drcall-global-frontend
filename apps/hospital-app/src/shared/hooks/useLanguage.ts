import { useTranslation } from 'react-i18next';

export type Language = 'ko' | 'en' | 'th';

export const useLanguage = () => {
	const { i18n } = useTranslation();

	const currentLanguage = i18n.language as Language;

	const changeLanguage = (language: Language) => {
		i18n.changeLanguage(language);
		// localStorage에 저장하여 새로고침 후에도 유지되도록 함
		localStorage.setItem('language', language);
	};

	const availableLanguages: Language[] = ['ko', 'en', 'th'];

	return {
		availableLanguages,
		changeLanguage,
		currentLanguage,
	};
};
