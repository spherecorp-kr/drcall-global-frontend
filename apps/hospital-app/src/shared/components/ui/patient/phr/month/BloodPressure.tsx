import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MonthlyPressurePhrResponse, PressureData } from '@/shared/types/phr';
import { BloodPressureChart, NoDataChart } from '@/shared/components/ui/patient/phr/chart';
import { ChartLegend, MonthlyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { MonthlyPressureList } from '@/shared/components/ui/patient/phr/list/month';

const BloodPressure = ({ items, period }: MonthlyPressurePhrResponse) => {
	const { t } = useTranslation();

	const data: PressureData[] = useMemo(() => {
		const result: PressureData[] = [];
		[...items].reverse().forEach(item => {
			const { diastolic, systolic, weekOfMonth } = item;
			result.push({
				week: `${weekOfMonth}W`,
				diastolic,
				systolic
			});
		});

		return result;
	}, [items]);

	// week를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.diastolic === null && item.systolic === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<MonthlyChartHeader year={period.year} month={period.month} monthName={period.monthName} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					{t('phr.lbl.abm')} : {period.averageSystolic ?? 0}/{period.averageDiastolic ?? 0}mmHg, {period.averagePulse ?? 0}BPM
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.bpm')} />
					: (
						<>
							<BloodPressureChart data={data} dataKey='week' />
							<div className='flex gap-5 items-center justify-center w-full'>
								<ChartLegend isFull={false} stroke='#5CB4FF' text={t('phr.bloodPressure.diastole')} />
								<ChartLegend isFull={false} stroke='#FF2E53' text={t('phr.bloodPressure.systole')} />
							</div>
						</>
					)
				}
			</div>
			<MonthlyPressureList items={[...items]} />
		</>
	);
};

export default BloodPressure;