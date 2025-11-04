import React, { type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import { SectionTitle } from './SectionTitle';
import { SearchInput } from './SearchInput';

interface SectionProps {
	title: string | ReactNode;
	count?: number;
	actions?: ReactNode;
	filters?: ReactNode;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearch?: (value: string) => void;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	headerClassName?: string;
	onExpand?: (event?: React.MouseEvent) => void;
	isExpanded?: boolean;
	headerFixed?: boolean;
	onHeaderFixedChange?: (fixed: boolean) => void;
}

const ExpandIcon = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path
			d="M13 3H17M17 3V7M17 3L11 9M7 17H3M3 17V13M3 17L9 11"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

const PinIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
		<g
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			transform="rotate(45 12 12)"
		>
			{/* 모래시계형 일체형 손잡이 */}
			<path d="M8 5h8" />
			<path d="M8 5 C11 7.5, 11 11.5, 8 14" />
			<path d="M16 5 C13 7.5, 13 11.5, 16 14" />
			<path d="M8 14h8" />
			{/* 샤프트 + 바늘 */}
			<path d="M12 14V22" />
		</g>
	</svg>
);

export function Section({
	title,
	count,
	actions,
	filters,
	searchPlaceholder,
	searchValue,
	onSearch,
	children,
	className,
	contentClassName,
	headerClassName,
	onExpand,
	isExpanded = false,
	headerFixed = false,
	onHeaderFixedChange,
}: SectionProps) {
	return (
		<div className={cn('flex flex-col h-full w-full', className)} style={{ gap: '10px' }}>
			{/* Header - No background, no border */}
			<div className={cn('flex-shrink-0', headerClassName)}>
				<div className="flex flex-col gap-2 sm:gap-3">
					{/* Title Row */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
							{typeof title === 'string' ? (
								<SectionTitle>{title}</SectionTitle>
							) : (
								<div className="flex items-center gap-1.5 sm:gap-2">
									{title}
								</div>
							)}
							{count !== undefined && (
								<span className="text-primary-70 text-sm sm:text-base font-semibold font-pretendard leading-normal flex-shrink-0">
									({count})
								</span>
							)}
						</div>
						<div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
							{actions && (
								<div className="flex items-center gap-1.5 sm:gap-2">{actions}</div>
							)}
							{onHeaderFixedChange && (
								<button
									onClick={() => onHeaderFixedChange(!headerFixed)}
									className={cn(
										'flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded transition-colors',
										headerFixed
											? 'bg-primary-70 text-text-0 hover:bg-primary-80'
											: 'bg-bg-gray text-text-60 hover:bg-gray-200',
									)}
									title={headerFixed ? '컬럼명 고정 해제' : '컬럼명 고정'}
								>
									<PinIcon />
								</button>
							)}
							{onExpand && (
								<button
									onClick={(e) => onExpand(e)}
									className={cn(
										'flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded transition-colors',
										isExpanded
											? 'bg-primary-70 text-text-0 hover:bg-primary-80'
											: 'bg-bg-gray text-text-60 hover:bg-gray-200',
									)}
									aria-label={isExpanded ? '축소' : '확대'}
								>
									<ExpandIcon />
								</button>
							)}
						</div>
					</div>

					{/* Filters and Search Row */}
					{(filters || searchPlaceholder) && (
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 md:gap-5">
							{filters && (
								<div className="flex items-center gap-2 sm:gap-3 flex-wrap">
									{filters}
								</div>
							)}
							{searchPlaceholder && (
								<div className="flex-1 sm:max-w-[400px] md:max-w-[500px] lg:max-w-[578px] sm:ml-auto">
									<SearchInput
										value={searchValue || ''}
										onChange={(value) => onSearch?.(value)}
										placeholder={searchPlaceholder}
										className="h-9 sm:h-10"
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Content - White background with border */}
			<div
				className={cn(
					'flex-1 min-h-0 overflow-auto bg-bg-white rounded-[10px] border border-stroke-input',
					contentClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}
