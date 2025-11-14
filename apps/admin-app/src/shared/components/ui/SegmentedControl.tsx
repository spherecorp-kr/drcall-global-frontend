import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SegmentOption {
	label: string;
	value: string;
}

interface SegmentedControlProps {
	buttonClassName?: string;
	className?: string;
	onChange: (value: string) => void;
	options: SegmentOption[];
	value: string;
	variant?: 'default' | 'primary'; // default: tap-1 (검정), primary: primary-70 (파랑)
}

const SegmentedControl = ({
	buttonClassName = '',
	className,
	onChange,
	options,
	value,
	variant = 'default',
}: SegmentedControlProps) => {
	const selectedBgClass = variant === 'primary' ? 'bg-primary-70' : 'bg-tap-1';

	return (
		<div
			className={cn(
				'flex h-7 items-center rounded-lg border border-stroke-input bg-white p-0.5',
				className,
			)}
		>
			{options.map((option, index) => {
				const isSelected = value === option.value;
				// const isPrevSelected = index > 0 && value === options[index - 1].value;
				const isNextSelected =
					index < options.length - 1 && value === options[index + 1].value;

				return (
					<React.Fragment key={option.value}>
						<button
							type="button"
							onClick={() => onChange(option.value)}
							className={cn(
								'flex flex-1 items-center justify-center self-stretch rounded-md px-2.5 py-[3px] text-12 font-semibold capitalize transition-colors',
								isSelected ? `${selectedBgClass} text-text-0` : 'text-text-100',
								buttonClassName,
							)}
						>
							<div className="flex h-[18px] flex-col justify-center text-center text-sm">
								{option.label}
							</div>
						</button>
						{index < options.length - 1 && (
							<div
								className={cn(
									'h-3 w-px rounded-sm opacity-30',
									// 선택된 버튼 양옆의 디바이더는 배경색 없음 (투명)
									// 선택되지 않은 버튼들 사이의 디바이더만 bg-stroke-segmented 적용
									!isSelected && !isNextSelected && 'bg-stroke-segmented',
								)}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
}

export default SegmentedControl;