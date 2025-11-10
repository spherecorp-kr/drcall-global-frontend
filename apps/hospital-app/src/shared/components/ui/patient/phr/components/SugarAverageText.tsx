import type { SugarTime, SugarTiming } from '@/shared/types/phr';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useLanguage } from '@/shared/hooks/useLanguage.ts';

interface Period {
	morning: SugarTime;
	lunch: SugarTime;
	dinner: SugarTime;
	bedtime: number | null;
}

interface Props {
	dateType: 'week' | 'month';
	period: Period;
	timing: SugarTiming;
}

const SugarAverageText = ({ dateType, period, timing }: Props) => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	const SUGAT_NOTE = useMemo(() => ({
		morning: {
			week: t('phr.bloodSugar.aswb'),
			month: t('phr.bloodSugar.asmb'),
		},
		lunch: {
			week: t('phr.bloodSugar.aswl'),
			month: t('phr.bloodSugar.asml'),
		},
		dinner: {
			week: t('phr.bloodSugar.aswd'),
			month: t('phr.bloodSugar.asmd'),
		},
		bedtime: {
			week: t('phr.bloodSugar.aswbb'),
			month: t('phr.bloodSugar.asmbb'),
		}
	}), [t]);

	// 언어 별로 혈당 문구 및 어순 설정
	const setSugarNoteByLanguage = useCallback((ba: number | null, bmam: string) => {
		let result: string = '';
		if (ba !== null) {
			if (currentLanguage !== 'en') {
				result += `${t(`phr.bloodSugar.${bmam}`)} `;
			}
			result += `${ba}mg/dL`;
			if (currentLanguage === 'en') {
				result += ` ${t(`phr.bloodSugar.${bmam}`)}`;
			}
		}

		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLanguage]);

	const setAverageText = () => {
		if (timing === 'bedtime') {
			const { bedtime } = period;
			if (bedtime === null) {
				return dateType === 'week' ? t('phr.bloodSugar.adw') : t('phr.bloodSugar.adm');
			}
			return <>{SUGAT_NOTE.bedtime[dateType]}<br />{bedtime}mg/dL</>;
		} else {
			const { before, after } = period[timing];
			if (before === null && after === null) {
				return dateType === 'week' ? t('phr.bloodSugar.adw') : t('phr.bloodSugar.adm');
			}

			const note: string = SUGAT_NOTE[timing][dateType];
			return (
				<>
					{note}<br />
					{setSugarNoteByLanguage(before, 'bm')}
					{(!!before && !!after) && ', '}
					{setSugarNoteByLanguage(after, 'am')}
				</>
			);
		}
	}

	return <p className='text-base text-center text-text-100' style={{ lineHeight: 'normal' }}>{setAverageText()}</p>;
};

export default SugarAverageText;