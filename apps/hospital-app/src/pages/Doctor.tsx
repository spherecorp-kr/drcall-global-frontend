import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, Pagination } from '@/shared/components/ui';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { DoctorManagementTable } from '@/shared/components/ui/DoctorManagementTable';
import { DoctorRegistrationModal, type DoctorFormData } from '@/shared/components/ui/DoctorRegistrationModal';
import { useDoctorManagement } from '@/shared/hooks/useDoctorManagement';

export function Doctor() {
	const navigate = useNavigate();
	const {
		doctors,
		filters,
		setFilters,
		currentPage,
		totalPages,
		setPage,
	} = useDoctorManagement(10);

	const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

	const handleSearchChange = (value: string) => {
		setFilters({
			...filters,
			searchQuery: value,
		});
	};

	const handleDoctorClick = (doctor: { id: string }) => {
		navigate(`/doctor/${doctor.id}`);
	};

	const handleDoctorRegister = (data: DoctorFormData) => {
		// TODO: 실제 API 호출
		console.log('의사 등록:', data);
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
						onClick={() => setIsRegistrationModalOpen(true)}
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

			{/* 의료진 등록 모달 */}
			<DoctorRegistrationModal
				isOpen={isRegistrationModalOpen}
				onClose={() => setIsRegistrationModalOpen(false)}
				onSubmit={handleDoctorRegister}
			/>

			{/* 테이블 */}
			<div className="flex-1 px-5 pb-3 min-h-0">
				<div className="h-full bg-white rounded-[10px] border border-stroke-input flex flex-col">
					<div className="flex-1 min-h-0">
						<DoctorManagementTable
							doctors={doctors}
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
		</div>
	);
}

export default Doctor;
