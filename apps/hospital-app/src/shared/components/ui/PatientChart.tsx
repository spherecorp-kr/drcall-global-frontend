import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import { Section } from './Section';
import { SegmentedControl } from './SegmentedControl';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { useTranslation } from 'react-i18next';

interface PatientChartProps {
	className?: string;
	onExpand?: () => void;
	isExpanded?: boolean;
}

// 주간 데이터 (7일) - 이미지 기준 데이터
const weeklyData = [
	{ date: '18/08/25', 신규: 8, 재진: 5 },
	{ date: '19/08/25', 신규: 10, 재진: 7 },
	{ date: '20/08/25', 신규: 14, 재진: 16 },
	{ date: '21/08/25', 신규: 9, 재진: 12 },
	{ date: '22/08/25', 신규: 10, 재진: 17 },
	{ date: '23/08/25', 신규: 20, 재진: 22 },
	{ date: '24/08/25', 신규: 18, 재진: 14 },
];

// 월간 데이터 (7주) - 이미지 기준 데이터
const monthlyData = [
	{ date: '02/25', 신규: 8, 재진: 5 },
	{ date: '03/25', 신규: 10, 재진: 7 },
	{ date: '04/25', 신규: 14, 재진: 16 },
	{ date: '05/25', 신규: 9, 재진: 12 },
	{ date: '06/25', 신규: 10, 재진: 22 },
	{ date: '07/25', 신규: 14, 재진: 12 },
	{ date: '08/25', 신규: 10, 재진: 8 },
];

export function PatientChart({ className, onExpand, isExpanded }: PatientChartProps) {
	const { t } = useTranslation();
	const viewMode = useLayoutStore((state) => state.patientChartViewMode);
	const setViewMode = useLayoutStore((state) => state.setPatientChartViewMode);
	const [chartHeight, setChartHeight] = useState(200);
	const containerRef = useRef<HTMLDivElement>(null);

	const viewOptions = useMemo(() => {
		return [
			{ value: 'weekly', label: t('dashboard.section.chart.viewOption.weekly') },
			{ value: 'monthly', label: t('dashboard.section.chart.viewOption.monthly') },
		];
	}, [t]);

	const chartData = useMemo(() => {
		return viewMode === 'weekly' ? weeklyData : monthlyData;
	}, [viewMode]);

	// Y축 최대값 동적 계산
	const maxValue = useMemo(() => {
		const allValues = chartData.flatMap((d) => [d.신규, d.재진]);
		const max = Math.max(...allValues);
		// 10 단위로 올림 + 여유값 추가
		const rounded = Math.ceil(max / 10) * 10;
		return rounded + 10;
	}, [chartData]);

	// Y축 레이블 생성 - 높이에 따라 동적으로 구간 수 결정
	const yAxisTicks = useMemo(() => {
		// 높이가 400px 이상이면 더 많은 구간 표시
		const segments = chartHeight >= 400 ? 6 : 3;
		const step = maxValue / segments;
		const ticks: number[] = [];

		for (let i = segments; i >= 0; i--) {
			ticks.push(Math.round(step * i));
		}

		console.log('chartHeight:', chartHeight, 'segments:', segments, 'ticks:', ticks);
		return ticks;
	}, [maxValue, chartHeight]);

	const handleViewModeChange = useCallback(
		(value: string) => {
			if (value === 'weekly' || value === 'monthly') {
				setViewMode(value);
			}
		},
		[setViewMode],
	);

	useEffect(() => {
		if (containerRef.current) {
			const height: number = containerRef.current.clientHeight;
			setChartHeight(height);
		}
	}, [isExpanded]);

	return (
		<Section
			className={className}
			contentClassName="p-0"
			onExpand={onExpand}
			isExpanded={isExpanded}
			title={t('dashboard.section.chart.title')}
		>
			<div className="flex h-full flex-col gap-3 pt-4 px-5 pb-5">
				{/* Legend and Toggle */}
				<div className="flex items-center justify-between flex-shrink-0">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 py-1">
							<div className="h-2 w-2 rounded-full bg-primary-70" />
							<span className="text-14 font-normal text-primary-70">
								{t('dashboard.section.chart.legend.new')}
							</span>
						</div>
						<div className="flex items-center gap-2 py-1">
							<div className="h-2 w-2 rounded-full bg-system-caution" />
							<span className="text-14 font-normal text-system-caution">
								{t('dashboard.section.chart.legend.fu')}
							</span>
						</div>
					</div>
					<SegmentedControl
						options={viewOptions}
						value={viewMode}
						onChange={handleViewModeChange}
						className="w-40"
					/>
				</div>

				{/* Chart */}
				<div ref={containerRef} className="flex-1 min-h-[200px] w-full">
					<ResponsiveContainer width="100%" height="100%" minHeight={200}>
						<LineChart
							data={chartData}
							margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="0" stroke="#E0E0E0" vertical={false} />
							<XAxis
								dataKey="date"
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#1F1F1F', fontSize: 16, fontFamily: 'Pretendard' }}
								dy={10}
								padding={{ left: 50, right: 50 }}
							/>
							<YAxis
								ticks={yAxisTicks}
								domain={[0, maxValue]}
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#1F1F1F', fontSize: 16, fontFamily: 'Pretendard' }}
								width={30}
								interval={0}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: 'white',
									border: '1px solid #E0E0E0',
									borderRadius: '8px',
									padding: '8px 12px',
									fontFamily: 'Pretendard',
								}}
								labelStyle={{
									color: '#1F1F1F',
									fontSize: '14px',
									fontWeight: 600,
									marginBottom: '4px',
								}}
								itemStyle={{
									color: '#1F1F1F',
									fontSize: '14px',
									padding: '2px 0',
								}}
								formatter={(value: number, name: string) => [`${value}명`, name]}
							/>
							<Line
								type="linear"
								dataKey="신규"
								stroke="#00A0D2"
								strokeWidth={2}
								dot={{ fill: '#00A0D2', stroke: '#00A0D2', strokeWidth: 1, r: 4 }}
								activeDot={{ r: 6, strokeWidth: 2 }}
							/>
							<Line
								type="linear"
								dataKey="재진"
								stroke="#F65F06"
								strokeWidth={2}
								dot={{ fill: '#F65F06', stroke: '#F65F06', strokeWidth: 1, r: 4 }}
								activeDot={{ r: 6, strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Section>
	);
}
