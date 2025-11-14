import { cn } from '@/shared/utils/cn';

const AVAILABLE_STROKE: string = '#1f1f1f';
const DISABLED_STROKE: string = '#e0e0e0';

interface PaginationProps {
	className?: string;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	maxVisiblePages?: number;
}

const Pagination = ({
	className = '',
	currentPage,
	totalPages,
	onPageChange,
	maxVisiblePages = 10
}: PaginationProps) => {
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	// 현재 페이지가 속한 블록 계산 (1-based)
	const currentBlock = Math.floor((currentPage - 1) / maxVisiblePages);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	// 현재 블록의 페이지들 계산
	const getVisiblePages = () => {
		const pages: number[] = [];
		const start = currentBlock * maxVisiblePages + 1;
		const end = Math.min(start + maxVisiblePages, totalPages + 1);

		for (let i = start; i < end; i++) {
			pages.push(i);
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	// 이전/다음 10페이지로 이동
	const handlePrevBlock = () => {
		const prevPage = Math.max(1, currentPage - maxVisiblePages);
		handlePageChange(prevPage);
	};

	const handleNextBlock = () => {
		const nextPage = Math.min(currentPage + maxVisiblePages, totalPages);
		handlePageChange(nextPage);
	};

	// < > 버튼 disabled 조건
	const isPrevBlockDisabled = currentPage <= maxVisiblePages;
	const isNextBlockDisabled = currentPage + maxVisiblePages > totalPages;

	return (
		<div className={cn('flex gap-2 h-9 items-center justify-center', className)}>
			{/* 처음으로 */}
			<button
				className={cn(
					'bg-white h-9 w-9',
					isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isFirstPage}
				onClick={() => handlePageChange(1)}
			>
				<svg
					fill="none"
					height="36"
					viewBox="0 0 36 36"
					width="36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M23.8594 25.3633L17.2187 18.4208L23.8594 11.4783"
						stroke={isFirstPage ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
					<path
						d="M29.3359 25.3633L22.6953 18.4208L29.3359 11.4783"
						stroke={isFirstPage ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
			{/* 이전 10페이지 */}
			<button
				className={cn(
					'bg-white h-9 w-9',
					isPrevBlockDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isPrevBlockDisabled}
				onClick={handlePrevBlock}
			>
				<svg
					height="36"
					fill="none"
					width="36"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M20.3438 25.3633L13.7031 18.4208L20.3438 11.4783"
						stroke={isPrevBlockDisabled ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
			{/* 페이지 번호 버튼들 */}
			{visiblePages.map((pageNumber) => (
				<button
					key={pageNumber}
					className={cn(
						'border cursor-pointer font-normal h-9 leading-[normal] rounded-sm text-sm w-9',
						currentPage === pageNumber
							? 'bg-primary-70 border-primary-70 text-white'
							: 'bg-white border-[#e0e0e0] text-text-100',
					)}
					onClick={() => handlePageChange(pageNumber)}
				>
					{pageNumber}
				</button>
			))}
			{/* 다음 10페이지 */}
			<button
				className={cn(
					'bg-white h-9 w-9',
					isNextBlockDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isNextBlockDisabled}
				onClick={handleNextBlock}
			>
				<svg
					height="36"
					fill="none"
					width="36"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15.6562 25.3633L22.2969 18.4208L15.6562 11.4782"
						stroke={isNextBlockDisabled ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
			{/* 마지막으로 */}
			<button
				className={cn(
					'bg-white h-9 w-9',
					isLastPage ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isLastPage}
				onClick={() => handlePageChange(totalPages)}
			>
				<svg
					height="36"
					fill="none"
					width="36"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.1406 25.3633L18.7813 18.4208L12.1406 11.4783"
						stroke={isLastPage ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
					<path
						d="M6.66406 25.3633L13.3047 18.4208L6.66406 11.4783"
						stroke={isLastPage ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Pagination;