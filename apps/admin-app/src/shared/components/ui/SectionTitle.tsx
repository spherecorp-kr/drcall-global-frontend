import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface SectionTitleProps {
	children: ReactNode;
	className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
	return (
		<h2
			className={cn(
				'text-text-100 text-[20px] font-semibold font-pretendard leading-normal',
				className,
			)}
		>
			{children}
		</h2>
	);
}
