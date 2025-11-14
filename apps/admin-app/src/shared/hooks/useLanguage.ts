import { useTranslation } from 'react-i18next';

export type Language = 'ko' | 'en' | 'th';

export const useLanguage = () => {
	const { i18n } = useTranslation();

	const currentLanguage = i18n.language as Language;

	const changeLanguage = (language: Language) => {
		i18n.changeLanguage(language);
	};

	const availableLanguages: Language[] = ['ko', 'en', 'th'];

	return {
		availableLanguages,
		changeLanguage,
		currentLanguage,
	};
};
