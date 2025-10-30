import { useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { cn } from '@/shared/utils/cn';
import { Section } from './Section';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { Dropdown, EmptyState, Table } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';
import { levelBadgeMap } from '@/shared/utils/constants';

export interface Appointment {
	id: string;
	patientLevel?: 'VIP' | 'Risk';
	appointmentNumber: string;
	patientName: string;
	preferredDateTime: string;
	doctor: string;
	status: '진료 대기' | '진료 중' | '진료 완료' | '예약 취소';
}

interface AppointmentTableProps {
	appointments: Appointment[];
	className?: string;
	onExpand?: () => void;
	isExpanded?: boolean;
}

const appointmentStatusColor: Record<Appointment['status'], string> = {
	'진료 대기': 'text-primary-70',
	'진료 중': 'text-system-caution',
	'진료 완료': 'text-text-100',
	'예약 취소': 'text-system-error',
};

const gradeOptions: DropdownOption[] = [
	{ value: 'all', label: '전체 등급' },
	{ value: 'VIP', label: 'VIP' },
	{ value: 'Risk', label: 'Risk' },
];

const statusOptions: DropdownOption[] = [
	{ value: 'all', label: '전체' },
	{ value: '진료 대기', label: '진료 대기' },
	{ value: '진료 중', label: '진료 중' },
	{ value: '진료 완료', label: '진료 완료' },
	{ value: '예약 취소', label: '예약 취소' },
];

export function AppointmentTable({
	appointments,
	className,
	onExpand,
	isExpanded,
}: AppointmentTableProps) {
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

	const appointmentTableHeaderFixed = useLayoutStore(
		(state) => state.appointmentTableHeaderFixed,
	);
	const setAppointmentTableHeaderFixed = useLayoutStore(
		(state) => state.setAppointmentTableHeaderFixed,
	);
	const gradeFilter = useLayoutStore((state) => state.appointmentGradeFilter);
	const statusFilter = useLayoutStore((state) => state.appointmentStatusFilter);
	const searchTerm = useLayoutStore((state) => state.appointmentSearchTerm);
	const setGradeFilter = useLayoutStore((state) => state.setAppointmentGradeFilter);
	const setStatusFilter = useLayoutStore((state) => state.setAppointmentStatusFilter);
	const setSearchTerm = useLayoutStore((state) => state.setAppointmentSearchTerm);
	const sorting = useLayoutStore((state) => state.appointmentTableSorting);
	const setSorting = useLayoutStore((state) => state.setAppointmentTableSorting);

	const filteredAppointments = useMemo(() => {
		return appointments.filter((appointment) => {
			const matchLevel = gradeFilter === 'all' || appointment.patientLevel === gradeFilter;
			const matchStatus = statusFilter === 'all' || appointment.status === statusFilter;
			const normalizedSearch = searchTerm.trim().toLowerCase();
			const matchSearch =
				!normalizedSearch ||
				appointment.appointmentNumber.toLowerCase().includes(normalizedSearch) ||
				appointment.patientName.toLowerCase().includes(normalizedSearch);
			return matchLevel && matchStatus && matchSearch;
		});
	}, [appointments, gradeFilter, statusFilter, searchTerm]);

	const columns = useMemo<ColumnDef<Appointment>[]>(
		() => [
			{
				accessorKey: 'patientLevel',
				header: '환자 등급',
				size: 120,
				minSize: 100,
				enableSorting: true,
				cell: ({ getValue }) => {
					const level = getValue<'VIP' | 'Risk' | undefined>();
					if (!level) return null;
					const badgeConfig = levelBadgeMap[level];
					return (
						<PatientBadge level={badgeConfig.level}>{badgeConfig.label}</PatientBadge>
					);
				},
			},
			{
				accessorKey: 'appointmentNumber',
				header: '예약번호',
				size: 150,
				minSize: 120,
				enableSorting: true,
				cell: ({ getValue }) => (
					<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
						{getValue<string>()}
					</span>
				),
			},
			{
				accessorKey: 'patientName',
				header: '환자명',
				size: 150,
				minSize: 100,
				enableSorting: true,
				cell: ({ getValue }) => (
					<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
						{getValue<string>()}
					</span>
				),
			},
			{
				accessorKey: 'preferredDateTime',
				header: '진료 희망 일시',
				size: 180,
				minSize: 150,
				enableSorting: true,
				cell: ({ getValue }) => (
					<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
						{getValue<string>()}
					</span>
				),
			},
			{
				accessorKey: 'doctor',
				header: '담당 의사',
				size: 150,
				minSize: 120,
				enableSorting: true,
				cell: ({ getValue }) => (
					<span className="text-text-100 text-16 font-normal font-pretendard leading-normal">
						{getValue<string>()}
					</span>
				),
			},
			{
				accessorKey: 'status',
				header: '진료 상태',
				size: 120,
				minSize: 100,
				enableSorting: true,
				cell: ({ getValue }) => {
					const status = getValue<Appointment['status']>();
					return (
						<span
							className={cn(
								'text-16 font-normal font-pretendard leading-normal',
								appointmentStatusColor[status],
							)}
						>
							{status}
						</span>
					);
				},
			},
		],
		[],
	);

	return (
		<Section
			title="오늘 진료 예정"
			count={filteredAppointments.length}
			className={className}
			headerFixed={appointmentTableHeaderFixed}
			onHeaderFixedChange={setAppointmentTableHeaderFixed}
			filters={
				<div className="flex flex-wrap items-center gap-3">
					<Dropdown
						value={gradeFilter}
						onChange={(value) => setGradeFilter(value as typeof gradeFilter)}
						options={gradeOptions}
						placeholder="전체 등급"
						className="w-[150px]"
					/>
					<Dropdown
						value={statusFilter}
						onChange={(value) => setStatusFilter(value as typeof statusFilter)}
						options={statusOptions}
						placeholder="전체 상태"
						className="w-[150px]"
					/>
				</div>
			}
			searchPlaceholder="예약번호 또는 환자명을 입력해주세요."
			searchValue={searchTerm}
			onSearch={setSearchTerm}
			onExpand={onExpand}
			isExpanded={isExpanded}
			contentClassName="p-0"
		>
			<Table
				data={filteredAppointments}
				columns={columns}
				enableSelection={true}
				selectedIds={selectedRowIds}
				onSelectionChange={setSelectedRowIds}
				getRowId={(appointment) => appointment.id}
				getRowClassName={(row: Row<Appointment>) =>
					cn(
						row.index % 2 === 0
							? 'bg-bg-white hover:bg-gray-100'
							: 'bg-bg-gray hover:bg-gray-100',
					)
				}
				stickyHeader={appointmentTableHeaderFixed}
				sorting={sorting}
				onSortingChange={setSorting}
				emptyState={<EmptyState message="진료 예정 목록이 없습니다." />}
			/>
		</Section>
	);
}
