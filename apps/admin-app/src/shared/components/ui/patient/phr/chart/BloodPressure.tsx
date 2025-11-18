import type { ChartLabelProps, PressureData, XAxisTickProps } from '@/shared/types/phr';
import { useMemo } from 'react';
import { LINE_CHART_CURVE, LINE_CHART_MARGIN } from '@/shared/utils/constants.ts';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartLabel, XAxisTick, YAxisTick } from '@/shared/components/ui/patient/phr/components';

interface Props {
	data: PressureData[];
	dataKey: 'day' | 'week';
}

const BloodPressure = ({ data, dataKey }: Props) => {
	// y축의 최소값 계산(10 단위로)
	const minValue: number = useMemo(() => {
		// diastolic과 systolic 중 가장 작은 값 찾기
		const min = Math.min(
			...data.map(item => Math.min(
				item.diastolic || Infinity,
				item.systolic || Infinity
			))
		);

		const result = Math.floor(min / 10) * 10;
		return min === result ? result - 10 : result;
	}, [data]);

	// y축의 최대값 계산(10 단위로)
	const maxValue: number | string = useMemo(() => {
		// diastolic과 systolic 중 가장 큰 값 찾기
		const max = Math.max(
			...data.map(item => Math.max(
				item.diastolic || 0,
				item.systolic || 0
			))
		);

		if (max === 0) {
			return 'auto';
		} else {
			const result = Math.ceil(max / 10) * 10 + 10;
			return max === result ? result + 10 : result;
		}
	}, [data]);

	const ticks = useMemo(() => {
		if (maxValue === 'auto') {
			return undefined;
		}

		const interval = (maxValue as number - minValue) / 5;
		return Array.from({ length: 6 }, (_, i) => minValue + i * interval);
	}, [maxValue, minValue]);

	return (
		<ResponsiveContainer width="100%" height={288}>
			<LineChart data={data} margin={LINE_CHART_MARGIN}>
				{/* 가로 그리드 라인만 표시 */}
				<CartesianGrid horizontal stroke="#e0e0e0" vertical={false} />

				{/* X축 설정 */}
				<XAxis
					axisLine={false}
					dataKey={dataKey}
					height={14} // x축 영역 높이
					interval={0}
					tick={(props: XAxisTickProps) => <XAxisTick {...props} />}
					tickLine={false}
					tickMargin={10}
				/>

				{/* Y축 설정 */}
				<YAxis
					allowDecimals={false}
					axisLine={false}
					domain={[minValue, maxValue]} // 최대, 최소값 설정
					padding={{ bottom: 10 }}
					tick={(props) => <YAxisTick {...props} />}
					ticks={ticks}
					tickCount={6}
					tickLine={false}
					tickMargin={10}
					width={45} // y축 너비
				/>

				{/* 이완기 라인 그래프 */}
				<Line
					connectNulls // null 값을 건너뛰고 연결
					dataKey="diastolic"
					dot={{ fill: '#5cb4ff', r: 4 }}
					label={({ value, x, y }) => {
						// recharts 3.3.0에서 x, y가 string | number | undefined일 수 있으므로 타입 가드 추가
						if (
							typeof x === 'number' &&
							typeof y === 'number' &&
							typeof value === 'number'
						) {
							const labelProps: ChartLabelProps = { x, y, value: String(value) };
							return <ChartLabel fill="#5cb4ff" {...labelProps} />;
						}
						return null;
					}}
					stroke="#5cb4ff"
					strokeWidth={4}
					type={LINE_CHART_CURVE}
				/>

				{/* 수축기 라인 그래프 */}
				<Line
					connectNulls // null 값을 건너뛰고 연결
					dataKey="systolic"
					dot={{ fill: '#ff2e53', r: 4 }}
					label={({ value, x, y }) => {
						// recharts 3.3.0에서 x, y가 string | number | undefined일 수 있으므로 타입 가드 추가
						if (
							typeof x === 'number' &&
							typeof y === 'number' &&
							typeof value === 'number'
						) {
							const labelProps: ChartLabelProps = { x, y, value: String(value) };
							return <ChartLabel fill="#ff2e53" {...labelProps} />;
						}
						return null;
					}}
					stroke="#ff2e53"
					strokeWidth={4}
					type={LINE_CHART_CURVE}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default BloodPressure;