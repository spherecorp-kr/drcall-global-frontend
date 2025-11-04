import { Button, EmptyState, Pagination } from '@/shared/components/ui';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { PatientManagementTable } from '@/shared/components/ui/PatientManagementTable';
import { usePatientManagement } from '@/shared/hooks/usePatientManagement';

export function Patient() {
	const {
		patients,
		filters,
		setFilters,
		currentPage,
		totalPages,
		setPage,
	} = usePatientManagement(10);

	const handleSearchChange = (value: string) => {
		setFilters({
			...filters,
			searchQuery: value,
		});
	};

	const handlePatientClick = (patient: { id: string }) => {
		// TODO: 환자 상세 페이지 이동 또는 모달 열기
		console.log('환자 클릭:', patient);
	};

	const handlePatientRegister = () => {
		// TODO: 환자 등록 모달 열기
		console.log('환자 등록');
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
									d="M17.67 4.41L16.97 13.41C16.88 14.78 16.01 16 14.69 16H5.39001C4.01001 16 3.17001 14.65 3.17001 13.32L2.38001 4.43C2.35001 4.18 2.55001 3.95 2.80001 3.95H17.24C17.5 3.95 17.7 4.18 17.67 4.41Z"
									fill="currentColor"
								/>
							</svg>
						}
						onClick={handlePatientRegister}
					>
						환자 등록
					</Button>
				</div>
				<SearchInput
					value={filters.searchQuery}
					onChange={handleSearchChange}
					placeholder="환자명, 휴대폰 번호"
					className="w-[464px]"
				/>
			</div>

			{/* 테이블 */}
			<div className="flex-1 px-5 pb-3 min-h-0">
				<div className="h-full bg-white rounded-[10px] border border-stroke-input flex flex-col">
					<div className="flex-1 min-h-0">
						<PatientManagementTable
							patients={patients}
							onRowClick={handlePatientClick}
							emptyState={<EmptyState message="환자 목록이 없습니다." />}
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

export default Patient;