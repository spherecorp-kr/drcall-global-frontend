import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PressureData, WeeklyPressurePhrResponse } from '@/shared/types/phr';
import { formatDDMM } from '@/shared/utils/commonScripts';
import { WeeklyPressureList } from '@/shared/components/ui/patient/phr/list/week';
import { ChartLegend, WeeklyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { BloodPressureChart, NoDataChart } from '@/shared/components/ui/patient/phr/chart';

const BloodPressure = ({ items, period }: WeeklyPressurePhrResponse) => {
	const { t } = useTranslation();

	const data: PressureData[] = useMemo(() => {
		const result: PressureData[] = [];
		[...items].reverse().forEach(item => {
			const { date, day, diastolic, systolic } = item;
			result.push({
				day: `${formatDDMM(date)}|${t(`calendar.week.${day}`)}`,
				diastolic,
				systolic
			});
		});

		return result;
	}, [items, t]);

	// day를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.diastolic === null && item.systolic === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<WeeklyChartHeader endDate={period.endDate} startDate={period.startDate} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					이번 주 평균 혈압&맥박 : {period.averageSystolic ?? 0}/{period.averageDiastolic ?? 0}mmHg, {period.averagePulse ?? 0}BPM
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.bpw')} />
					: (
						<>
							<BloodPressureChart data={data} dataKey='day' />
							<div className='flex gap-5 items-center justify-center w-full'>
								<ChartLegend isFull={false} stroke='#5CB4FF' text={t('phr.bloodPressure.diastole')} />
								<ChartLegend isFull={false} stroke='#FF2E53' text={t('phr.bloodPressure.systole')} />
							</div>
						</>
					)
				}
			</div>
			<WeeklyPressureList items={[...items]} />
		</>
	);
};

export default BloodPressure;