import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

const AVAILABLE_STROKE: string = '#1f1f1f';
const DISABLED_STROKE: string = '#e0e0e0';

const Pagination = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isFirstPage, setIsFirstPage] = useState<boolean>(true);

	// TODO 마지막 페이지일 때 처리

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setIsFirstPage(page === 1);
	};

	return (
		<div className="flex gap-2 h-9 items-center justify-center mb-4">
			<button
				className={cn(
					'bg-white h-9 w-9',
					isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isFirstPage}
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
			<button
				className={cn(
					'bg-white h-9 w-9',
					isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer',
				)}
				disabled={isFirstPage}
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
						stroke={isFirstPage ? DISABLED_STROKE : AVAILABLE_STROKE}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
			{/* 페이지 번호복 버튼들 */}
			{Array.from({ length: 10 }, (_, index) => (
				<button
					key={index + 1}
					className={cn(
						'border cursor-pointer font-normal h-9 leading-normal rounded-sm text-sm w-9',
						currentPage === index + 1
							? 'bg-primary-70 border-primary-70 text-white'
							: 'bg-white border-[#e0e0e0] text-text-100',
					)}
					onClick={() => handlePageChange(index + 1)}
				>
					{index + 1}
				</button>
			))}
			<button className="bg-white cursor-pointer h-9 w-9">
				<svg
					height="36"
					fill="none"
					width="36"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15.6562 25.3633L22.2969 18.4208L15.6562 11.4782"
						stroke="#1F1F1F"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</button>
			<button className="bg-white cursor-pointer h-9 w-9">
				<svg
					height="36"
					fill="none"
					width="36"
					viewBox="0 0 36 36"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.1406 25.3633L18.7813 18.4208L12.1406 11.4783"
						stroke="#1F1F1F"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
					<path
						d="M6.66406 25.3633L13.3047 18.4208L6.66406 11.4783"
						stroke="#1F1F1F"
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
