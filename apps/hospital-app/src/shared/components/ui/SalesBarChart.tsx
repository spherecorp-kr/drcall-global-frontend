import { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { SalesChartData } from '@/shared/types/payment';
import { Section } from './Section';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';
import ArrowLeftIcon from '@/shared/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/shared/assets/icons/ic_arrow_right.svg';

interface SalesBarChartProps {
	data: SalesChartData[];
	infoText?: string;
}

export function SalesBarChart({ data, infoText }: SalesBarChartProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
		}
	};

	const scroll = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 400;
			scrollContainerRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth',
			});
		}
	};
	const formatYAxis = (value: number) => {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(0)}M`;
		}
		return value.toLocaleString();
	};

	const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: SalesChartData; value: number }> }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-tap-1 rounded-[10px] p-4 shadow-lg">
					<p className="text-text-0 text-14 font-pretendard font-normal">
						{payload[0].payload.date}
					</p>
					<p className="text-primary-60 text-16 font-pretendard font-semibold mt-1">
						{payload[0].value.toLocaleString()} THB
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Section
			title={
				<div className="flex items-center gap-2">
					<h3 className="text-text-100 text-18 font-semibold font-pretendard">매출 추이</h3>
					{infoText && (
						<div className="flex items-center gap-1 text-primary-60 text-14 font-semibold font-pretendard">
							<img src={ValidationInfoIcon} alt="info" className="w-3.5 h-3.5" />
							<span>{infoText}</span>
						</div>
					)}
				</div>
			}
			contentClassName="p-5"
		>
			<div className="flex justify-end mb-4">
				<span className="text-text-100 text-14 font-normal font-pretendard">단위 : THB</span>
			</div>
			<div className="relative">
				<div
					ref={scrollContainerRef}
					onScroll={checkScroll}
					className="overflow-x-auto"
				>
					<div style={{ minWidth: data.length > 7 ? `${data.length * 100}px` : '100%' }}>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
								<XAxis
									dataKey="date"
									tick={{ fill: '#6E6E6E', fontSize: 14, fontFamily: 'Pretendard' }}
									axisLine={{ stroke: '#E0E0E0' }}
									tickLine={false}
								/>
								<YAxis
									tickFormatter={formatYAxis}
									tick={{ fill: '#6E6E6E', fontSize: 14, fontFamily: 'Pretendard' }}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 160, 210, 0.1)' }} />
								<Bar dataKey="amount" fill="#4DBDE0" radius={[4, 4, 0, 0]} maxBarSize={60}>
									{data.map((_entry, index) => (
										<Cell key={`cell-${index}`} fill="#4DBDE0" />
									))}
									<LabelList
										dataKey="amount"
										position="top"
										formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : '')}
										style={{
											fill: '#047EA5',
											fontSize: 14,
											fontFamily: 'Pretendard',
											fontWeight: 400,
										}}
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				{data.length > 7 && (
					<>
						<button
							onClick={() => scroll('left')}
							disabled={!canScrollLeft}
							className={`absolute left-0 top-1/2 -translate-y-1/2 ${
								canScrollLeft ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
							}`}
						>
							<img src={ArrowLeftIcon} alt="Previous" className="w-7 h-7" />
						</button>
						<button
							onClick={() => scroll('right')}
							disabled={!canScrollRight}
							className={`absolute right-0 top-1/2 -translate-y-1/2 ${
								canScrollRight ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
							}`}
						>
							<img src={ArrowRightIcon} alt="Next" className="w-7 h-7" />
						</button>
					</>
				)}
			</div>
		</Section>
	);
}

export default SalesBarChart;
