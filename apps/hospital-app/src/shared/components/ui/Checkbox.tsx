import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import sampleImg from '@/assets/react.svg';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	hasImage?: boolean;
	label?: string | ReactNode;
	wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{ checked, className, disabled, hasImage = false, label, wrapperClassName, ...props },
		ref,
	) => {
		return (
			<label
				className={cn(
					'inline-flex items-center gap-2',
					disabled ? 'cursor-not-allowed' : 'cursor-pointer',
					checked ? 'bg-bg-blue' : 'bg-white',
					wrapperClassName,
				)}
			>
				<div className="relative flex h-5 w-5 items-center justify-center">
					<input
						ref={ref}
						type="checkbox"
						disabled={disabled}
						checked={checked}
						className={className}
						{...props}
					/>
				</div>
				{hasImage && <img alt="img" className="h-7 rounded-full w-7" src={sampleImg} />}
				{label && (
					<span
						className={cn(
							'font-normal leading-normal text-sm text-text-100',
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

Checkbox.displayName = 'Checkbox';
