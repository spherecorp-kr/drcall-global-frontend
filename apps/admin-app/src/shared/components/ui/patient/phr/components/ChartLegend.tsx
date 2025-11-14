import { cn } from '@/shared/utils/cn.ts';

interface Props {
	isFull?: boolean;
	stroke: string;
	text: string;
}

const ChartLegend = ({ isFull = true, stroke, text }: Props) => {
	return (
		<div className={cn('flex gap-1 items-center justify-center', isFull ? 'w-full' : '')}>
			<svg xmlns='http://www.w3.org/2000/svg' width='16' height='3' viewBox='0 0 16 3' fill='none'>
				<path d='M2 1.5H14' stroke={stroke} strokeWidth='3' strokeLinecap='round' />
			</svg>
			<span className='text-sm text-text-100'>{text}</span>
		</div>
	);
};

export default ChartLegend;