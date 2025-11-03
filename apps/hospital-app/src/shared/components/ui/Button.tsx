import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost';
export type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: ReactNode;
	iconPosition?: 'left' | 'right';
	children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		'bg-primary-70 text-text-0 hover:bg-primary-80 active:bg-primary-90 disabled:bg-primary-30 disabled:text-text-0',
	dark: 'bg-tap-1 text-text-0 hover:bg-text-80 active:bg-text-90 disabled:bg-text-50 disabled:text-text-20',
	outline:
		'border border-primary-70 text-primary-70 bg-bg-white hover:bg-bg-blue active:outline-primary-90 active:outline active:-outline-offset-1 disabled:border-stroke-input disabled:text-primary-70 disabled:bg-bg-disabled',
	ghost: 'border border-stroke-input text-text-100 bg-bg-white hover:bg-bg-gray active:outline-text-90 active:outline active:-outline-offset-1 disabled:border-stroke-input disabled:text-text-40 disabled:bg-bg-disabled',
};

const sizeStyles: Record<ButtonSize, string> = {
	large: 'h-14 px-6 text-16 rounded-md',
	medium: 'h-12 px-5 text-16 rounded-md',
	small: 'h-10 px-4 text-14 rounded-md',
};

const Button = ({
	variant = 'primary',
	size = 'medium',
	icon,
	iconPosition = 'left',
	children,
	className,
	disabled,
	...props
}: ButtonProps) => {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center gap-2 font-pretendard font-medium transition-colors',
				'disabled:cursor-not-allowed disabled:text-text-20',
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
			disabled={disabled}
			{...props}
		>
			{icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
			{children}
			{icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
		</button>
	);
}

export default Button;