import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { DoctorManagementTable } from '@/shared/components/ui/DoctorManagementTable';
import Pagination from '@/shared/components/ui/Pagination';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useDoctorManagement } from '@/shared/hooks/useDoctorManagement';

export function DoctorManagement() {
	const {
		doctors,
		loading,
		filters,
		setFilters,
		currentPage,
		totalPages,
		setPage,
	} = useDoctorManagement(10);

	const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

	const handleSearchChange = (value: string) => {
		setFilters({
			...filters,
			searchQuery: value,
		});
	};

	const handleDoctorClick = (doctor: { id: string }) => {
		setSelectedDoctorId(doctor.id);
	};

	const handleAddDoctor = () => {
		// TODO: 의사 등록 모달 열기
		console.log('의사 등록');
	};

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 상단 액션 바 */}
			<div className="px-5 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
				<div className="flex items-center gap-2.5">
					<Button
						variant="primary"
						size="default"
						icon={
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
									d="M16.9024 4.35528C17.2582 3.93329 17.8883 3.87959 18.3106 4.23516C18.7329 4.59098 18.7875 5.22196 18.4317 5.64434L9.16506 16.6443L8.51955 17.409L1.35549 11.3641C0.933427 11.008 0.879351 10.377 1.23537 9.95489C1.5915 9.53281 2.22244 9.47967 2.64455 9.83574L8.27931 14.5897L16.9024 4.35528Z"
									fill="currentColor"
								/>
							</svg>
						}
						onClick={() => {
						// TODO: 의료진 등록 모달 열기
					}}
					>
						의료진 등록
					</Button>
				</div>
				<SearchInput
					value={filters.searchQuery}
					onChange={handleSearchChange}
					placeholder="의사명, 아이디"
					className="w-[464px]"
				/>
			</div>

			{/* 테이블 */}
			<div className="flex-1 px-5 pb-3 min-h-0">
				<div className="h-full bg-white rounded-[10px] border border-stroke-input flex flex-col">
					<div className="flex-1 min-h-0">
						<DoctorManagementTable
							doctors={doctors}
							selectedDoctorId={selectedDoctorId}
							onRowClick={handleDoctorClick}
							emptyState={<EmptyState message="의료진 목록이 없습니다." />}
						/>
					</div>
					{totalPages > 0 && (
						<div className="py-3 flex-shrink-0">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						</div>
					)}
				</div>
			</div>

			{/* 의사 등록 플로팅 버튼 (예비) */}
			<button
				onClick={handleAddDoctor}
				className="fixed bottom-8 right-8 w-[84px] h-[84px] bg-primary-70 rounded-full border-[1.5px] border-white shadow-lg flex flex-col items-center justify-center gap-0.5 hover:bg-primary-80 transition-colors group"
				aria-label="의사 등록"
			>
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
					<path
						d="M16 8V24M8 16H24"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span className="text-text-0 text-16 font-semibold font-pretendard">등록</span>
			</button>
		</div>
	);
}
