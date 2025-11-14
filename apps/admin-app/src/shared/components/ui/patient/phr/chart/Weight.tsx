import type { ChartLabelProps, WeightData, XAxisTickProps } from '@/shared/types/phr';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { LINE_CHART_CURVE, LINE_CHART_MARGIN } from '@/shared/utils/constants';
import { ChartLabel, XAxisTick, YAxisTick } from '@/shared/components/ui/patient/phr/components';

interface Props {
	data: WeightData[];
	dataKey: 'day' | 'week';
}

const Weight = ({ data, dataKey }: Props) => {
	// y축의 최소값 계산(10 단위로)
	const minValue: number = useMemo(() => {
		const min = Math.min(...data.map(item => item.weight || Infinity));
		const result = Math.floor(min / 10) * 10;
		return min === result ? result - 10 : result;
	}, [data]);

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
					domain={[minValue, 'auto']} // 최소값 설정
					padding={{ bottom: 10 }}
					tick={(props) => <YAxisTick {...props} />}
					tickCount={6}
					tickLine={false}
					tickMargin={10}
					width={45} // y축 너비
				/>

				{/* 라인 그래프 */}
				<Line
					connectNulls // null 값을 건너뛰고 연결
					dataKey="weight"
					dot={{ fill: '#3076df', r: 4 }}
					label={({ value, x, y }) => {
						// recharts 3.3.0에서 x, y가 string | number | undefined일 수 있으므로 타입 가드 추가
						if (
							typeof x === 'number' &&
							typeof y === 'number' &&
							typeof value === 'number'
						) {
							const labelProps: ChartLabelProps = { x, y, value: String(value) };
							return <ChartLabel fill="#3076df" {...labelProps} />;
						}
						return null;
					}}
					stroke="#3076df"
					strokeWidth={4}
					type={LINE_CHART_CURVE}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default Weight;