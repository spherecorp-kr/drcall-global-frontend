import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import { useCallback, useMemo } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type {
	AppointmentType,
	PatientLevel,
	WaitingTableColumnProps,
} from '@/shared/types/appointment';
import { levelBadgeMap } from '@/shared/utils/constants';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

// 샘플 데이터
const sampleData: WaitingTableColumnProps[] = [
	{
		appointmentSequence: 9,
		appointmentType: 'aptmt',
		appointmentDatetime: '22/06/25 14:01~14:15',
		patientName: '환자1',
		patientLevel: 'VIP',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 8,
		appointmentType: 'sdn',
		patientName: '환자1',
		patientLevel: 'VIP',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 6,
		appointmentType: 'aptmt',
		appointmentDatetime: '22/06/25 14:01~14:15',
		patientName: '환자1',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 5,
		appointmentType: 'sdn',
		patientName: '환자1',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 4,
		appointmentType: 'aptmt',
		appointmentDatetime: '22/06/25 14:01~14:15',
		patientName: '환자1',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 3,
		appointmentType: 'sdn',
		patientName: '환자1',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 2,
		appointmentType: 'aptmt',
		appointmentDatetime: '22/06/25 14:01~14:15',
		patientName: '환자1',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
	{
		appointmentSequence: 1,
		appointmentType: 'sdn',
		patientName: '환자1',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		appointmentRequestTime: '21/06/25 09:45:18',
	},
];

const cellSpanClass: string = 'font-normal leading-normal text-base text-text-100';

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

const WaitingTable = () => {
	const navigate = useNavigate();

	const columns = useMemo<ColumnDef<WaitingTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentType',
			cell: ({ getValue }) => {
				if (getValue<AppointmentType>() === 'sdn') {
					return <span className="font-normal leading-normal text-base text-primary-70">빠른 진료</span>;
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
			cell: ({ getValue }) => <span className={`${cellSpanClass} block min-w-0 truncate`}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '환자명',
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
			cell: ({ getValue }) => <span className={`${cellSpanClass} block min-w-0 truncate`}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '증상',
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
				data={sampleData}
				disableHorizontalScroll
				emptyState={<EmptyState message="예약 대기 목록이 없습니다." />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
		</div>
	);
};

export default WaitingTable;
