import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeeklyWeightPhrResponse, WeightData } from '@/shared/types/phr';
import { formatDDMM } from '@/shared/utils/commonScripts';
import { WeeklyWeightList } from '@/shared/components/ui/patient/phr/list/week';
import { ChartLegend, WeeklyChartHeader } from '@/shared/components/ui/patient/phr/components';
import { NoDataChart, WeightChart } from '@/shared/components/ui/patient/phr/chart';

const Weight = ({ items, period }: WeeklyWeightPhrResponse) => {
	const { t } = useTranslation();

	const data: WeightData[] = useMemo(() => {
		const result: WeightData[] = [];
		[...items].reverse().forEach(item => {
			const { date, day, weight } = item;
			result.push({
				day: `${formatDDMM(date)}|${t(`calendar.week.${day}`)}`,
				weight
			});
		});

		return result;
	}, [items, t]);

	// day를 제외한 모든 값이 null인지 확인
	const hasNoData = useMemo(() => {
		return data.every(item => item.weight === null);
	}, [data]);

	return (
		<>
			<div className="bg-white border border-stroke-input flex flex-col gap-4 p-5 rounded-[1.25rem]">
				<WeeklyChartHeader endDate={period.endDate} startDate={period.startDate} />
				<p className="text-base text-center text-text-100" style={{ lineHeight: 'normal' }}>
					{t('phr.lbl.aww')} : {period.averageWeight ?? 0}kg, {period.averageBmi ?? 0}BMI
				</p>
				{hasNoData
					? <NoDataChart text={t('phr.nodata.wnbw')} />
					: (
						<>
							<WeightChart data={data} dataKey="day" />
							<ChartLegend stroke="#3076DF" text={t('phr.lbl.we')} />
						</>
					)
				}
			</div>
			<WeeklyWeightList items={[...items]} />
		</>
	);
};

export default Weight;