import { EmptyState, Pagination, Table } from '@/shared/components/ui';
import { useCallback, useMemo } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import type { CompletedTableColumnProps } from '@/shared/types/appointment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const sampleData: CompletedTableColumnProps[] = [
	{
		appointmentSequence: 7,
		appointmentNumber: '20251030-007',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '업로드 대기',
		paymentStatus: '완료',
		deliveryStatus: '조제중'
	},
	{
		appointmentSequence: 6,
		appointmentNumber: '20251030-006',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		prescriptionStatus: '완료',
		paymentStatus: '대기',
		deliveryStatus: '배송중'
	},
	{
		appointmentSequence: 5,
		appointmentNumber: '20251030-005',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '예정',
		deliveryStatus: '조제 완료'
	},
	{
		appointmentSequence: 4,
		appointmentNumber: '20251030-004',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '업로드 대기',
		paymentStatus: '완료',
		deliveryStatus: '조제 완료'
	},
	{
		appointmentSequence: 3,
		appointmentNumber: '20251030-003',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '완료',
		deliveryStatus: '수령 완료'
	},
	{
		appointmentSequence: 2,
		appointmentNumber: '20251030-002',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '완료',
		paymentStatus: '완료',
		deliveryStatus: '배송중'
	},
	{
		appointmentSequence: 1,
		appointmentNumber: '20251030-001',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '미발급',
		paymentStatus: '예정',
		deliveryStatus: '약 없음'
	},
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

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
	const navigate = useNavigate();
	const { t } = useTranslation();

	const columns = useMemo<ColumnDef<CompletedTableColumnProps>[]>(() => [
		{
			accessorKey: 'appointmentNumber',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.appointmentNumber'),
			minSize: 100
		},
		{
			accessorKey: 'completedDatetime',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.completedDatetime'),
			minSize: 100
		},
		{
			accessorKey: 'doctorName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.doctor'),
			meta: { truncate: true }
		},
		{
			accessorKey: 'patientName',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.patientName'),
			meta: { truncate: true }
		},
		{
			accessorKey: 'prescriptionStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.prescriptionStatus'),
			minSize: 100
		},
		{
			accessorKey: 'paymentStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.paymentStatus'),
			minSize: 100
		},
		{
			accessorKey: 'deliveryStatus',
			cell: ({ getValue }) => <span className={cellSpanClass}>{getValue<string>()}</span>,
			enableSorting: false,
			header: t('appointment.table.columns.deliveryStatus'),
			minSize: 100
		},
	], [t]);

	// 상세 페이지로 이동
	const navigateToDetails = useCallback((row: Row<CompletedTableColumnProps>) => {
		navigate(`/appointment/${row.original.appointmentSequence}`);
	}, [navigate]);

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
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
		</div>
	);
};

export default CompletedTable;