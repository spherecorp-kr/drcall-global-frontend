import type { XAxisTickProps } from '@/shared/types/phr';

const XAxisTick = ({ payload, x, y }: XAxisTickProps) => {
	const [e1, e2] = payload.value.split('|');
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				className='font-medium text-xs'
				dy={5}
				fill='#c1c1c1'
				textAnchor='middle'
				x={0}
				y={0}>{e1}</text>
			{e2 && (
				<text
					className='font-medium text-xs'
					dy={5}
					fill='#c1c1c1'
					textAnchor='middle'
					x={0}
					y={20}>{e2}</text>
			)}
		</g>
	);
};

export default XAxisTick;