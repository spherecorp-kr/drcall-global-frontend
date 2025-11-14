import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MonthlyTempPhrResponse, TemperatureData } from '@/shared/types/phr';
import { NoDataChart, TemperatureChart } from '@/shared/components/ui/patient/phr/chart';
import { ChartLegend, MonthlyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { MonthlyTempList } from '@/shared/components/ui/patient/phr/list/month';

const Temperature = ({ items, period }: MonthlyTempPhrResponse) => {
	const { t } = useTranslation();

	const data: TemperatureData[] = useMemo(() => {
		const result: TemperatureData[] = [];
		[...items].reverse().forEach(item => {
			const { temperature, weekOfMonth } = item;
			result.push({
				week: `${weekOfMonth}W`,
				temperature
			});
		});

		return result;
	}, [items]);

	// week를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.temperature === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<MonthlyChartHeader year={period.year} month={period.month} monthName={period.monthName} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					이번 달 평균 체온 : {period.averageTemperature ?? 0}&deg;C
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.btm')} />
					: (
						<>
							<TemperatureChart data={data} dataKey='week' />
							<ChartLegend stroke='#FF5C00' text={t('phr.lbl.bt')} />
						</>
					)
				}
			</div>
			<MonthlyTempList items={[...items]} />
		</>
	);
};

export default Temperature;