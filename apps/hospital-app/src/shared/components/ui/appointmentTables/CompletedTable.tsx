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
		prescriptionStatus: '예정',
		paymentStatus: '완료',
		deliveryStatus: '조제중'
	},
	{
		appointmentSequence: 6,
		appointmentNumber: '20251030-006',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		prescriptionStatus: '발급',
		paymentStatus: '대기',
		deliveryStatus: '배송중'
	},
	{
		appointmentSequence: 5,
		appointmentNumber: '20251030-005',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '발급',
		paymentStatus: '예정',
		deliveryStatus: '조제 완료'
	},
	{
		appointmentSequence: 4,
		appointmentNumber: '20251030-004',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Dr.KR',
		patientName: '환자1',
		prescriptionStatus: '예정',
		paymentStatus: '완료',
		deliveryStatus: '-'
	},
	{
		appointmentSequence: 3,
		appointmentNumber: '20251030-003',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '발급',
		paymentStatus: '완료',
		deliveryStatus: '수령 완료'
	},
	{
		appointmentSequence: 2,
		appointmentNumber: '20251030-002',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '발급',
		paymentStatus: '완료',
		deliveryStatus: '배송중'
	},
	{
		appointmentSequence: 1,
		appointmentNumber: '20251030-001',
		completedDatetime: '30/10/25 14:15',
		doctorName: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
		patientName: '환자1',
		prescriptionStatus: '없음',
		paymentStatus: '예정',
		deliveryStatus: '-'
	},
];

const cellSpanClass: string = 'font-normal leading-[normal] text-base text-text-100';

// 상태 값 매핑 객체
const prescriptionStatusMap: Record<string, string> = {
	'예정': 'upcoming',
	'발급': 'issued',
	'없음': 'none',
};

const paymentStatusMap: Record<string, string> = {
	'예정': 'upcoming',
	'대기': 'waiting',
	'완료': 'completed',
};

const deliveryStatusMap: Record<string, string> = {
	'조제중': 'preparing',
	'배송중': 'shipping',
	'조제 완료': 'prepared',
	'수령 완료': 'delivered',
};

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
			cell: ({ getValue }) => {
				const value = getValue<string>();
				const statusKey = prescriptionStatusMap[value];
				return (
					<span className={cellSpanClass}>
						{statusKey ? t(`appointment.table.statusValues.prescriptionStatus.${statusKey}`) : value}
					</span>
				);
			},
			enableSorting: false,
			header: t('appointment.table.columns.prescriptionStatus'),
			minSize: 100,
		},
		{
			accessorKey: 'paymentStatus',
			cell: ({ getValue }) => {
				const value = getValue<string>();
				const statusKey = paymentStatusMap[value];
				return (
					<span className={cellSpanClass}>
						{statusKey ? t(`appointment.table.statusValues.paymentStatus.${statusKey}`) : value}
					</span>
				);
			},
			enableSorting: false,
			header: t('appointment.table.columns.paymentStatus'),
			minSize: 100,
		},
		{
			accessorKey: 'deliveryStatus',
			cell: ({ getValue }) => {
				const value = getValue<string>();
				// '-'는 번역하지 않음
				if (value === '-') {
					return <span className={cellSpanClass}>-</span>;
				}
				const statusKey = deliveryStatusMap[value];
				return (
					<span className={cellSpanClass}>
						{statusKey ? t(`appointment.table.statusValues.deliveryStatus.${statusKey}`) : value}
					</span>
				);
			},
			enableSorting: false,
			header: t('appointment.table.columns.deliveryStatus'),
			minSize: 100,
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
				emptyState={<EmptyState message={t('appointment.table.emptyCompleted')} />}
				enableSelection
				getRowClassName={(row) => row.index % 2 === 0 ? 'bg-white' : 'bg-bg-gray'}
				onRowClick={navigateToDetails}
			/>
			<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
		</div>
	);
};

export default CompletedTable;