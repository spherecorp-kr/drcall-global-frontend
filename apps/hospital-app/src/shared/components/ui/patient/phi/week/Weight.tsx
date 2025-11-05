import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl } from '@/shared/components/ui';
import type { WeeklyWeightPhrItem } from '@/shared/types/phr.ts';
import { WeeklyWeightList } from '@/shared/components/ui/patient/phi/list';

interface Props {
	items: WeeklyWeightPhrItem[];
}

const Weight = ({ items }: Props) => {
	const { t } = useTranslation();

	const [viewMode, setViewMode] = useState('weekly');

	const viewOptions = useMemo(() => {
		return [
			{ value: 'weekly', label: t('dashboard.section.chart.viewOption.weekly') },
			{ value: 'monthly', label: t('dashboard.section.chart.viewOption.monthly') },
		];
	}, [t]);

	return (
		<div className='flex flex-col gap-5'>
			<SegmentedControl
				buttonClassName='rounded'
				className='mx-auto my-0 rounded w-40'
				onChange={setViewMode}
				options={viewOptions}
				value={viewMode}
			/>
			<div className='bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]'>
				<p className='text-base text-center text-text-100' style={{ lineHeight: 'normal' }}>이번 주 평균 체중&BMI : 58kg, 10BMI</p>
			</div>
			<WeeklyWeightList items={[...items]} />
		</div>
	);
};

export default Weight;