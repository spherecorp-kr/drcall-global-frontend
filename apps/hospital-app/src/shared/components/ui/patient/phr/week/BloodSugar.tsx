import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SugarData, SugarTiming, WeeklySugarPhrResponse } from '@/shared/types/phr';
import { formatDDMM } from '@/shared/utils/commonScripts';
import { SegmentedControl } from '@/shared/components/ui';
import { WeeklySugarList } from '@/shared/components/ui/patient/phr/list/week';
import {
	ChartLegend,
	SugarAverageText,
	WeeklyChartHeader,
} from '@/shared/components/ui/patient/phr/components';
import { BedtimeChart, MealTimeChart } from '@/shared/components/ui/patient/phr/chart/sugar';
import { NoDataChart } from '@/shared/components/ui/patient/phr/chart';

const BloodSugar = ({ items, period }: WeeklySugarPhrResponse) => {
	const { t } = useTranslation();

	const [timing, setTiming] = useState<SugarTiming>('morning');

	const data: SugarData[] = useMemo(() => {
		const result: SugarData[] = [];
		[...items].reverse().forEach(item => {
			const { bedtime, date, day, dinner, lunch, morning } = item;
			result.push({
				bedtime,
				day: `${formatDDMM(date)}|${t(`calendar.week.${day}`)}`,
				dinner,
				lunch,
				morning
			});
		});

		return result;
	}, [items, t]);

	// day를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(({ bedtime, dinner, lunch, morning }) => (
			bedtime === null &&
			dinner.after === null &&
			dinner.before === null &&
			lunch.after === null &&
			lunch.before === null &&
			morning.after === null &&
			morning.before === null
		));
	}, [data]);

	const timingOptions = useMemo(() => [
		{ value: 'morning', label: t('phr.bloodSugar.mn') },
		{ value: 'lunch', label: t('phr.bloodSugar.lnc') },
		{ value: 'dinner', label: t('phr.bloodSugar.din') },
		{ value: 'bedtime', label: t('phr.bloodSugar.bb') },
	], [t]);

	const handleTimingChange = useCallback((t: string) => setTiming(t as SugarTiming), []);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<WeeklyChartHeader endDate={period.endDate} startDate={period.startDate} />
				<SegmentedControl
					buttonClassName="h-7 rounded"
					className='h-8 mx-auto my-0 p-px rounded w-full'
					onChange={handleTimingChange}
					options={timingOptions}
					value={timing}
					variant='primary'
				/>
				<SugarAverageText dateType='week' period={period} timing={timing} />
				{hasNoData
					? <NoDataChart text={t('phr.nodata.bsw')} />
					: timing === 'bedtime'
						? (
							<>
								<BedtimeChart data={data} dataKey='day' />
								<ChartLegend stroke='#8774F5' text={t('phr.bloodSugar.bb')} />
							</>
						) : (
							<>
								<MealTimeChart data={data} dataKey='day' timing={timing} />
								<div className='flex gap-5 items-center justify-center w-full'>
									<ChartLegend isFull={false} stroke='#FFB054' text={t('phr.bloodSugar.am')} />
									<ChartLegend isFull={false} stroke='#FF518F' text={t('phr.bloodSugar.bm')} />
								</div>
							</>
						)
				}
			</div>
			<WeeklySugarList items={[...items]} />
		</>
	);
};

export default BloodSugar;