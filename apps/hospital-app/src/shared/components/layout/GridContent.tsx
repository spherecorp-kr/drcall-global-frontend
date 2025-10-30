import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface GridContentProps {
	children: ReactNode;
	className?: string;
}

export function GridContent({ children, className }: GridContentProps) {
	return (
		<div className="h-full w-full overflow-auto bg-bg-gray">
			<div
				className={cn(
					'grid grid-cols-12 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[170px] gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5',
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
}
