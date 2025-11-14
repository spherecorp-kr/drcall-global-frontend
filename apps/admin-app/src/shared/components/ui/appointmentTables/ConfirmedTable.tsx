import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import type { ConfirmedTableColumnProps, PatientLevel } from '@/shared/types/appointment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { levelBadgeMap } from '@/shared/utils/constants.ts';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import { AppointmentStatus } from '@/shared/constants/appointment';
import { format } from 'date-fns';

const cellSpanClass: string = 'font-normal leading-normal text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="13%" />
		<col width="19%" />
		<col width="19%" />
		<col width="7%" />
		<col width="29%" />
	</colgroup>
);

/**
 * Convert backend Appointment to UI ConfirmedTableColumnProps
 */
const transformAppointmentToConfirmed = (appointment: Appointment): ConfirmedTableColumnProps => {
	return {
		appointmentNumber: appointment.externalId,
		appointmentDatetime: appointment.scheduledAt
			? format(new Date(appointment.scheduledAt), 'dd/MM/yy HH:mm')
			: '-',
		doctorName: `Doctor ${appointment.doctorId}`, // TODO: Get from doctor replica
		patientName: `Patient ${appointment.patientId}`, // TODO: Get from patient replica
		patientLevel: undefined, // TODO: Get from patient replica
		symptom: appointment.symptoms,
	};
};

const ConfirmedTable = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<ConfirmedTableColumnProps[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const pageSize = 10;

	// Fetch appointments with status CONFIRMED
	useEffect(() => {
		const fetchAppointments = async () => {
			setIsLoading(true);
			try {
				const response = await appointmentService.getAppointments(
					AppointmentStatus.CONFIRMED,
					currentPage,
					pageSize
				);

				const transformed = response.appointments.map(transformAppointmentToConfirmed);
				setData(transformed);
				setTotalPages(Math.ceil(response.total / pageSize));
			} catch (error) {
				console.error('Failed to fetch confirmed appointments:', error);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAppointments();
	}, [currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Navigate to detail page - extract ID from externalId
	const navigateToDetails = useCallback((row: Row<ConfirmedTableColumnProps>) => {
		// appointmentNumber is externalId, but we need to fetch by it
		// For now, navigate with externalId
		navigate(`/appointment/${row.original.appointmentNumber}`);
	}, [navigate]);

	const columns = useMemo<ColumnDef<ConfirmedTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 번호',
			minSize: 100
		},
		{
			accessorKey: 'appointmentDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '진료 희망 일시',
			minSize: 100
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '의사',
			meta: { truncate: true }
		},
		{
			accessorKey: 'patientName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '환자명',
			meta: { truncate: true }
		},
		{
			accessorKey: 'patientLevel',
			cell: ({ getValue }) => {
				const value = getValue<PatientLevel | undefined>();
				if (!value) return null;
				const { label, level } = levelBadgeMap[value];
				return (
					<PatientBadge level={level}>{label}</PatientBadge>
				);
			},
			enableSorting: false,
			header: '환자 등급',
			size: 100,
		},
		{
			accessorKey: 'symptom',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '증상',
			meta: { truncate: true }
		},
	], []);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className='flex-1 h-auto'
				colgroup={<ColGroup />}
				columns={columns}
				data={data}
				emptyState={<EmptyState message={isLoading ? "로딩 중..." : "예약 확정 목록이 없습니다."} />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default ConfirmedTable;