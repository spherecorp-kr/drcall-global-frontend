interface YAxisTickProps {
	x: number;
	y: number;
	payload: {
		value: number | string;
	}
}

const YAxisTick = ({ payload, x, y }: YAxisTickProps) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				className='font-medium text-xs'
				dy={5}
				fill='#c1c1c1'
				textAnchor='end'
				x={0}
				y={0}>{payload.value}</text>
		</g>
	);
};

export default YAxisTick;