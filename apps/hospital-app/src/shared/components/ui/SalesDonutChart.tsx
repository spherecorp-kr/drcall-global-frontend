import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PaymentMethodData, SalesItemData } from '@/shared/types/payment';
import { Section } from './Section';
import ValidationInfoIcon from '@/shared/assets/icons/ic_validation_info.svg';

interface SalesDonutChartProps {
	data: (PaymentMethodData | SalesItemData)[];
	title: string;
	totalAmount: number;
	infoText?: string;
}

export function SalesDonutChart({ data, title, totalAmount, infoText }: SalesDonutChartProps) {
	const isEmpty = data.length === 0 || totalAmount === 0;

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const item = payload[0].payload;
			return (
				<div className="bg-tap-1 rounded-lg p-3 shadow-lg">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2 text-text-0 text-14 font-pretendard">
							<div
								className="w-2 h-2 rounded-sm"
								style={{ backgroundColor: item.color }}
							/>
							<span>{item.name}</span>
						</div>
						<div className="text-primary-60 text-16 font-pretendard font-semibold">
							{item.value.toLocaleString()} THB ({item.percentage}%)
						</div>
					</div>
				</div>
			);
		}
		return null;
	};

	const CustomLegend = () => {
		return (
			<div className="flex flex-col justify-center gap-3">
				{data.map((item, index) => (
					<div key={`legend-${index}`} className="flex items-center justify-between gap-5 py-1">
						<div className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-sm flex-shrink-0"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-text-70 text-16 font-normal font-pretendard whitespace-nowrap">
								{item.name} ({item.percentage}%)
							</span>
						</div>
						<span className="text-text-100 text-16 font-semibold font-pretendard text-right whitespace-nowrap">
							{item.value.toLocaleString()} THB
						</span>
					</div>
				))}
			</div>
		);
	};

	return (
		<Section
			title={
				<div className="flex items-center gap-2">
					<h3 className="text-text-100 text-18 font-semibold font-pretendard">{title}</h3>
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
			{isEmpty ? (
				<div className="flex flex-col items-center justify-center py-20">
					<div className="text-text-40 text-16 font-normal font-pretendard mb-2">
						ⓘ {title.includes('방법') ? '결제 방법' : '매출 항목'} 비중 데이터가 없습니다.
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center py-5 overflow-x-auto" style={{ gap: '60px' }}>
					<div style={{ flex: '0 0 340px', width: 340, height: 340, position: 'relative' }}>
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									innerRadius={120}
									outerRadius={170}
									fill="#8884d8"
									paddingAngle={0}
									dataKey="value"
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
							</PieChart>
						</ResponsiveContainer>
						<div
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
						>
							<div className="text-text-100 text-24 font-semibold font-pretendard whitespace-nowrap">
								{totalAmount.toLocaleString()} THB
							</div>
						</div>
					</div>
					<div style={{ flex: '0 0 auto' }}>
						<CustomLegend />
					</div>
				</div>
			)}
		</Section>
	);
}

export default SalesDonutChart;
