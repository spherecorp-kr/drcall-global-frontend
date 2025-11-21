import { useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { cn } from '@/shared/utils/cn';
import { Section } from './Section';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { Dropdown, EmptyState, Table } from '@/shared/components/ui';
import type { DropdownOption } from '@/shared/types/dropdown';
import { levelBadgeMap } from '@/shared/utils/constants';
import { useTranslation } from 'react-i18next';

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

const statusKeyMap: Record<Appointment['status'], string> = {
	'진료 대기': 'waiting',
	'진료 중': 'inProgress',
	'진료 완료': 'completed',
	'예약 취소': 'cancelled',
};

const AppointmentTable = ({
	appointments,
	className,
	onExpand,
	isExpanded,
}: AppointmentTableProps) => {
	const { t } = useTranslation();
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

	const gradeOptions: DropdownOption[] = useMemo(
		() => [
			{ value: 'all', label: t('appointment.search.allGrade') },
			{ value: 'VIP', label: 'VIP' },
			{ value: 'Risk', label: 'Risk' },
		],
		[t],
	);

	const statusOptions: DropdownOption[] = useMemo(
		() => [
			{ value: 'all', label: t('appointment.search.all') },
			{ value: '진료 대기', label: t('appointment.table.status.waiting') },
			{ value: '진료 중', label: t('appointment.table.status.inProgress') },
			{ value: '진료 완료', label: t('appointment.table.status.completed') },
			{ value: '예약 취소', label: t('appointment.table.status.cancelled') },
		],
		[t],
	);

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
				header: t('appointment.table.columns.patientLevel'),
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
				header: t('appointment.table.columns.appointmentNumber'),
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
				header: t('appointment.table.columns.patientName'),
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
				header: t('appointment.table.columns.appointmentDatetime'),
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
				header: t('appointment.table.columns.doctorInCharge'),
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
				header: t('appointment.table.columns.status'),
				size: 120,
				minSize: 100,
				enableSorting: true,
				cell: ({ getValue }) => {
					const status = getValue<Appointment['status']>();
					const statusKey = statusKeyMap[status];
					return (
						<span
							className={cn(
								'text-16 font-normal font-pretendard leading-normal',
								appointmentStatusColor[status],
							)}
						>
							{t(`appointment.table.status.${statusKey}`)}
						</span>
					);
				},
			},
		],
		[t],
	);

	return (
		<Section
			title={t('appointment.table.title')}
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
						placeholder={t('appointment.search.allGrade')}
						className="w-[150px]"
					/>
					<Dropdown
						value={statusFilter}
						onChange={(value) => setStatusFilter(value as typeof statusFilter)}
						options={statusOptions}
						placeholder={t('appointment.table.filters.allStatus')}
						className="w-[150px]"
					/>
				</div>
			}
			searchPlaceholder={t('appointment.search.placeholders.appointmentOrPatient')}
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
					row.index % 2 === 0 ? 'bg-bg-white' : 'bg-bg-gray'
				}
				stickyHeader={appointmentTableHeaderFixed}
				sorting={sorting}
				onSortingChange={setSorting}
				emptyState={<EmptyState message={t('appointment.table.empty')} />}
			/>
		</Section>
	);
}

export default AppointmentTable;