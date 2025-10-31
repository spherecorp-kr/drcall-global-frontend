import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { CompletedTableColumnProps } from '@/shared/types/appointment';

const sampleData: CompletedTableColumnProps[] = [
	{
		appointmentNumber: '20251030-001',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '업로드 대기',
		paymentStatus: '완료',
		deliveryStatus: '조제중'
	},
	{
		appointmentNumber: '20251030-002',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		prescriptionStatus: '완료',
		paymentStatus: '대기',
		deliveryStatus: '배송중'
	},
	{
		appointmentNumber: '20251030-003',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '예정',
		deliveryStatus: '조제 완료'
	},
	{
		appointmentNumber: '20251030-004',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '업로드 대기',
		paymentStatus: '완료',
		deliveryStatus: '조제 완료'
	},
	{
		appointmentNumber: '20251030-005',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '완료',
		deliveryStatus: '수령 완료'
	},
	{
		appointmentNumber: '20251030-006',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '완료',
		deliveryStatus: '배송중'
	},
	{
		appointmentNumber: '20251030-006',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '미발급',
		paymentStatus: '예정',
		deliveryStatus: '약 없음'
	},
];

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

const CompletedTable = () => {
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
			cell: ({ getValue }) => <span className={`${cellSpanClass} block min-w-0 truncate`}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '의사',
		},
		{
			accessorKey: 'patientName',
			cell: ({ getValue }) => <span className={`${cellSpanClass} block min-w-0 truncate`}>{getValue<string>()}</span>,
			enableSorting: false,
			header: '환자명',
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
				data={sampleData}
				disableHorizontalScroll
				emptyState={<EmptyState message="진료 완료 목록이 없습니다." />}
				enableSelection
				getRowClassName={() => cn('active:bg-bg-blue bg-white hover:bg-bg-gray')}
			/>
			<Pagination />
		</div>
	);
};

export default CompletedTable;