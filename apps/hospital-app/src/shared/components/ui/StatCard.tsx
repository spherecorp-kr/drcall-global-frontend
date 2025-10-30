import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
	icon: ReactNode;
	iconBgColor: string;
	label: string;
	value: string;
	change?: {
		type: 'increase' | 'decrease';
		value: string;
	};
	subtitle?: string;
	className?: string;
}

const ArrowUpIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M8 12V4M8 4L4 8M8 4L12 8"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const ArrowDownIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M8 4V12M8 12L12 8M8 12L4 8"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export function StatCard({
	icon,
	iconBgColor,
	label,
	value,
	change,
	subtitle,
	className,
}: StatCardProps) {
	return (
		<div className={cn('bg-bg-white rounded-[10px] p-5 flex flex-col gap-3', className)}>
			{/* Icon and Label */}
			<div className="flex items-center gap-3">
				<div
					className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
					style={{ backgroundColor: iconBgColor }}
				>
					{icon}
				</div>
				<span className="text-text-60 text-14 font-normal font-pretendard leading-normal">
					{label}
				</span>
			</div>

			{/* Value and Change */}
			<div className="flex items-center gap-2">
				<span className="text-text-100 text-24 font-semibold font-pretendard leading-normal">
					{value}
				</span>
				{change && (
					<div
						className={cn(
							'flex items-center gap-1',
							change.type === 'increase' ? 'text-text-blue' : 'text-text-red',
						)}
					>
						{change.type === 'increase' ? <ArrowUpIcon /> : <ArrowDownIcon />}
						<span className="text-14 font-medium font-pretendard leading-normal">
							{change.value}
						</span>
					</div>
				)}
			</div>

			{/* Subtitle */}
			{subtitle && (
				<span className="text-text-60 text-12 font-normal font-pretendard leading-normal">
					{subtitle}
				</span>
			)}
		</div>
	);
}
