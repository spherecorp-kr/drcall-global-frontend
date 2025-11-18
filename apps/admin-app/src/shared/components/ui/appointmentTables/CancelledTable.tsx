import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import type { CancelledTableColumnProps } from '@/shared/types/appointment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import { AppointmentStatus } from '@/shared/constants/appointment';
import { format } from 'date-fns';

const cellSpanClass: string = 'font-normal leading-normal text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="13%" />
		<col width="10%" />
		<col width="32%" />
		<col width="32%" />
	</colgroup>
);

/**
 * Convert backend Appointment to UI CancelledTableColumnProps
 */
const transformAppointmentToCancelled = (appointment: Appointment): CancelledTableColumnProps => {
	return {
		appointmentSequence: appointment.id,
		appointmentNumber: appointment.externalId,
		cancelledDatetime: appointment.cancelledAt
			? format(new Date(appointment.cancelledAt), 'dd/MM/yy HH:mm')
			: '-',
		canceler: (appointment.cancelledBy || 'SYSTEM') as 'HOSPITAL' | 'PATIENT' | 'SYSTEM',
		doctorName: `Doctor ${appointment.doctorId}`, // TODO: Get from doctor replica
		patientName: `Patient ${appointment.patientId}`, // TODO: Get from patient replica
	};
};

const CancelledTable = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [data, setData] = useState<CancelledTableColumnProps[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const pageSize = 10;

	// Fetch appointments with status CANCELLED
	useEffect(() => {
		const fetchAppointments = async () => {
			setIsLoading(true);
			try {
				const response = await appointmentService.getAppointments(
					AppointmentStatus.CANCELLED,
					currentPage,
					pageSize
				);

				const transformed = response.appointments.map(transformAppointmentToCancelled);
				setData(transformed);
				setTotalPages(Math.ceil(response.total / pageSize));
			} catch (error) {
				console.error('Failed to fetch cancelled appointments:', error);
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

	const navigateToDetails = useCallback((row: Row<CancelledTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentNumber}`);
	}, [navigate]);

	const columns = useMemo<ColumnDef<CancelledTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 번호',
			minSize: 100
		},
		{
			accessorKey: 'cancelledDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 취소 일시',
			minSize: 100
		},
		{
			accessorKey: 'canceler',
			cell: ({ getValue }) => {
				const value = getValue<string>().toLowerCase();
				return (
					<span className={cellSpanClass}>{t(`canceler.${value}`)}</span>
				);
			},
			enableSorting: false,
			header: '취소자',
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
		}
	], [t]);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className='flex-1 h-auto'
				colgroup={<ColGroup />}
				columns={columns}
				data={data}
				disableHorizontalScroll
				emptyState={<EmptyState message={isLoading ? "로딩 중..." : "예약 취소 목록이 없습니다."} />}
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

export default CancelledTable;