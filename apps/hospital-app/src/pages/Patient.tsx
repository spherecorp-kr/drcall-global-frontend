import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, Pagination } from '@/shared/components/ui';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { PatientManagementTable } from '@/shared/components/ui/PatientManagementTable';
import { usePatientManagement } from '@/shared/hooks/usePatientManagement';
import RegisterIcon from '@/shared/assets/icons/ic_register.svg?react';

export function Patient() {
	const navigate = useNavigate();
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
		navigate(`/patient/${patient.id}`);
	};

	const handlePatientRegister = () => {
		navigate('/patient/new');
	};

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 상단 액션 바 */}
			<div className="px-5 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
				<div className="flex items-center gap-2.5">
					<Button
						variant="primary"
						size="default"
						icon={<RegisterIcon />}
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