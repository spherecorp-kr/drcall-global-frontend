import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemperatureData, WeeklyTempPhrResponse } from '@/shared/types/phr';
import { formatDDMM } from '@/shared/utils/commonScripts';
import { WeeklyTempList } from '@/shared/components/ui/patient/phr/list/week';
import { ChartLegend, WeeklyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { NoDataChart, TemperatureChart } from '@/shared/components/ui/patient/phr/chart';

const Temperature = ({ items, period }: WeeklyTempPhrResponse) => {
	const { t } = useTranslation();

	const data: TemperatureData[] = useMemo(() => {
		const result: TemperatureData[] = [];
		[...items].reverse().forEach(item => {
			const { date, day, temperature } = item;
			result.push({
				day: `${formatDDMM(date)}|${t(`calendar.week.${day}`)}`,
				temperature
			});
		});

		return result;
	}, [items, t]);

	// day를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.temperature === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<WeeklyChartHeader endDate={period.endDate} startDate={period.startDate} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					이번 주 평균 체온 : {period.averageTemperature ?? 0}&deg;C
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.btw')} />
					: (
						<>
							<TemperatureChart data={data} dataKey='day' />
							<ChartLegend stroke='#FF5C00' text={t('phr.lbl.bt')} />
						</>
					)
				}
			</div>
			<WeeklyTempList items={[...items]} />
		</>
	);
};

export default Temperature;