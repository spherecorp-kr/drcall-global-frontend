import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type {
	AppointmentType,
	PatientLevel,
	WaitingTableColumnProps,
} from '@/shared/types/appointment';
import { levelBadgeMap } from '@/shared/utils/constants';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { appointmentService, type Appointment } from '@/services/appointmentService';
import { AppointmentStatus } from '@/shared/constants/appointment';
import { format } from 'date-fns';

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

const ColGroup = () => (
	<colgroup>
		<col width="10%" />
		<col width="13%" />
		<col width="19%" />
		<col width="7%" />
		<col width="38%" />
		<col width="13%" />
	</colgroup>
);

/**
 * Convert backend Appointment to UI WaitingTableColumnProps
 */
const transformAppointmentToWaiting = (appointment: Appointment): WaitingTableColumnProps => {
	return {
		appointmentSequence: appointment.id,
		appointmentType: appointment.appointmentType === 'QUICK' ? 'sdn' : 'aptmt',
		appointmentDatetime: appointment.scheduledAt
			? format(new Date(appointment.scheduledAt), 'yy/MM/dd HH:mm')
			: undefined,
		patientName: `Patient ${appointment.patientId}`, // TODO: Get from patient replica
		patientLevel: undefined, // TODO: Get from patient replica
		symptom: appointment.symptoms,
		appointmentRequestTime: format(new Date(appointment.createdAt), 'yy/MM/dd HH:mm:ss'),
	};
};

const WaitingTable = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<WaitingTableColumnProps[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const pageSize = 10;

	// Fetch appointments with status PENDING
	useEffect(() => {
		const fetchAppointments = async () => {
			setIsLoading(true);
			try {
				const response = await appointmentService.getAppointments(
					AppointmentStatus.PENDING,
					currentPage,
					pageSize
				);

				const transformed = response.appointments.map(transformAppointmentToWaiting);
				setData(transformed);
				setTotalPages(Math.ceil(response.total / pageSize));
			} catch (error) {
				console.error('Failed to fetch appointments:', error);
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

	const columns = useMemo<ColumnDef<WaitingTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentType',
			cell: ({ getValue }) => {
				if (getValue<AppointmentType>() === 'sdn') {
					return <span className="font-normal leading-[normal] text-base text-primary-70">빠른 진료</span>;
				}
				return <span className={cellSpanClass}>일반 진료</span>;
			},
			enableSorting: false,
			header: '예약 유형',
			minSize: 100,
		},
		{
			accessorKey: 'appointmentDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>() || '-'}</span>,
			enableSorting: false,
			header: '진료 희망 일시',
			minSize: 100,
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
		{
			accessorKey: 'appointmentRequestTime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '예약 신청 일시',
			minSize: 100,
		},
	], []);

	// 상세 페이지로 이동
	const navigateToDetails = useCallback((row: Row<WaitingTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentSequence}`);
	}, [navigate]);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className="flex-1 h-auto"
				colgroup={<ColGroup />}
				columns={columns}
				data={data}
				disableHorizontalScroll
				emptyState={<EmptyState message={isLoading ? "로딩 중..." : "예약 대기 목록이 없습니다."} />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-white' : 'bg-bg-gray'}
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

export default WaitingTable;
