import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
	wrapperClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	({ label, className, wrapperClassName, disabled, ...props }, ref) => {
		return (
			<label
				className={cn(
					'inline-flex items-center gap-2',
					disabled ? 'cursor-not-allowed' : 'cursor-pointer',
					wrapperClassName,
				)}
			>
				<div className="relative flex h-5 w-5 items-center justify-center">
					<input
						ref={ref}
						type="radio"
						disabled={disabled}
						className={cn('peer sr-only', className)}
						{...props}
					/>
					{/* Outer circle - unchecked */}
					<div
						className={cn(
							'absolute h-5 w-5 rounded-full',
							'border border-stroke-input bg-bg-white',
							'peer-checked:border-primary-70 peer-checked:bg-primary-70',
							'peer-disabled:border-stroke-input peer-disabled:bg-bg-disabled',
							'peer-disabled:peer-checked:border-stroke-input peer-disabled:peer-checked:bg-bg-disabled',
						)}
					/>
					{/* Inner circle - checked */}
					<div
						className={cn(
							'absolute hidden h-2.5 w-2.5 rounded-full',
							'bg-bg-white',
							'peer-checked:block',
							'peer-disabled:peer-checked:bg-text-50',
						)}
					/>
				</div>
				{label && (
					<span
						className={cn(
							'select-none font-pretendard text-16 text-text-100',
							disabled && 'text-text-40',
						)}
					>
						{label}
					</span>
				)}
			</label>
		);
	},
);

Radio.displayName = 'Radio';
