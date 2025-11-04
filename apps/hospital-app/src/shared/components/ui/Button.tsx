import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost';
export type ButtonSize = 'default' | 'small';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: ReactNode;
	iconPosition?: 'left' | 'right';
	children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		'bg-primary-70 !text-text-0 hover:bg-primary-80 active:bg-primary-90 disabled:bg-primary-30 disabled:!text-text-0',
	dark: 'bg-tap-1 !text-text-0 hover:bg-text-80 active:bg-text-90 disabled:bg-text-50 disabled:!text-text-20',
	outline:
		'border border-primary-70 !text-primary-70 bg-bg-white hover:bg-bg-blue active:outline active:outline-primary-90 active:-outline-offset-1 disabled:border-stroke-input disabled:!text-text-20 disabled:bg-bg-disabled',
	ghost: 'border border-stroke-input !text-text-100 bg-bg-white hover:bg-bg-gray active:outline active:outline-text-90 active:-outline-offset-1 disabled:border-stroke-input disabled:bg-bg-disabled',
};

const sizeStyles: Record<ButtonSize, string> = {
	default: 'h-10 px-5 text-16 font-medium',
	small: 'h-7 px-3 text-14 font-normal',
};

const ghostDisabledTextStyles: Record<ButtonSize, string> = {
	default: 'disabled:!text-text-20',
	small: 'disabled:!text-text-40',
};

const Button = ({
	variant = 'primary',
	size = 'default',
	icon,
	iconPosition = 'left',
	children,
	className,
	disabled,
	...props
}: ButtonProps) => {
	const iconSize = size === 'small' ? 'w-5 h-5' : 'w-5 h-5';

	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-1.5 font-pretendard transition-colors rounded-sm',
				'disabled:cursor-not-allowed',
				variantStyles[variant],
				sizeStyles[size],
				variant === 'ghost' && ghostDisabledTextStyles[size],
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{icon && iconPosition === 'left' && <span className={cn('flex-shrink-0', iconSize)}>{icon}</span>}
			{children}
			{icon && iconPosition === 'right' && <span className={cn('flex-shrink-0', iconSize)}>{icon}</span>}
		</button>
	);
}

export default Button;