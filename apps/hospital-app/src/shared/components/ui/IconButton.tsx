import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type IconButtonVariant = 'default' | 'primary' | 'dark';
export type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: IconButtonVariant;
	size?: IconButtonSize;
	icon: ReactNode;
}

const variantStyles: Record<IconButtonVariant, string> = {
	default:
		'bg-bg-white border border-stroke-input text-text-100 hover:bg-bg-gray active:bg-bg-disabled',
	primary: 'bg-primary-70 text-text-0 hover:bg-primary-80 active:bg-primary-90',
	dark: 'bg-tap-1 text-text-0 hover:bg-text-80 active:bg-text-90',
};

const sizeStyles: Record<IconButtonSize, string> = {
	small: 'w-6 h-6 rounded-sm',
	medium: 'w-10 h-10 rounded-md',
	large: 'w-12 h-12 rounded-lg',
};

export function IconButton({
	variant = 'default',
	size = 'small',
	icon,
	className,
	...props
}: IconButtonProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center transition-colors',
				variantStyles[variant],
				sizeStyles[size],
				className,
			)}
			{...props}
		>
			{icon}
		</button>
	);
}
