import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MonthlySugarPhrItem, SugarMeal, VisiblePHRDetails } from '@/shared/types/phr';
import { MonthlyTitle, NoPhrData } from '@/shared/components/ui/patient/phr/components';


interface Props {
	items: MonthlySugarPhrItem[];
}

interface DetailProps {
	labelKey: string;
	meals: SugarMeal;
}

interface DetailsProps {
	afterMeals: SugarMeal;
	bedtime: number | null;
	beforeMeals: SugarMeal;
	isVisible: boolean;
}

const Detail = ({ labelKey, meals }: DetailProps) => {
	const { morning, lunch, dinner } = meals;

	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-5">
			{/* morning 값이 있을 땐 morning 값 중 첫 번째에 텍스트 */}
			{morning !== null && (
				<div className="flex items-start justify-between">
					<p className="flex gap-1 items-center justify-start text-text-100">
						<span className="font-semibold">{t('phr.bloodSugar.mn')}</span>
						<span className="font-semibold">{morning}</span>
						<span>mg/dL</span>
					</p>
					<p className="text-right text-text-60">{t(`phr.bloodSugar.${labelKey}`)}</p>
				</div>
			)}

			{lunch !== null && (
				<div className="flex items-start justify-between">
					<p className="flex gap-1 items-center justify-start text-text-100">
						<span className="font-semibold">{t('phr.bloodSugar.lnc')}</span>
						<span className="font-semibold">{lunch}</span>
						<span>mg/dL</span>
					</p>
					{/* lunch 값이 있으면서 morning 값은 없으면 lunch 값 중 첫 번째에 텍스트 */}
					{morning === null && (
						<p className="text-right text-text-60">{t(`phr.bloodSugar.${labelKey}`)}</p>
					)}
				</div>
			)}

			{dinner !== null && (
				<div className="flex items-start justify-between">
					<p className="flex gap-1 items-center justify-start text-text-100">
						<span className="font-semibold">{t('phr.bloodSugar.din')}</span>
						<span className="font-semibold">{dinner}</span>
						<span>mg/dL</span>
					</p>
					{/* dinner 값이 있으면서 morning과 lunch 값이 둘 다 없으면 dinner 값 중 첫 번째에 텍스트 */}
					{(morning === null && lunch === null) && (
						<p className="text-right text-text-60">{t(`phr.bloodSugar.${labelKey}`)}</p>
					)}
				</div>
			)}
		</div>
	);
}

const VISIBLE_DETAILS_CLASS: string = 'bg-bg-gray flex flex-col gap-5 p-5 rounded-[1.25rem] self-stretch [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-stroke-input [&>div:not(:last-child)]:pb-5';
const Details = ({ afterMeals, bedtime, beforeMeals, isVisible }: DetailsProps) => {
	const { t } = useTranslation();

	// 식전 식사 데이터 존재 여부
	const hasBefore: boolean = Object.values(beforeMeals).some(value => value !== null);

	// 식후 식사 데이터 존재 여부
	const hasAfter: boolean = Object.values(afterMeals).some(value => value !== null);

	return (
		<div className={isVisible ? VISIBLE_DETAILS_CLASS : 'hidden'}>
			{hasBefore && <Detail labelKey='premav' meals={beforeMeals} />}
			{hasAfter && <Detail labelKey='postav' meals={afterMeals} />}
			{bedtime !== null && (
				<div className='flex items-center justify-between'>
					<p className='flex gap-1 items-center justify-start text-text-100'>
						<span className='font-semibold'>{bedtime}</span>
						<span>mg/dL</span>
					</p>
					<p className="text-right text-text-60">{t('phr.bloodSugar.avbb')}</p>
				</div>
			)}
		</div>
	);
}

const BloodSugar = ({ items }: Props) => {
	const { t } = useTranslation();

	const [visibleDetails, setVisibleDetails] = useState<VisiblePHRDetails>({});

	// 초기 상태 설정
	useEffect(() => {
		const initialState = items.reduce((acc, _, index) => {
			acc[index] = index === 0; // isFirst가 true인 경우만 true로 설정
			return acc;
		}, {} as VisiblePHRDetails);
		setVisibleDetails(initialState);
	}, [items]);

	const toggleVisibility = useCallback((index: number) => {
		setVisibleDetails(prev => ({
			...prev,
			[index]: !prev[index]
		}));
	}, []);

	return (
		<div className='border border-stroke-input rounded-[1.25rem]'>
			{Array.isArray(items) &&
				items
					.filter(item => new Date() >= new Date(item.startDate))
					.map(({ afterMeals, bedtime, beforeMeals, endDate, startDate, weekOfMonth }, i) => (
						<div
							key={`month-sugar-${i}`}
							className={`${i !== 0 ? 'border-t border-stroke-input' : ''} ${visibleDetails[i] ? 'pb-5' : ''} cursor-pointer flex flex-col gap-3 px-5 w-full`}
							onClick={() => toggleVisibility(i)}>
							<MonthlyTitle
								endDate={endDate}
								isVisible={visibleDetails[i]}
								startDate={startDate}
								weekOfMonth={weekOfMonth}
							/>
							{(
								afterMeals.dinner !== null ||
								afterMeals.lunch !== null ||
								afterMeals.morning !== null ||
								bedtime !== null ||
								beforeMeals.dinner !== null ||
								beforeMeals.lunch !== null ||
								beforeMeals.morning !== null
							)
								? <Details
									afterMeals={afterMeals}
									bedtime={bedtime}
									beforeMeals={beforeMeals}
									isVisible={visibleDetails[i]} />
								: <NoPhrData
									isVisible={visibleDetails[i]}
									text={t('phr.nodata.bs')} />
							}
						</div>
					))
			}
		</div>
	);
};

export default BloodSugar;