import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import type { SelectOption } from '@/shared/types/select';

export type SelectSize = 'small' | 'medium' | 'large';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	size?: SelectSize;
	error?: boolean;
	badge?: string | number;
	description?: string;
	placeholder?: string;
	options?: SelectOption[];
	wrapperClassName?: string;
	icon?: ReactNode;
}

const sizeStyles: Record<SelectSize, { wrapper: string; select: string; radius: string }> = {
	small: {
		wrapper: 'h-8 px-4',
		select: 'pr-2 text-14',
		radius: 'rounded-lg',
	},
	medium: {
		wrapper: 'h-10',
		select: 'pl-4 pr-2 text-16',
		radius: 'rounded-lg',
	},
	large: {
		wrapper: 'h-12',
		select: 'pl-4 pr-2 text-16',
		radius: 'rounded-lg',
	},
};

const getOutlineStyle = (error?: boolean, disabled?: boolean, isOpen?: boolean) => {
	if (disabled) {
		return 'outline-stroke-input bg-bg-disabled';
	}
	if (error) {
		return 'outline-system-error bg-bg-white';
	}
	if (isOpen) {
		return 'outline-primary-70 bg-bg-white';
	}
	return 'outline-stroke-input bg-bg-white hover:outline-primary-70';
};

const ChevronIcon = ({ disabled }: { disabled?: boolean }) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform rotate-90">
		<path
			d="M9 18L15 12L9 6"
			stroke={disabled ? '#C1C1C1' : '#828282'}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			size = 'medium',
			error = false,
			badge,
			description,
			placeholder = '옵션 선택',
			options = [],
			className,
			wrapperClassName,
			disabled,
			icon,
			...props
		},
		ref,
	) => {
		const { wrapper, select, radius } = sizeStyles[size];
		const outlineStyle = getOutlineStyle(error, disabled);

		return (
			<div className={cn('inline-flex w-full flex-col gap-1', wrapperClassName)}>
				<div
					className={cn(
						'relative inline-flex w-full items-center justify-between',
						'outline outline-1 -outline-offset-1',
						wrapper,
						radius,
						outlineStyle,
					)}
				>
					<select
						ref={ref}
						disabled={disabled}
						className={cn(
							'flex-1 appearance-none bg-transparent font-pretendard outline-none',
							'text-text-100',
							'disabled:cursor-not-allowed disabled:text-text-40',
							'placeholder:text-text-30',
							select,
							className,
						)}
						{...props}
					>
						{placeholder && (
							<option value="" disabled selected hidden className="text-text-30">
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<div className="pointer-events-none flex items-center gap-2 pr-2">
						{badge && (
							<span className="rounded bg-primary-70 px-1.5 py-0.5 text-[14px] font-normal text-primary-70">
								{badge}
							</span>
						)}
						{icon || <ChevronIcon disabled={disabled} />}
					</div>
				</div>

				{description && (
					<span className="px-1 text-[12px] font-medium capitalize text-text-40">
						{description}
					</span>
				)}
			</div>
		);
	},
);

Select.displayName = 'Select';
