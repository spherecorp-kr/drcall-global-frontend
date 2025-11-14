import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MonthlyWeightPhrResponse, WeightData } from '@/shared/types/phr';
import { ChartLegend, MonthlyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { NoDataChart, WeightChart } from '@/shared/components/ui/patient/phr/chart';
import { MonthlyWeightList } from '@/shared/components/ui/patient/phr/list/month';

const Weight = ({ items, period }: MonthlyWeightPhrResponse) => {
	const { t } = useTranslation();

	const data: WeightData[] = useMemo(() => {
		const result: WeightData[] = [];
		[...items].reverse().forEach(item => {
			const { weekOfMonth, weight } = item;
			result.push({
				week: `${weekOfMonth}W`,
				weight
			});
		});

		return result;
	}, [items]);

	// week를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.weight === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<MonthlyChartHeader year={period.year} month={period.month} monthName={period.monthName} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					이번 달 평균 체중&BMI : {period.averageWeight ?? 0}kg, {period.averageBmi ?? 0}BMI
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.wnbm')} />
					: (
						<>
							<WeightChart data={data} dataKey='week' />
							<ChartLegend stroke='#3076DF' text={t('phr.lbl.we')} />
						</>
					)
				}
			</div>
			<MonthlyWeightList items={[...items]} />
		</>
	);
};

export default Weight;