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

const sizeStyles: Record<InputSize, { wrapper: string; input: string; radius: string }> = {
	small: {
		wrapper: 'h-8',
		input: 'px-2 text-14',
		radius: 'rounded-[6px]',
	},
	medium: {
		wrapper: 'h-10',
		input: 'px-4 text-16',
		radius: 'rounded-[9px]',
	},
	large: {
		wrapper: 'h-12',
		input: 'px-4 text-16',
		radius: 'rounded-[9px]',
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
		const { wrapper, input, radius } = sizeStyles[size];
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
						!compact && 'pl-4',
						!icon && !compact && 'pr-4',
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
							!compact && input,
							compact && 'text-16',
							className,
						)}
						{...props}
					/>
				</div>
				{icon}
			</div>
		);
	},
);

Input.displayName = 'Input';
