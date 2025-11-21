import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { VisiblePHRDetails, WeeklySugarPhrInfo, WeeklySugarPhrItem } from '@/shared/types/phr';
import { NoPhrData, WeeklyTitle } from '@/shared/components/ui/patient/phr/components';

interface Props {
	items: WeeklySugarPhrItem[];
}

interface DetailProps {
	infos: WeeklySugarPhrInfo[];
	isVisible: boolean;
}

const Detail = ({ infos, isVisible }: DetailProps) => {
	const { t } = useTranslation();

	return (
		<div className={isVisible ? 'bg-bg-gray flex flex-col gap-5 p-5 rounded-[1.25rem]' : 'hidden'}>
			{infos.map(({ glucose = 0, time, typeName }, i) => (
				<div className="flex items-center justify-between" key={`week-sugar-detail-${i}`}>
					<p className='flex gap-1 items-center justify-start text-text-100'>
						<span className='font-semibold'>{t(`phr.bloodSugar.${typeName}`)} {glucose}</span>
						<span>mg/dL</span>
					</p>
					<p className="text-right text-text-60">{time}</p>
				</div>
			))}
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
					.filter(item => new Date() >= new Date(item.date))
					.map((item, i) => (
						<div
							key={`week-sugar-${i}`}
							className={`${i !== 0 ? 'border-t border-stroke-input' : ''} ${visibleDetails[i] ? 'pb-5' : ''} cursor-pointer flex flex-col gap-3 px-5 w-full`}
							onClick={() => toggleVisibility(i)}>
							<WeeklyTitle
								isVisible={visibleDetails[i]}
								itemDate={item.date} />
							{item.infos
								? <Detail
									infos={item.infos}
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