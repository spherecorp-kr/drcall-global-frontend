import type { ChartLabelProps } from '@/shared/types/phr';

interface Props extends ChartLabelProps {
	fill: string;
}

const ChartLabel = ({ fill, value, x, y }: Props) => {
	const yPos = y < 30 ? y + 15 : y - 15;

	return (
		<g>
			{/* 테두리용 텍스트 */}
			<text
				className='font-medium text-sm'
				fill='none'
				stroke='#fff'
				strokeWidth={2}
				textAnchor='middle'
				x={x}
				y={yPos}>{value}</text>
			{/* 실제 텍스트 */}
			<text
				className='font-medium text-sm'
				fill={fill}
				textAnchor='middle'
				x={x}
				y={yPos}>{value}</text>
		</g>
	);
};

export default ChartLabel;