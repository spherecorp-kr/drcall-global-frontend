import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import type { ConfirmedTableColumnProps, PatientLevel } from '@/shared/types/appointment';
import { useCallback, useMemo } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { levelBadgeMap } from '@/shared/utils/constants';
import { PatientBadge } from '@/shared/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const sampleData: ConfirmedTableColumnProps[] = [
	{
		appointmentSequence: 3,
		appointmentNumber: '20251030-003',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		patientLevel: 'VIP',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	},
	{
		appointmentSequence: 2,
		appointmentNumber: '20251030-002',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자2',
		patientLevel: 'Risk',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	},
	{
		appointmentSequence: 1,
		appointmentNumber: '20251030-001',
		appointmentDatetime: '30/10/25 14:01~14:15',
		doctorName: 'Dr.KR',
		patientName: '환자3',
		symptom: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
	}
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

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

const ConfirmedTable = () => {
	const navigate = useNavigate();

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

	// 상세 페이지로 이동
	const navigateToDetails = useCallback((row: Row<ConfirmedTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentSequence}`);
	}, [navigate]);

	return (
		<div className="bg-white border border-[#e0e0e0] flex flex-col gap-2.5 h-full rounded-[0.625rem]">
			<Table
				className='flex-1 h-auto'
				colgroup={<ColGroup />}
				columns={columns}
				data={sampleData}
				emptyState={<EmptyState message="예약 대기 목록이 없습니다." />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
		</div>
	);
};

export default ConfirmedTable;