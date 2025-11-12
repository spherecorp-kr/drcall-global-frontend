import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { CompletedTableColumnProps } from '@/shared/types/appointment';
import { useNavigate } from 'react-router-dom';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import { AppointmentStatus } from '@/shared/constants/appointment';
import { format } from 'date-fns';

const cellSpanClass: string = 'font-normal leading-normal text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="13%" />
		<col width="13%" />
		<col width="22%" />
		<col width="22%" />
		<col width="10%" />
		<col width="10%" />
		<col width="10%" />
	</colgroup>
);

/**
 * Convert backend Appointment to UI CompletedTableColumnProps
 */
const transformAppointmentToCompleted = (appointment: Appointment): CompletedTableColumnProps => {
	// Map payment status to Korean
	const paymentStatusMap: Record<string, string> = {
		'PENDING': '대기',
		'PROCESSING': '처리 중',
		'COMPLETED': '완료',
		'FAILED': '실패',
		'REFUNDED': '환불'
	};

	// Map prescription status
	let prescriptionStatus = '미발급';
	if (appointment.hasPrescription === true) {
		prescriptionStatus = appointment.prescriptionUploadedAt ? '완료' : '업로드 대기';
	}

	return {
		appointmentNumber: appointment.externalId,
		completedDatetime: appointment.endedAt
			? format(new Date(appointment.endedAt), 'dd/MM/yy HH:mm')
			: '-',
		doctorName: `Doctor ${appointment.doctorId}`, // TODO: Get from doctor replica
		patientName: `Patient ${appointment.patientId}`, // TODO: Get from patient replica
		prescriptionStatus,
		paymentStatus: appointment.paymentStatus ? paymentStatusMap[appointment.paymentStatus] || appointment.paymentStatus : '예정',
		deliveryStatus: '약 없음', // TODO: Add shipment integration
	};
};

const CompletedTable = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<CompletedTableColumnProps[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const pageSize = 10;

	// Fetch appointments with status COMPLETED
	useEffect(() => {
		const fetchAppointments = async () => {
			setIsLoading(true);
			try {
				const response = await appointmentService.getAppointments(
					AppointmentStatus.COMPLETED,
					currentPage,
					pageSize
				);

				const transformed = response.appointments.map(transformAppointmentToCompleted);
				setData(transformed);
				setTotalPages(Math.ceil(response.total / pageSize));
			} catch (error) {
				console.error('Failed to fetch completed appointments:', error);
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

	const navigateToDetails = useCallback((row: Row<CompletedTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentNumber}`);
	}, [navigate]);

	const columns = useMemo<ColumnDef<CompletedTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 번호',
			minSize: 100
		},
		{
			accessorKey: 'completedDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '진료 완료 일시',
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
			accessorKey: 'prescriptionStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '처방전 상태',
			minSize: 100
		},
		{
			accessorKey: 'paymentStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '결제 상태',
			minSize: 100
		},
		{
			accessorKey: 'deliveryStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '배송 상태',
			minSize: 100
		},
	], []);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className='flex-1 h-auto'
				colgroup={<ColGroup />}
				columns={columns}
				data={data}
				disableHorizontalScroll
				emptyState={<EmptyState message={isLoading ? "로딩 중..." : "진료 완료 목록이 없습니다."} />}
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

export default CompletedTable;