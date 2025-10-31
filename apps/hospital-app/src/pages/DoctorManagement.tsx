import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { DoctorManagementTable } from '@/shared/components/ui/DoctorManagementTable';
import Pagination from '@/shared/components/ui/Pagination';
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
	const [isRegisteredOnly, setIsRegisteredOnly] = useState(false);

	const handleSearchChange = (value: string) => {
		setFilters({
			...filters,
			searchQuery: value,
		});
	};

	const toggleRegisteredFilter = () => {
		const newValue = !isRegisteredOnly;
		setIsRegisteredOnly(newValue);
		setFilters({
			...filters,
			isRegisteredOnly: newValue,
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
		<div className="h-full bg-bg-gray flex flex-col">
			{/* 상단 액션 바 */}
			<div className="px-5 pt-5 pb-4 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<Button
						variant={isRegisteredOnly ? 'primary' : 'outline'}
						size="default"
						icon={
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
									d="M16.25 5.625L7.8125 14.0625L3.75 10"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						}
						onClick={toggleRegisteredFilter}
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
			<div className="flex-1 px-5 pb-5 overflow-hidden">
				<div className="h-full bg-white rounded-[10px] border border-stroke-input flex flex-col">
					{loading ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-text-50 text-16 font-pretendard">로딩 중...</div>
						</div>
					) : doctors.length === 0 ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-text-50 text-16 font-pretendard">
								의사 목록이 없습니다
							</div>
						</div>
					) : (
						<>
							<div className="flex-1 overflow-auto">
								<DoctorManagementTable
									doctors={doctors}
									selectedDoctorId={selectedDoctorId}
									onRowClick={handleDoctorClick}
								/>
							</div>
							{totalPages > 0 && (
								<div className="py-4">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={setPage}
									/>
								</div>
							)}
						</>
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
