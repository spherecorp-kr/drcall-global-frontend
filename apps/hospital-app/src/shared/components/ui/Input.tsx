import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type InputSize = 'small' | 'medium' | 'large';
export type InputState = 'default' | 'focused' | 'error' | 'disabled';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
	error?: boolean;
	icon?: ReactNode;
	size?: InputSize;
	state?: InputState;
	wrapperClassName?: string;
	compact?: boolean;
}

const sizeStyles: Record<InputSize, { wrapper: string; input: string; radius: string; innerPadding: string }> = {
	small: {
		wrapper: 'h-8 px-2',
		input: 'text-14',
		radius: 'rounded-[6px]',
		innerPadding: 'px-1',
	},
	medium: {
		wrapper: 'h-10 px-4 py-2.5',
		input: 'text-16',
		radius: 'rounded-lg',
		innerPadding: '',
	},
	large: {
		wrapper: 'h-12',
		input: 'px-4 text-16',
		radius: 'rounded-[9px]',
		innerPadding: '',
	},
};

const getOutlineStyle = (error?: boolean, disabled?: boolean) => {
	if (disabled) {
		return 'outline-stroke-input bg-bg-disabled';
	}
	if (error) {
		return 'outline-system-error bg-bg-white focus-within:outline-system-error';
	}
	return 'outline-stroke-input bg-bg-white focus-within:outline-primary-70';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			disabled,
			error = false,
			icon,
			placeholder,
			size = 'medium',
			wrapperClassName,
			compact = false,
			...props
		},
		ref,
	) => {
		const { wrapper, input, radius, innerPadding } = sizeStyles[size];
		const outlineStyle = getOutlineStyle(error, disabled);

		return (
			<div
				className={cn(
					'inline-flex w-full items-center justify-between gap-2',
					'outline outline-1 -outline-offset-1',
					wrapper,
					radius,
					outlineStyle,
					compact && 'px-4',
					wrapperClassName,
				)}
			>
				<div
					className={cn(
						'flex flex-1 items-center gap-2 self-stretch',
						size === 'large' && !compact && 'pl-4',
						size === 'large' && !icon && !compact && 'pr-4',
						innerPadding,
					)}
				>
					<input
						ref={ref}
						disabled={disabled}
						placeholder={placeholder}
						className={cn(
							'flex-1 bg-transparent font-pretendard outline-none',
							'text-text-100 placeholder:text-text-30',
							'disabled:cursor-not-allowed disabled:text-text-100',
							'[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden',
							!compact && input,
							compact && 'text-16',
							className,
						)}
						{...props}
					/>
				</div>
				{icon && <div className="pr-2">{icon}</div>}
			</div>
		);
	},
);

Input.displayName = 'Input';
